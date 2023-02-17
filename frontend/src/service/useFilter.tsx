import { FETCH_PRODUCTS_BY_TITLE } from "@/graphQL/fetchList";
import { FilterType } from "@/types/filter";
import { Product } from "@/types/product";
import {
  ApolloError,
  DocumentNode,
  LazyQueryHookOptions,
  OperationVariables,
  useLazyQuery,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { useFetchWithFilters } from "./useFetchWithFilters";

export const useFilter = ({
  usingRouter,
  apolloQuery,
  fetchPolicy,
  dbName,
}: {
  usingRouter: boolean;
  apolloQuery: DocumentNode;
  fetchPolicy?: WatchQueryFetchPolicy;
  dbName: string;
}) => {
  const router = useRouter();
  const initRender = useRef(true);
  const filterHistory = useRef({
    sizes: new Map<number, number>(),
    colors: new Map<string, string>(),
  });
  const fetchBlock = useRef<boolean>(false);

  const [data, setData] = useState<any>();
  const [filter, setFilter] = useState<FilterType>({
    title: "",
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
    apolloQuery,
    dbName,
  });
  const fetchWithoutChangeLimits = useFetchWithFilters({
    calculateLimits: false,
    changePriceLimits,
    setData,
    setError,
    setLoading,
    apolloQuery,
    dbName,
  });

  const [fetchByTitle] = useLazyQuery(FETCH_PRODUCTS_BY_TITLE, {
    onCompleted: (data: { productsByTitle: [Product] }) => {
      setData(data.productsByTitle);
      setLoading(false);
    },
    fetchPolicy: "no-cache",
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
                // @ts-expect-error
                [dbName]: [Product];
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
    console.log(filter);
    const type = usingRouter ? router.asPath.slice(1) : undefined;
    switch (sort) {
      case "Best sellers":
        fetchFunc({
          variables: {
            minPrice,
            maxPrice,
            sortBy: "buyCount",
            sort: -1,
            type,
            colors,
            sizes,
          },
          fetchPolicy,
        });
        break;
      case "Price low to high":
        fetchFunc({
          variables: {
            minPrice,
            maxPrice,
            sortBy: "price",
            type,
            colors,
            sizes,
          },
          fetchPolicy,
        });

        break;
      case "Price high to low":
        fetchFunc({
          variables: {
            minPrice,
            maxPrice,
            sortBy: "price",
            sort: -1,
            type,
            colors,
            sizes,
          },
          fetchPolicy,
        });
        break;
      case "Type":
        fetchFunc({
          variables: {
            minPrice,
            maxPrice,
            sortBy: "type",
            type,
            colors,
            sizes,
          },
          fetchPolicy,
        });
        break;
      case "Title":
        fetchFunc({
          variables: {
            minPrice,
            maxPrice,
            sortBy: "title",
            type,
            colors,
            sizes,
          },
          fetchPolicy,
        });
        break;
      default:
        fetchFunc({
          variables: {
            minPrice,
            maxPrice,
            sortBy: "buyCount",
            type,
            colors,
            sizes,
          },
          fetchPolicy: "no-cache",
        });
    }
  };

  useEffect(() => {
    if (initRender.current) {
      initRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      if (!filter.title) fetch({ fetchFunc: fetchWithChangeLimits });
      else fetchByTitle({ variables: { title: filter.title } });
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [filter.title]);

  useEffect(() => {
    if (/\/\[/.test(router.asPath) || loading || filter.title) return;
    setLoading(true);

    fetch({ fetchFunc: fetchWithChangeLimits });
  }, [router.asPath, sort]);

  useEffect(() => {
    if (loading) return;
    if (fetchBlock.current || filter.title) {
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
          filter.price.max === filter.price.higherPrice ||
          colors?.length ||
          sizes?.length
            ? undefined
            : filter.price.max,
        minPrice:
          filter.price.min === filter.price.lowerPrice ||
          colors?.length ||
          sizes?.length
            ? undefined
            : filter.price.min,
        colors,
        sizes,
      });
      console.log(
        "fetch",
        filter.price.max === filter.price.higherPrice || colors || sizes
      );
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter.price.min, filter.price.max, filter.color, filter.size]);

  return { data, setSort, filter, setFilter, loading, error };
};
