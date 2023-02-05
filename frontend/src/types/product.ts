import { Sizes } from "./sizes";
export type Product = {
  pictures: string[];
  title: string;
  price: number;
  allSizes: Number[];
  color: Color[];
  url: string;
  buyCount: number;
  description: string;
};

export type Color = {
  name: string;
  sizesAvailable: Sizes;
};

export type Details = {
  title: string;
  description: string;
  price: string | number;
  type: string;
  color: Color[];
  allSizes: number[];
};
