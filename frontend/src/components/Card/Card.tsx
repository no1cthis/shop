import React, { FC, useEffect, useState } from "react";
import { Sizes } from "@/types/sizes";

import { BsFillBagPlusFill } from "react-icons/bs";

import cl from "./Card.module.scss";
import Link from "next/link";

interface CardProps {
  name: string;
  price: Number;
  url: string;
  pictures: string[];
  sizesAvailable: Sizes;
  allSizes: Number[];
}

const Card: FC<CardProps> = ({
  name,
  price,
  url,
  pictures,
  sizesAvailable,
  allSizes,
}) => {
  const [picturesArray, setPictures] = useState(pictures);

  const changePicture = (e: React.MouseEvent<HTMLImageElement>) => {
    const tempArray: string[] = picturesArray;
    // @ts-ignore
    let index = picturesArray.indexOf(e.target.src);
    tempArray[index] = tempArray[0];
    // @ts-ignore
    tempArray[0] = e.target.src;
    setPictures([...tempArray]);
  };
  return (
    <>
      <div className={cl.card}>
        <Link href={url}>
          <img
            className={cl.mainPicture}
            src={picturesArray[0]}
            alt={name + " - picture 1"}
          />
        </Link>
        <div className={cl.miniPictures}>
          {picturesArray.map((picture, i) => {
            if (i !== 0) {
              const key = `${name} - picture ${i + 1}`;
              return (
                <img
                  src={picture}
                  alt={key}
                  key={key}
                  onClick={changePicture}
                />
              );
            }
          })}
        </div>
        <div className={cl.sizes}>
          {allSizes.map((size) => {
            const active = sizesAvailable[`_${size}`]
              ? cl.size__active
              : cl.size__unactive;
            return (
              <span key={size} className={`${cl.size} ${active}`}>
                {size}
              </span>
            );
          })}
        </div>
        <div className={cl.details}>
          <div className={cl.details_col1}>
            <div className={cl.name}>{name}</div>
            <div className={cl.price}>${price.toString()}</div>
          </div>
          <div className={cl.details_col2}>
            <BsFillBagPlusFill className={cl.shop} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
