import List from "@/components/List/List";
import { FC, useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { useRouter } from "next/router";
import { CartProductType } from "@/types/cartProductType";

const Sneakers: FC = () => {
  const router = useRouter();
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

  let name;
  if (router.asPath !== "/[productType]")
    name = router.asPath.slice(1, 2).toUpperCase() + router.asPath.slice(2);
  return (
    <Layout title={name} cart={cart} setCart={setCart}>
      {<List setCart={setCart} />}
    </Layout>
  );
};

export default Sneakers;
