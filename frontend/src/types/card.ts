import { Sizes } from "./sizes";
export type CardType = {
  title: string;
  price: number;
  allSizes: number[];
  color: ColorCard[];
  url: string;
};

export type ColorCard = {
  name: string;
  photo: string;
  sizesAvailable: Sizes;
};
