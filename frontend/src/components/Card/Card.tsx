import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { BsFillBagPlusFill } from "react-icons/bs";

import cl from "./Card.module.scss";
import Link from "next/link";
import { ColorCard } from "@/types/card";
import { CartProductType } from "@/types/cartProductType";
import Image from "next/image";
import ResizeDiv from "../ResizeDiv/ResizeDiv";

interface CardProps {
  title: string;
  price: number;
  url: string;
  colors: ColorCard[];
  allSizes: number[];
  setCart?: Dispatch<SetStateAction<CartProductType[]>>;
}

const Card: FC<CardProps> = ({
  title,
  price,
  url,
  colors,
  allSizes,
  setCart,
}) => {
  const [colorsArray, setColors] = useState(colors);
  const [activeSize, setActiveSize] = useState<number>(0);
  const chooseInitSize = useCallback(() => {
    // @ts-expect-error
    if (colorsArray[0].sizesAvailable[`_${activeSize}`]) return;
    for (
      let i = Math.floor((allSizes.length - 1) / 2), count = 1;
      i !== allSizes.length - 1;

    ) {
      const size = allSizes[i];
      // @ts-expect-error
      if (colorsArray[0].sizesAvailable[`_${size}`] !== 0) {
        setActiveSize(size);
        return;
      } else if (i % 2) {
        i = Math.floor((allSizes.length - 1) / 2) + Math.floor(count);
        count += 0.5;
      } else {
        i = Math.floor((allSizes.length - 1) / 2) - Math.floor(count);
        count += 0.5;
      }
    }
  }, [colorsArray]);

  useEffect(chooseInitSize, [colorsArray]);

  const changePicture = useCallback(
    (index: number) => {
      const tempArray = [...colorsArray];

      [tempArray[0], tempArray[index]] = [tempArray[index], tempArray[0]];
      setColors(tempArray);
    },
    [colorsArray]
  );

  const addToCart = useCallback(() => {
    // @ts-expect-error
    setCart((prev) => {
      const cart = [...prev];
      for (let i = 0; i < prev.length; i++) {
        if (
          cart[i].title === title &&
          cart[i].url === `${url}/${colorsArray[0].name}` &&
          cart[i].size === activeSize
        ) {
          cart[i].quantity++;
          localStorage.setItem("cart", JSON.stringify(cart));
          return cart;
        }
      }
      cart.push({
        title,
        price,
        url: `${url}/${colorsArray[0].name}`,
        color: colorsArray[0].name,
        photo: colorsArray[0].photo,
        size: activeSize,
        quantity: 1,
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      return cart;
    });
  }, [activeSize]);
  return (
    <>
      <div className={cl.card}>
        <ResizeDiv className={cl.mainPicture}>
          <Link href={`${url}/${colorsArray[0].name}`}>
            <Image
              fill={true}
              src={colorsArray[0].photo}
              alt={title + " - picture 1"}
            />
          </Link>
        </ResizeDiv>
        <div className={cl.miniPictures}>
          {colorsArray.map(({ photo }, i) => {
            if (i !== 0) {
              const key = `${title} - picture ${i + 1}`;
              return (
                <ResizeDiv className={cl.miniPicture} width={"30%"} key={key}>
                  <Image
                    src={photo}
                    fill={true}
                    alt={key}
                    onClick={() => changePicture(i)}
                  />
                </ResizeDiv>
              );
            }
          })}
        </div>
        <div className={cl.sizes}>
          {allSizes.map((size) => {
            //@ts-expect-error
            const available = colorsArray[0].sizesAvailable[`_${size}`]
              ? cl.size__available
              : cl.size__unavailable;
            const active = size === activeSize ? cl.size__active : undefined;
            return (
              <span
                key={size.toString()}
                className={`${cl.size} ${available} ${active}`}
                onClick={() => {
                  // @ts-expect-error
                  if (colorsArray[0].sizesAvailable[`_${size}`])
                    setActiveSize(size);
                }}
              >
                {size.toString()}
              </span>
            );
          })}
        </div>
        <div className={cl.details}>
          <div className={cl.details_col1}>
            <Link href={`${url}/${colorsArray[0].name}`} className={cl.title}>
              {title}
            </Link>

            <div className={cl.price}>${price.toString()}</div>
          </div>
          <div className={cl.details_col2}>
            <BsFillBagPlusFill className={cl.shop} onClick={addToCart} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
