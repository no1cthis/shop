import { CartProductType } from "@/types/cartProductType";
import axios from "axios";
import { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import CartProduct from "../CartProduct/CartProduct";
import ModalWindow from "../ModalWindow/ModalWindow";
import cl from "./shopBasket.module.scss";

interface ShopBasketProps {
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  cart: CartProductType[];
  setCart: Dispatch<SetStateAction<CartProductType[]>>;
}

const ShopBasket: FC<ShopBasketProps> = ({
  showMenu,
  setShowMenu,
  cart,
  setCart,
}) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [modalText, setModalText] = useState("");
  const products = cart.map((product, i) => (
    <CartProduct
      product={product}
      setCart={setCart}
      number={i}
      key={product.url}
    />
  ));
  const totalPrice = useMemo(() => {
    return cart.reduce(
      (prev, current) => prev + current.price * current.quantity,
      0
    );
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/create-checkout-session`,
        cart
      )
      .then((res) => {
        console.log(res);
        if (res.data.url) window.location.href = res.data.url;
        else if (res.data.err) {
          setModalText(res.data.err);
          setIsModalActive(true);
        } else throw new Error("Something went wrong.. Try again later");
      })
      .catch((err) => alert(`${err.message}`));
  };
  return (
    <>
      <div className={cl.wrapper} style={{ right: showMenu ? 0 : undefined }}>
        <div className={cl.close} onClick={() => setShowMenu(false)} />
        <div className={cl.title}>Shopping cart</div>
        <div className={cl.products}>{products}</div>
        <div className={cl.total}>
          <div className={cl.summary}>
            <span>{cart.length} items</span> <span>${totalPrice}</span>
          </div>
          <button
            className={`${cl.payButton} ${
              cart.length > 0 ? cl.payButton__active : undefined
            }`}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
      {isModalActive && (
        <ModalWindow setModal={setIsModalActive}>{modalText}</ModalWindow>
      )}
    </>
  );
};

export default ShopBasket;
