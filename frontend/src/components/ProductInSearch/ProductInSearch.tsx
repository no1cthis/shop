import { FETCH_COLORS } from "@/graphQL/fetchList";
import { ColorChoose } from "@/types/colorChoose";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import ColorPick from "../ColorPick/ColorPick";
import cl from "./productInSearch.module.scss";

const ProductInSearch: FC<{
  title: string;
  photo: string;
  url: string;
  type: string;
  colors: string[];
  closeSearch: () => void;
}> = ({ title, photo, url, colors, type, closeSearch }) => {
  const i = useRef(0);
  const [colorList, setColorList] = useState<ColorChoose[]>([]);
  const [fetchColor] = useLazyQuery(FETCH_COLORS, {
    onCompleted: (data: { colors: ColorChoose[] }) => {
      setColorList((prev) => [...prev, ...data.colors]);
      i.current++;
      if (i.current < colors.length)
        fetchColor({ variables: { name: colors[i.current] } });
    },
  });

  useEffect(() => {
    fetchColor({ variables: { name: colors[i.current] } });
  }, []);

  const colorsElem = colorList.map((el) => (
    <Link
      key={el.name}
      href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${url}/${el.name}`}
      onClick={closeSearch}
    >
      <ColorPick name={""} active={false} colorCode={el.code} size={25} />
    </Link>
  ));
  return (
    <div className={cl.wrapper}>
      <Link
        href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${url}/${colors[0]}`}
        onClick={closeSearch}
      >
        <Image width={100} height={100} src={photo} alt={`${title} photo`} />
      </Link>
      <div className={cl.details}>
        <Link
          href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${url}/${colors[0]}`}
          onClick={closeSearch}
        >
          {title.toUpperCase()}
        </Link>
        <div>{type.slice(0, 1).toUpperCase() + type.slice(1)}</div>
        <div className={cl.colors} style={{ maxWidth: 40 * colorsElem.length }}>
          {colorsElem}
        </div>
      </div>
    </div>
  );
};

export default ProductInSearch;
