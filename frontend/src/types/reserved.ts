export type Reserved = {
  id: string;
  created: number;
  products: {
    title: string;
    color: string;
    size: number;
    quantity: number;
  }[];
};
