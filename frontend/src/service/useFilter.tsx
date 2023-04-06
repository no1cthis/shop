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
  const routerHistory = useRef("");
  const initRender = useRef(true);
  const filterHistory = useRef({
    sizes: new Map<number, number>(),
    colors: new Map<string, string>(),
    lowerPrice: -1,
    higherPrice: -1,
  });
  const fetchBlock = useRef<boolean>(false);
  const type = usingRouter ? router.asPath.slice(1) : undefined;

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

  const fetch = async ({
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
    switch (sort) {
      case "Best sellers":
        await fetchFunc({
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
        await fetchFunc({
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
        await fetchFunc({
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
        await fetchFunc({
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
        await fetchFunc({
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

  const fetchWithFilters = async () => {
    const colors = checkFilter(filterHistory.current.colors, filter.color);
    const sizes = checkFilter(filterHistory.current.sizes, filter.size);
    const fetchFunc =
      colors && sizes ? fetchWithoutChangeLimits : fetchWithChangeLimits;

    filterHistory.current.colors = filter.color;
    filterHistory.current.sizes = filter.size;
    filterHistory.current.lowerPrice = filter.price.lowerPrice;
    filterHistory.current.higherPrice = filter.price.higherPrice;

    setLoading(true);

    await fetch({
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
    fetchBlock.current = true;

    setLoading(true);
    if (routerHistory.current !== router.asPath) {
      setFilter({
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
      fetch({ fetchFunc: fetchWithChangeLimits, colors: [], sizes: [] });
      routerHistory.current = router.asPath;
      return;
    }

    routerHistory.current = router.asPath;

    fetch({ fetchFunc: fetchWithChangeLimits });
  }, [router.asPath, sort]);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(fetchWithFilters, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter.color, filter.size]);

  return {
    data,
    setSort,
    filter,
    setFilter,
    loading,
    error,
    sort,
    minPrice: filter.price.min,
    maxPrice: filter.price.max,
  };
};
