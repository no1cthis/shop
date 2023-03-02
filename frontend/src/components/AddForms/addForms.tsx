import { ColorChoose } from "@/types/colorChoose";
import { FC, useState, useEffect } from "react";
import cl from "./addForms.module.scss";
import { useQuery } from "@apollo/client";
import { FETCH_COLORS, FETCH_PRODUCT_TYPES } from "@/graphQL/fetchList";
import AddColorForm from "./AddColorForm/AddColorForm";
import AddProductTypeForm from "./AddProductTypeForm/AddProductTypeFrom";
import { Sizes } from "@/types/sizes";
import AddProductForm from "./AddProductForm/AddProductForm";

const AddForms: FC = () => {
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
  const [stock, setStock] = useState<
    Map<string, { sizes: Sizes; photos: string[] }>
  >(new Map());
  const [sizesToSell, setSizesToSell] = useState<Map<number, number>>(() => {
    const map = new Map();
    for (let i = 36; i <= 47; i++) map.set(i, i);
    return map;
  });

  const [colorList, setColorList] = useState<ColorChoose[]>();
  const [productTypeList, setProductTypeList] = useState<string[]>();

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
        if (stockSize.sizes[`_${size}`]) map.delete(size);
      });
    });

    setSizesToSell(map);
  }, [stock]);

  return (
    <div className={cl.wrapper}>
      <AddProductForm
        stock={stock}
        setStock={setStock}
        colorList={colorList}
        productTypeList={productTypeList}
        inputs={inputs}
        setInputs={setInputs}
        setColorList={setColorList}
        setProductTypeList={setProductTypeList}
      />
      <AddColorForm colorList={colorList} setColorList={setColorList} />
      <AddProductTypeForm
        productTypeList={productTypeList}
        setProductTypeList={setProductTypeList}
      />
    </div>
  );
};

export default AddForms;
