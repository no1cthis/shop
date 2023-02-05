export type Product = {
  __typename?: string;
  title: string;
  description: string;
  type: string;
  price: Number;
  allSizes: [Number];
  color: [Color];
};

export type Color = {
  name: string;
  sizesAvailable: Sizes;
};

export type Sizes = {
  _36: Number;
  _37: Number;
  _38: Number;
  _39: Number;
  _40: Number;
  _41: Number;
  _42: Number;
  _43: Number;
  _44: Number;
  _45: Number;
  _46: Number;
  _47: Number;
};
