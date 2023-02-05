import { ColorChoose } from "@/types/colorChoose";
import { Details } from "@/types/product";
import { FC, useState, useEffect, useMemo, FormEvent } from "react";
import Container from "../Container/Container";
import cl from "./adminPanel.module.scss";
import { useMutation, useQuery } from "@apollo/client";
import { FETCH_COLORS, FETCH_PRODUCT_TYPES } from "@/graphQL/fetchList";
import ColorPick from "../ColorPick/ColorPick";
import SizeAvailable from "./SizeAvailable/SizeAvailable";
import AddColorForm from "./AddColorForm/AddColorForm";
import AddProductTypeForm from "./AddProductTypeForm/AddProductTypeFrom";
import { Sizes } from "@/types/sizes";
import SizePick from "../SizePick/SizePick";
import { ADD_PRODUCT } from "@/graphQL/mutationList";
import { addToDatabase } from "@/service/addToDatabase";

const AdminPanel: FC = () => {
  const allSizes = useMemo(
    () => [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
    []
  );
  const [inputs, setInputs] = useState<{
    title: string;
    description: string;
    price: string;
    type: string;
  }>(() => {
    return {
      title: "",
      description: "",
      price: "",
      type: "",
    };
  });
  const [stock, setStock] = useState<Map<string, Sizes>>(new Map());
  const [sizesToSell, setSizesToSell] = useState<Map<number, number>>(() => {
    const map = new Map();
    for (let i = 36; i <= 47; i++) map.set(i, i);
    return map;
  });

  const [colorList, setColorList] = useState<ColorChoose[]>();
  const [productTypeList, setProductTypeList] = useState<string[]>();
  const [choosedColors, setChoosedColors] = useState<Map<string, boolean>>(
    new Map()
  );
  const [addProductResultMessage, setAddProductResultMessage] = useState("");

  const changeChoosedColors = (value: string | number) => {
    setChoosedColors((prev) => {
      const copy = new Map(prev);
      if (copy.get(value.toString())) copy.delete(value.toString());
      else copy.set(value.toString(), true);
      return copy;
    });
  };
  useQuery(FETCH_COLORS, {
    onCompleted: (data: {
      colors: {
        name: string;
        code: string;
      }[];
    }) => setColorList(data.colors),
  });
  useQuery(FETCH_PRODUCT_TYPES, {
    onCompleted: (data: {
      allProductTypes: {
        name: string;
      }[];
    }) => {
      setInputs({ ...inputs, type: data.allProductTypes[0].name });
      setProductTypeList(data.allProductTypes.map((type) => type.name));
    },
  });

  useEffect(() => {
    const map = new Map(sizesToSell);
    Array.from(stock.values()).forEach((stockSize) => {
      if (sizesToSell.size === 0) return;
      sizesToSell.forEach((size) => {
        //@ts-expect-error
        if (stockSize[`_${size}`]) map.delete(size);
      });
    });

    setSizesToSell(map);
  }, [stock]);

  const onClickSize = (value: string | number) => {
    const temp = new Map(sizesToSell);
    if (temp.get(Number(value))) temp.delete(Number(value));
    else temp.set(Number(value), Number(value));
    setSizesToSell(temp);
  };

  const addProductInputs = Object.entries(inputs).map((input) => {
    if (input[0] === "type") return;
    const title = input[0].slice(0, 1).toUpperCase() + input[0].slice(1);
    return (
      <div className={cl.input}>
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

  const colorListElems = colorList?.map((color) => (
    <ColorPick
      name={color.name}
      colorCode={color.code}
      active={!!choosedColors.get(color.name)}
      setFilter={changeChoosedColors}
      key={color.code}
    />
  ));
  const productTypeListElems = productTypeList?.map((type) => (
    <option>{type.slice(0, 1).toUpperCase() + type.slice(1)}</option>
  ));

  const stockByColors = Array.from(choosedColors, (color) => color[0]).map(
    (color) => <SizeAvailable color={color} stock={stock} setStock={setStock} />
  );
  const sizesFilter = allSizes.map((size) => {
    return (
      <SizePick
        size={size}
        active={!sizesToSell.get(size)}
        setFilter={onClickSize}
        key={size}
      />
    );
  });

  const [addProductTypeMutation] = useMutation(ADD_PRODUCT, {
    onCompleted: (data) => {
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
        return { name: stock[0], sizesAvailable: stock[1] };
      }),
    };
    console.log(product);
    addProductTypeMutation({ variables: product });
  };
  return (
    <Container>
      <div className={cl.wrapper}>
        <form className={cl.form} onSubmit={addProduct}>
          <div className={cl.container__title}>Add Product</div>
          {addProductInputs}
          <div className={cl.input}>
            <div className={cl.input}>
              <select
                name="productTypes"
                onChange={(e) => setInputs({ ...inputs, type: e.target.value })}
              >
                {productTypeListElems}
              </select>
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
        <AddColorForm colorList={colorList} setColorList={setColorList} />
        <AddProductTypeForm
          productTypeList={productTypeList}
          setProductTypeList={setProductTypeList}
        />
      </div>
    </Container>
  );
};

export default AdminPanel;
