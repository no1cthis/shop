export type OrderType = {
  id: string;
  products: ProductInOrder[];
  customer: Customer;
  reciever: Reciever;
  created: number;
  status: "Sent" | "Not sent" | "Delivered";
};

type ProductInOrder = {
  title: string;
  color: string;
  size: number;
  photo: string;
  quantity: number;
  price: number;
};

type Customer = {
  name: string;
  email: string;
  phone: string;
};

type Reciever = {
  address: Address;
  name: string;
};

type Address = {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
};
