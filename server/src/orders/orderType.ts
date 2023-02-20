export type Order = {
  id: String;
  products: ProductInOrder[];
  customer: Customer;
  reciever: Reciever;
  created: Number;
  status: "Sent" | "Not sent" | "Delivered";
};

type ProductInOrder = {
  title: string;
  color: string;
  size: number;
  price: number;
  quantity: number;
  photo: string;
};

type Customer = {
  name: String;
  email: String;
  phone: String;
};

type Reciever = {
  address: Address;
  name: String;
};

type Address = {
  city: String;
  country: String;
  line1: String;
  line2: String;
  postal_code: String;
  state: String;
};
