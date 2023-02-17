import { FC, useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import ProductPage from "@/components/ProductPage/ProductPage";
import { CartProductType } from "@/types/cartProductType";

const Sneakers: FC = () => {
  const [cart, setCart] = useState<CartProductType[]>([]);

  useEffect(() => {
    setCart(() => {
      let cart: CartProductType[] | null = JSON.parse(
        // @ts-expect-error
        localStorage.getItem("cart")
      );
      if (!cart) {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      return cart;
    });
  }, []);
  return (
    <Layout cart={cart} setCart={setCart}>
      <ProductPage cart={cart} setCart={setCart} />
    </Layout>
  );
};

export default Sneakers;
