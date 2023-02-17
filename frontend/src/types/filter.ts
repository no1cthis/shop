export type FilterType = {
  title?: string;
  size: Map<number, number>;
  color: Map<string, string>;
  price: {
    min: number;
    max: number;
    lowerPrice: number;
    higherPrice: number;
  };
};
