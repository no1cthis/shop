import { FETCH_PRODUCTS_WITH_FILTERS } from "@/graphQL/fetchList";
import { Product } from "@/types/product";
import {
  ApolloError,
  DocumentNode,
  LazyQueryHookOptions,
  OperationVariables,
  useLazyQuery,
} from "@apollo/client";
import { Dispatch, SetStateAction } from "react";

export const useFetchWithFilters = ({
  calculateLimits,
  setLoading,
  setError,
  setData,
  changePriceLimits,
  apolloQuery,
  dbName,
}: {
  calculateLimits?: boolean;
  setLoading: (value: React.SetStateAction<boolean>) => void;
  setData: React.Dispatch<React.SetStateAction<[Product] | undefined>>;
  setError: (value: React.SetStateAction<ApolloError | undefined>) => void;
  changePriceLimits?: ({
    data,
    calculateLimits,
  }: {
    data: Product[];
    calculateLimits?: boolean | undefined;
  }) => void;
  apolloQuery: DocumentNode;
  dbName: string;
}) => {
  const [fetchProductsWithFilter] = useLazyQuery(apolloQuery, {
    // @ts-expect-error
    onCompleted: (fetchedData: { [dbName]: [Product] }) => {
      // @ts-expect-error
      setData(fetchedData[dbName]);
      if (calculateLimits && changePriceLimits)
        changePriceLimits({
          // @ts-expect-error
          data: fetchedData[dbName],
          calculateLimits,
        });
      setLoading(false);
    },
    onError: (error) => {
      console.log(error);
      setError(error);
    },
  });

  return fetchProductsWithFilter;
};
