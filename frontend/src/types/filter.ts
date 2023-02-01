export type FilterType = {
  size: Map<number, boolean>;
  color: Map<string, boolean>;
  price: {
    min: number;
    max: number;
    lowerPrice: number;
    higherPrice: number;
  };
};
