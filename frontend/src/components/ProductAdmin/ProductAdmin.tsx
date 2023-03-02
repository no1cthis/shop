import { Product } from "@/types/product";
import { sizes, Sizes } from "@/types/sizes";
import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import SizeAvailable from "../AddForms/SizeAvailable/SizeAvailable";
import Menu from "../menu/Menu";
import SizePick from "../SizePick/SizePick";
import { MdDelete } from "react-icons/md";
import { AiFillSave } from "react-icons/ai";
import cl from "./productAdmin.module.scss";
import { useMutation, useQuery } from "@apollo/client";
import { FETCH_COLORS, FETCH_PRODUCT_TYPES } from "@/graphQL/fetchList";
import { DELETE_PRODUCT, EDIT_PRODUCT } from "@/graphQL/mutationList";
import ModalWindow from "../ModalWindow/ModalWindow";
import ColorPick from "../ColorPick/ColorPick";

interface ProductAdminProps {
  product: Product;
  setProducts: Dispatch<SetStateAction<Product[]>>;
  setQuantity: Dispatch<SetStateAction<number>>;
}

const ProductAdmin: FC<ProductAdminProps> = ({
  product,
  setProducts,
  setQuantity,
}) => {
  const { data: typesList } = useQuery<{ allProductTypes: { name: string }[] }>(
    FETCH_PRODUCT_TYPES
  );
  const { data: colorList } = useQuery<{
    colors: { name: string; code: string }[];
  }>(FETCH_COLORS);
  const deletedColors = useRef(new Map());

  const { title, description, price, color, allSizes, type, url } = product;
  const [inputs, setInputs] = useState({
    title,
    description,
    price: Number(price).toFixed(2),
    color,
    allSizes,
    type,
    url,
  });

  const [stock, setStock] = useState<
    Map<string, { sizes: Sizes; photos: string[] }>
  >(() => {
    const map = new Map();
    color.forEach((color) => {
      map.set(color.name, {
        sizes: color.sizesAvailable,
        photos: color.photos,
      });
    });
    return map;
  });

  const [isModalActive, setIsModalActive] = useState(false);

  const descriptionActive = useRef<HTMLTextAreaElement>();
  const deleteColor = (name: string) => {
    setStock((prev) => {
      const temp = new Map(prev);
      deletedColors.current.set(name, temp.get(name));
      temp.delete(name);
      return temp;
    });
  };
  const addColor = (name: string) => {
    setStock((prev) => {
      const temp = new Map(prev);
      const saved = deletedColors.current.get(name);
      temp.set(
        name,
        saved
          ? saved
          : {
              sizes: {
                _36: 0,
                _37: 0,
                _38: 0,
                _39: 0,
                _40: 0,
                _41: 0,
                _42: 0,
                _43: 0,
                _44: 0,
                _45: 0,
                _46: 0,
                _47: 0,
              },
              photos: [],
            }
      );
      return temp;
    });
  };
  const colorsElems: React.ReactNode[] = [];
  stock.forEach((_, name) =>
    colorsElems.push(
      <div className={cl.color__wrapper} key={name}>
        <SizeAvailable
          color={name}
          stock={stock}
          key={name}
          setStock={setStock}
          title={title}
        />
        <div className={cl.delete__wrapper}>
          <div className={cl.delete} onClick={() => deleteColor(name)} />
        </div>
      </div>
    )
  );

  const changeColor = (name: string) => {
    if (stock.get(name)) deleteColor(name);
    else addColor(name);
  };

  const colorListElems = colorList?.colors.map((color) => (
    <ColorPick
      name={color.name}
      colorCode={color.code}
      active={!!stock.get(color.name)}
      key={color.name}
      setStock={() => changeColor(color.name)}
    />
  ));

  const typesOptions = typesList?.allProductTypes.map((type) => (
    <option key={type.name}>{type.name}</option>
  ));

  const changeSize = (size: number) => {
    const index = inputs.allSizes.indexOf(size);
    setInputs((prev) => {
      return index === -1
        ? {
            ...prev,
            allSizes: [...prev.allSizes, size],
          }
        : {
            ...prev,
            allSizes: [
              ...prev.allSizes.slice(0, index),
              ...prev.allSizes.slice(index + 1),
            ],
          };
    });
  };

  const sizePickElems = sizes.map((size) => {
    const active = !!inputs.allSizes.find(
      (sizeFromProduct) => size === sizeFromProduct
    );
    return (
      // @ts-expect-error
      <SizePick active={active} size={size} key={size} setFilter={changeSize} />
    );
  });

  const changeInput = (newValue: string, key: string) => {
    setInputs({ ...inputs, [key]: newValue });
  };

  const [editProductMutation, { loading: editLoading }] = useMutation(
    EDIT_PRODUCT,
    {
      onCompleted: (data, err) => {
        if (data.editProduct.message) {
          window.alert(`Error: ${data.editProduct.message}`);
          return;
        }
        if (!data.editProduct) {
          window.alert(`Error: product has not been saved`);
          return;
        }
        setInputs({ ...inputs, url: data.editProduct.url });
        const stock = new Map();
        data.editProduct.color.forEach((color: any) => {
          stock.set(color.name, {
            photos: color.photos,
            sizes: color.sizesAvailable,
          });
        });
        setStock(stock);
      },
      onError: (err) => {
        console.log(err);
        window.alert(`Error: ${err.message}`);
      },
    }
  );

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const color: { name: string; photos: string[]; sizesAvailable: Sizes }[] =
      [];
    stock.forEach(({ photos, sizes }, key) => {
      color.push({
        name: key,
        photos,
        sizesAvailable: sizes,
      });
    });
    editProductMutation({
      variables: {
        ...product,
        ...inputs,
        price: Number(inputs.price),
        color,
      },
    });
  };

  const [deleteProductMutation, { loading: deleteLoading }] = useMutation(
    DELETE_PRODUCT,
    {
      onCompleted: (data) => {
        if (!data.deleteProduct) {
          window.alert(`Error: product has not been deleted`);
          return;
        }
        setProducts((prev) => {
          const index = prev?.findIndex((elem) => elem.url === product.url);
          return [...prev?.slice(0, index), ...prev.slice(index + 1)];
        });
        setQuantity((prev) => prev - 1);
      },
      onError: (err) => {
        console.log(err);
        window.alert(`Error: ${err}`);
      },
    }
  );

  const deleteProduct = () => {
    if (window.confirm(`Do you really want to delete ${title}?`)) {
      deleteProductMutation({
        variables: { url: product.url },
      });
    }
  };

  return (
    <form
      onSubmit={save}
      className={cl.wrapper}
      onClick={(e) => {
        if (
          e.target === descriptionActive.current ||
          !descriptionActive.current
        )
          return;
        descriptionActive.current.rows = 1;
      }}
    >
      <input
        type="text"
        value={inputs.title}
        required={true}
        onChange={(e) => changeInput(e.target.value, "title")}
      />
      <textarea
        cols={30}
        rows={1}
        value={inputs.description}
        onClick={(e) => {
          //@ts-expect-error
          descriptionActive.current = e.target;
          //@ts-expect-error
          e.target.rows = 10;
        }}
        onChange={(e) => changeInput(e.target.value, "description")}
        required={true}
      />
      <input
        type={"number"}
        required={true}
        value={inputs.price}
        onChange={(e) => changeInput(e.target.value, "price")}
        onBlur={(e) =>
          setInputs({
            ...inputs,
            price: Number(e.target.value).toFixed(2),
          })
        }
      />

      <select
        value={inputs.type}
        onChange={(e) => setInputs({ ...inputs, type: e.target.value })}
      >
        {typesOptions}
      </select>

      <Menu title="colors" className={cl.colors}>
        {colorsElems ? colorsElems : null}
        <button
          className={cl.addColorButton}
          type="button"
          onClick={() => setIsModalActive((prev) => !prev)}
        >
          Add color
        </button>
      </Menu>

      <Menu title="Sizes" className={cl.sizes__wrapper}>
        <div className={cl.sizes}>{sizePickElems}</div>
      </Menu>
      <button type="submit" className={cl.button}>
        <AiFillSave className={editLoading ? cl.save__loading : undefined} />
      </button>
      <button type="button" className={cl.button} onClick={deleteProduct}>
        <MdDelete className={deleteLoading ? cl.delete__loading : undefined} />
      </button>
      {isModalActive && (
        <ModalWindow setModal={setIsModalActive}>
          <div
            className={cl.colorList__wrapper}
            style={{
              // @ts-expect-error
              "grid-template-columns":
                colorList && colorList.colors.length > 10
                  ? `repeat(10, 1fr)`
                  : `repeat(${colorList?.colors.length}, 1fr)`,
            }}
          >
            {colorListElems}
          </div>
        </ModalWindow>
      )}
    </form>
  );
};

export default ProductAdmin;
