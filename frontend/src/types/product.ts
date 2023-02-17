import { Sizes } from "./sizes";
export type Product = {
  title: string;
  price: number;
  allSizes: number[];
  color: Color[];
  url: string;
  buyCount: number;
  description: string;
  type: string;
};

export type Color = {
  name: string;
  photos: string[];
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
