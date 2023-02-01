import React, { FC, useEffect, useState } from "react";
import Card from "../Card/Card";
import { Product } from "../../types/product";

import cl from "./List.module.scss";
import Container from "../Container/Container";
import Filter from "../Filter/Filter";
import { ApolloError, useLazyQuery } from "@apollo/client";
import {
  FETCH_PRODUCTS_BY_POPULARITY,
  FETCH_PRODUCTS_BY_PRICE,
} from "@/service/fetchList";
import { useRouter } from "next/router";
import { FilterType } from "@/types/filter";

interface ListProps {
  data?: Product[];
}

const List: FC<ListProps> = ({}) => {
  const pictures = [
    "https://eu.muroexe.com/68153-home_default/materia-mod-camel.jpg",
    "https://eu.muroexe.com/67986-home_default/custom.jpg",
    "https://eu.muroexe.com/67985-home_default/custom.jpg",
  ];

  const [data, setData] = useState<[Product]>();
  const [filter, setFilter] = useState<FilterType>({
    size: new Map(),
    color: new Map(),
    price: {
      min: 0,
      max: Number.MAX_VALUE,
      lowerPrice: 0,
      higherPrice: 100,
    },
  });
  useEffect(() => {
    if (!data) {
      console.log("if");
      return;
    }
    let lowerPrice = Number.MAX_VALUE;
    let higherPrice = Number.MIN_VALUE;
    data.forEach((product) => {
      lowerPrice = lowerPrice < product.price ? lowerPrice : product.price;
      higherPrice = higherPrice > product.price ? higherPrice : product.price;
    });
    setFilter({
      ...filter,
      price: {
        lowerPrice,
        higherPrice,
        min: lowerPrice > filter.price.min ? lowerPrice : filter.price.min,
        max: higherPrice < filter.price.max ? higherPrice : filter.price.max,
      },
    });
  }, [data]);
  const [error, setError] = useState<ApolloError>();
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("Best sellers");
  const [productsByPopularity] = useLazyQuery(FETCH_PRODUCTS_BY_POPULARITY, {
    onCompleted: (fetchedData: { productsByPopularity: [Product] }) => {
      //@ts-ignore
      setData(fetchedData.productsByPopularity);
      setLoading(false);
    },
  });
  const [productsByPrice] = useLazyQuery(FETCH_PRODUCTS_BY_PRICE, {
    onCompleted: (fetchedData: { productsByPrice: [Product] }) => {
      //@ts-ignore
      setData(fetchedData.productsByPrice);
      setLoading(false);
    },
    onError: (error) => setError(error),
  });

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    switch (sort) {
      case "Best sellers":
        productsByPopularity({ variables: { type: router.pathname.slice(1) } });
        break;
      case "Price low to high":
        productsByPrice({
          variables: { type: router.pathname.slice(1), sort: 1 },
        });
        break;
      case "Price high to low":
        productsByPrice({
          variables: { type: router.pathname.slice(1), sort: -1 },
        });
        break;
      default:
        productsByPopularity({ variables: { type: router.pathname.slice(1) } });
    }
  }, [sort]);

  if (!loading && error) {
    return <>{error.message}</>;
  }

  const cards = data?.map((card, i) => {
    const sizes = {};
    card.color.forEach((color, i) => {
      for (let size in color.sizesAvailable) {
        if (i === 1 || color.sizesAvailable[size])
          sizes[size] = !!color.sizesAvailable[size];
      }
    });
    return (
      <Card
        name={card.title}
        price={card.price}
        url={card.url}
        pictures={pictures}
        allSizes={card.allSizes}
        sizesAvailable={sizes}
        key={i}
      />
    );
  });
  return (
    <Container>
      <div>
        <Filter
          quantity={data?.length || 0}
          setSort={setSort}
          filter={filter}
          setFilter={setFilter}
        />
        <div className={cl.list}>{cards}</div>
      </div>
    </Container>
  );
};

export default List;
