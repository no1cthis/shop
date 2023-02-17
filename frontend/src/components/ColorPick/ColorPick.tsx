import { DELETE_COLOR } from "@/graphQL/mutationList";
import { ColorChoose } from "@/types/colorChoose";
import { useMutation } from "@apollo/client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import cl from "./colorPick.module.scss";

interface ColorPickProps {
  active: boolean;
  name: string;
  colorCode: string;
  setFilter?: (value: string | number, FilterType?: string) => void;
  setColorList?: Dispatch<SetStateAction<ColorChoose[] | undefined>>;
  setStock?: (name: string) => void;
  size?: number;
}

const ColorPick: FC<ColorPickProps> = ({
  active,
  setFilter,
  name,
  colorCode,
  setColorList,
  setStock,
  size,
}) => {
  const [hover, setHover] = useState(false);
  const [deleteColorMutation] = useMutation(DELETE_COLOR, {
    onCompleted: (data) => {
      if (!data.deleteColor) {
        window.alert(`Error: color has not been deleted`);
        return;
      }
      // @ts-expect-error
      setColorList((prev) => {
        if (!prev) return;
        const index = prev?.findIndex(
          (elem) => elem.name === name && elem.code === colorCode
        );
        return [...prev?.slice(0, index), ...prev.slice(index + 1)];
      });
    },
    onError: (err) => window.alert(`Error: ${err}`),
  });
  const deleteColor = async () => {
    if (window.confirm(`Do you really want to delete ${name} color?`)) {
      deleteColorMutation({ variables: { name } });
    }
  };

  return (
    <div className={cl.color__wrapper} key={colorCode}>
      <span
        className={`${cl.color} ${active ? cl.color__active : undefined}`}
        style={{
          backgroundColor: colorCode,
          width: size ? size : undefined,
          height: size ? size : undefined,
        }}
        onClick={() => {
          if (setFilter) setFilter(name, "color");
          if (setStock) setStock(name);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      ></span>
      {setColorList ? (
        <span
          className={`${cl.delete} ${hover && cl.delete__active}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={deleteColor}
        />
      ) : null}
      <span className={cl.color__name}>{name}</span>
    </div>
  );
};

export default ColorPick;
