import { FETCH_PRODUCTS_WITH_FILTERS } from "@/graphQL/fetchList";
import { Product } from "@/types/product";
import { ApolloError, useLazyQuery } from "@apollo/client";

export const useFetchWithFilters = ({
  calculateLimits,
  setLoading,
  setError,
  setData,
  changePriceLimits,
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
}) => {
  const [fetchProductsWithFilter] = useLazyQuery(FETCH_PRODUCTS_WITH_FILTERS, {
    onCompleted: (fetchedData: { productsWithFilter: [Product] }) => {
      //@ts-ignore
      setData(fetchedData.productsWithFilter);
      if (calculateLimits && changePriceLimits)
        changePriceLimits({
          data: fetchedData.productsWithFilter,
          calculateLimits,
        });
      console.log(fetchedData);
      setLoading(false);
    },
    onError: (error) => setError(error),
  });

  return fetchProductsWithFilter;
};
