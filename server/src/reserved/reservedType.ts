export type Reserved = {
  id: string;
  created: number;
  products: {
    title: string;
    color: string;
    size: number;
    price: number;
    quantity: number;
    photo: string;
  }[];
};
