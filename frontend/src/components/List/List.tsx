import React, { FC, useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import { Product } from "../../types/product";

import cl from "./List.module.scss";
import Container from "../Container/Container";
import Filter from "../Filter/Filter";
import {
  ApolloError,
  LazyQueryHookOptions,
  OperationVariables,
  useLazyQuery,
} from "@apollo/client";
import { FETCH_PRODUCTS_WITH_FILTERS } from "@/graphQL/fetchList";
import { useRouter } from "next/router";
import { FilterType } from "@/types/filter";
import { useFetchWithFilters } from "@/service/useFetchWithFilters";

interface ListProps {
  data?: Product[];
}

const List: FC<ListProps> = ({}) => {
  const router = useRouter();
  const filterHistory = useRef({
    sizes: new Map<number, number>(),
    colors: new Map<string, string>(),
  });
  const fetchBlock = useRef<boolean>(false);
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
    setFilter({
      ...filter,
      price: {
        ...filter.price,
        min: filter.price.lowerPrice,
        max: filter.price.higherPrice,
      },
    });
    fetchBlock.current = true;
  }, [filter.price.lowerPrice, filter.price.higherPrice]);
  const [error, setError] = useState<ApolloError>();
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("Best sellers");

  const changePriceLimits = ({
    data,
    calculateLimits,
  }: {
    data: Product[];
    calculateLimits?: boolean;
  }) => {
    let lowerPrice: number, higherPrice: number;

    if (!data.length) {
      setFilter({
        ...filter,
        price: {
          lowerPrice: 0,
          higherPrice: 0,
          min: 0,
          max: 0,
        },
      });
      return;
    }
    if (!calculateLimits) {
      lowerPrice = filter.price.lowerPrice;
      higherPrice = filter.price.higherPrice;
    } else {
      lowerPrice = Number.MAX_VALUE;
      higherPrice = Number.MIN_VALUE;
      data.forEach((product) => {
        lowerPrice = lowerPrice < product.price ? lowerPrice : product.price;
        higherPrice = higherPrice > product.price ? higherPrice : product.price;
      });
    }
    setFilter({
      ...filter,
      price: {
        lowerPrice,
        higherPrice,
        min: calculateLimits
          ? lowerPrice
          : lowerPrice > filter.price.min
          ? lowerPrice
          : filter.price.min,
        max: calculateLimits
          ? higherPrice
          : higherPrice < filter.price.max
          ? higherPrice
          : filter.price.max,
      },
    });
  };

  const fetchWithChangeLimits = useFetchWithFilters({
    calculateLimits: true,
    changePriceLimits,
    setData,
    setError,
    setLoading,
  });
  const fetchWithoutChangeLimits = useFetchWithFilters({
    calculateLimits: false,
    changePriceLimits,
    setData,
    setError,
    setLoading,
  });

  const checkFilter = (map1: Map<any, any>, map2: Map<any, any>) => {
    if (map1.size !== map2.size) return undefined;
    const array: any[] = [];
    map1.forEach((elem) => {
      const value = map2.get(elem);
      if (value) array.push(value);
      else return undefined;
    });

    return array;
  };

  const fetch = ({
    fetchFunc,
    maxPrice,
    minPrice,
    colors = Array.from(filter.color.keys()),
    sizes = Array.from(filter.size.keys()),
  }: {
    fetchFunc: (
      options?:
        | Partial<
            LazyQueryHookOptions<
              {
                productsWithFilter: [Product];
              },
              OperationVariables
            >
          >
        | undefined
    ) => any;
    minPrice?: number;
    maxPrice?: number;
    colors?: string[];
    sizes?: number[];
  }) => {
    switch (sort) {
      case "Best sellers":
        fetchFunc({
          variables: {
            minPrice,
            maxPrice,
            sortBy: "buyCount",
            type: router.asPath.slice(1),
            colors,
            sizes,
          },
        });
        break;
      case "Price low to high":
        fetchFunc({
          variables: {
            minPrice,
            maxPrice,
            sortBy: "price",
            type: router.asPath.slice(1),
            colors,
            sizes,
          },
        });

        break;
      case "Price high to low":
        fetchFunc({
          variables: {
            minPrice,
            maxPrice,
            sortBy: "price",
            sort: -1,
            type: router.asPath.slice(1),
            colors,
            sizes,
          },
        });
        break;
      default:
        fetchFunc({
          variables: {
            minPrice,
            maxPrice,
            sortBy: "buyCount",
            type: router.asPath.slice(1),
            colors,
            sizes,
          },
        });
    }
  };

  useEffect(() => {
    if (/\/\[/.test(router.asPath) || loading) return;
    setLoading(true);
    fetch({ fetchFunc: fetchWithChangeLimits });
  }, [router.asPath, sort]);

  useEffect(() => {
    if (loading) return;
    if (fetchBlock.current) {
      fetchBlock.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const colors = checkFilter(filterHistory.current.colors, filter.color);
      const sizes = checkFilter(filterHistory.current.sizes, filter.size);
      const fetchFunc =
        colors && sizes ? fetchWithoutChangeLimits : fetchWithChangeLimits;

      filterHistory.current.colors = filter.color;
      filterHistory.current.sizes = filter.size;

      setLoading(true);

      fetch({
        fetchFunc,
        maxPrice:
          filter.price.max === filter.price.higherPrice || colors || sizes
            ? undefined
            : filter.price.max,
        minPrice:
          filter.price.min === filter.price.lowerPrice || colors || sizes
            ? undefined
            : filter.price.min,
        colors,
        sizes,
      });
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter.price.min, filter.price.max, filter.color, filter.size]);

  if (!loading && error) {
    return <>{error.message}</>;
  }

  const cards = data?.map((card, i) => {
    const sizes = {};
    card.color.forEach((color, i) => {
      for (let size in color.sizesAvailable) {
        //@ts-expect-error
        if (i === 1 || color.sizesAvailable[size])
          //@ts-expect-error
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
