import ColorPick from "@/components/ColorPick/ColorPick";
import SizePick from "@/components/SizePick/SizePick";
import { ADD_PRODUCT, DELETE_PRODUCT_TYPE } from "@/graphQL/mutationList";
import { addToDatabase } from "@/service/addToDatabase";
import { ColorChoose } from "@/types/colorChoose";
import { Details } from "@/types/product";
import { Sizes } from "@/types/sizes";
import { useMutation } from "@apollo/client";
import {
  FC,
  useMemo,
  useState,
  useEffect,
  FormEvent,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import SizeAvailable from "../SizeAvailable/SizeAvailable";
import cl from "../addForms.module.scss";

interface AddProductProps {
  inputs: {
    title: string;
    description: string;
    price: string;
    type: string;
  };
  setInputs: Dispatch<
    SetStateAction<{
      title: string;
      description: string;
      price: string;
      type: string;
    }>
  >;
  colorList: ColorChoose[] | undefined;
  setColorList: Dispatch<SetStateAction<ColorChoose[] | undefined>>;
  productTypeList: string[] | undefined;
  setProductTypeList: Dispatch<SetStateAction<string[] | undefined>>;
  stock: Map<string, { sizes: Sizes; photos: string[] }>;
  setStock: Dispatch<
    SetStateAction<
      Map<
        string,
        {
          sizes: Sizes;
          photos: string[];
        }
      >
    >
  >;
}

const AddProductForm: FC<AddProductProps> = ({
  stock,
  setStock,
  colorList,
  productTypeList,
  setColorList,
  inputs,
  setInputs,
  setProductTypeList,
}) => {
  const allSizes = useMemo(
    () => [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
    []
  );
  const [sizesToSell, setSizesToSell] = useState<Map<number, number>>(() => {
    const map = new Map();
    for (let i = 36; i <= 47; i++) map.set(i, i);
    return map;
  });
  const [choosedColors, setChoosedColors] = useState<Map<string, boolean>>(
    new Map()
  );
  const [addProductResultMessage, setAddProductResultMessage] = useState("");

  const changeChoosedColors = useCallback(
    (value: string | number) => {
      setChoosedColors((prev) => {
        const copy = new Map(prev);
        if (copy.get(value.toString())) copy.delete(value.toString());
        else copy.set(value.toString(), true);
        return copy;
      });
    },
    [choosedColors]
  );

  useEffect(() => {
    const map = new Map(sizesToSell);
    Array.from(stock.values()).forEach((stockSize) => {
      if (sizesToSell.size === 0) return;
      sizesToSell.forEach((size) => {
        //@ts-expect-error
        if (stockSize.sizes[`_${size}`]) map.delete(size);
      });
    });

    setSizesToSell(map);
  }, [stock]);

  const onClickSize = useCallback(
    (value: string | number) => {
      const temp = new Map(sizesToSell);
      if (temp.get(Number(value))) temp.delete(Number(value));
      else temp.set(Number(value), Number(value));
      setSizesToSell(temp);
    },
    [sizesToSell]
  );

  const addProductInputs = Object.entries(inputs).map((input) => {
    if (input[0] === "type") return;
    const title = input[0].slice(0, 1).toUpperCase() + input[0].slice(1);
    return (
      <div className={cl.input} key={title}>
        <label>{title}</label>
        {input[0] === "description" ? (
          <textarea
            name=""
            id=""
            cols={30}
            rows={10}
            placeholder={title}
            required={true}
            style={{ resize: "none" }}
            onChange={(e) =>
              setInputs({
                ...inputs,
                [input[0]]: e.target.value,
              })
            }
          />
        ) : (
          <input
            type={input[0] === "price" ? "number" : "text"}
            placeholder={title}
            required={true}
            //@ts-ignore
            value={inputs[input[0]]}
            onChange={(e) =>
              setInputs({
                ...inputs,
                [input[0]]: e.target.value,
              })
            }
            onBlur={(e) =>
              input[0] === "price"
                ? setInputs({
                    ...inputs,
                    [input[0]]: Number(e.target.value).toFixed(2),
                  })
                : undefined
            }
          />
        )}
      </div>
    );
  });

  const colorListElems = useMemo(
    () =>
      colorList?.map((color) => (
        <ColorPick
          name={color.name}
          colorCode={color.code}
          active={!!choosedColors.get(color.name)}
          setFilter={changeChoosedColors}
          key={color.name}
          setColorList={setColorList}
        />
      )),
    [colorList]
  );

  const productTypeListElems = useMemo(
    () =>
      productTypeList?.map((type) => (
        <option key={type}>
          {type.slice(0, 1).toUpperCase() + type.slice(1)}
        </option>
      )),
    [productTypeList]
  );

  const stockByColors = useMemo(
    () =>
      Array.from(choosedColors, (color) => color[0]).map((color) => (
        <SizeAvailable
          key={color}
          color={color}
          stock={stock}
          setStock={setStock}
        />
      )),
    [choosedColors]
  );
  const sizesFilter = useMemo(
    () =>
      allSizes.map((size) => {
        return (
          <SizePick
            size={size}
            active={!sizesToSell.get(size)}
            setFilter={onClickSize}
            key={size}
          />
        );
      }),
    [allSizes, sizesToSell]
  );

  const [addProductMutation] = useMutation(ADD_PRODUCT, {
    onCompleted: (data) => {
      if (data.addNewProduct.message) {
        setAddProductResultMessage(data.addNewProduct.message);
        return;
      }
      addToDatabase({
        text: data.addNewProduct.title,
        setResultFunction: setAddProductResultMessage,
      });
    },
    onError: (err) => {
      setAddProductResultMessage(err.message);
      setTimeout(() => setAddProductResultMessage(""), 5000);
    },
  });

  const addProduct = (e: FormEvent) => {
    e.preventDefault();
    const product: Details = {
      ...inputs,
      type: inputs.type.toLowerCase(),
      price: Number(inputs.price),
      allSizes: allSizes.filter((size) => !sizesToSell.get(size)),
      color: Array.from(stock, (stock) => {
        return {
          name: stock[0],
          sizesAvailable: stock[1].sizes,
          photos: stock[1].photos,
        };
      }),
    };
    addProductMutation({ variables: product });
  };

  const [deleteProductTypeMutation] = useMutation(DELETE_PRODUCT_TYPE, {
    onCompleted: (data, err) => {
      if (!data.deleteProductType || err) {
        window.alert(`Error: type has not been deleted`);
        return;
      }
      setProductTypeList((prev) => {
        if (!prev) return;
        const index = prev?.findIndex(
          (elem) => elem === inputs.type.toLowerCase()
        );
        return [...prev?.slice(0, index), ...prev.slice(index + 1)];
      });
    },
    onError: (err) => window.alert(`Error: ${err}`),
  });

  const deleteType = useCallback(() => {
    const { type } = inputs;
    if (window.confirm(`Do you really want to delete ${type} type?`)) {
      deleteProductTypeMutation({
        variables: { name: type.toLowerCase() },
      });
    }
  }, [inputs]);

  return (
    <form className={cl.form} onSubmit={addProduct}>
      <div className={cl.container__title}>Add Product</div>
      {addProductInputs}
      <div className={cl.input}>
        <div className={cl.select}>
          <select
            name="productTypes"
            onChange={(e) => setInputs({ ...inputs, type: e.target.value })}
          >
            {productTypeListElems}
          </select>
          <div className={cl.delete} onClick={deleteType} />
        </div>

        <label>Colors</label>
        <div className={cl.colorChoose}>{colorListElems}</div>
      </div>

      {stockByColors}
      {sizesFilter}
      <button className={cl.submit}>Add Product</button>
      <div
        className={cl.result}
        style={{ display: !addProductResultMessage ? "hidden" : undefined }}
      >
        {addProductResultMessage}
      </div>
    </form>
  );
};

export default AddProductForm;
