import { CartProductType } from "@/types/cartProductType";
import cl from "./cartProduct.module.scss";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import ResizeDiv from "../ResizeDiv/ResizeDiv";
import Link from "next/link";
import { MdDelete } from "react-icons/md";
interface CartProductProps {
  product: CartProductType;
  setCart: Dispatch<SetStateAction<CartProductType[]>>;
  number: number;
}

const CartProduct: FC<CartProductProps> = ({ product, number, setCart }) => {
  const {
    title,
    price,
    size,
    color,
    photo,
    quantity: initQuantity,
    url,
  } = product;

  const quantityRef = useRef<HTMLInputElement>(null);

  const [quantity, setQuantity] = useState(initQuantity);

  const changeQuantity = (value: number) => {
    if (!quantityRef.current) return;
    if (!value) quantityRef.current.style.width = "12px";
    else
      quantityRef.current.style.width = quantityRef.current.style.width =
        value.toString().length * 12 + "px";
    setQuantity(value);
  };

  useEffect(() => {
    changeQuantity(quantity);
  }, [product.quantity, quantity]);
  useEffect(() => {
    changeQuantity(product.quantity);
  }, [product.quantity]);

  const deleteFromCart = () => {
    setCart((prev) => {
      const newState = [...prev.slice(0, number), ...prev.slice(number + 1)];
      localStorage.setItem("cart", JSON.stringify(newState));
      return newState;
    });
  };

  const onBlur = () => {
    let qty = !quantity ? 1 : quantity;
    changeQuantity(qty);

    setCart((prev) => {
      const cart: CartProductType[] = [...prev];
      cart[number].quantity = qty;
      localStorage.setItem("cart", JSON.stringify(cart));
      return cart;
    });
  };

  return (
    <div className={cl.wrapper}>
      <ResizeDiv width={150} key={url}>
        <Link href={url}>
          <Image src={photo} alt={`${title} ${color}`} fill={true} />
        </Link>
      </ResizeDiv>
      <div className={cl.details}>
        <div className={cl.details__title}>{title}</div>
        <div className={cl.details__size}>Size: {size}</div>
        <div className={cl.details__input}>
          <input
            ref={quantityRef}
            className={cl.details__quantity}
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => changeQuantity(parseInt(e.target.value))}
            onBlur={onBlur}
          />{" "}
          x <span>${price.toFixed(2)}</span>
          <MdDelete className={cl.details__delete} onClick={deleteFromCart} />
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
