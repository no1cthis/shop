import { FilterType } from "@/types/filter";
import { FC } from "react";
import cl from "./colorPick.module.scss";

interface ColorPickProps {
  active: boolean;
  name: string;
  colorCode: string;
  setFilter?: (FilterType: string, value: string | number) => void;
}

const ColorPick: FC<ColorPickProps> = ({
  active,
  setFilter,
  name,
  colorCode,
}) => {
  return (
    <div className={cl.color__wrapper} key={colorCode}>
      <span
        className={`${cl.color} ${active ? cl.color__active : undefined}`}
        style={{ backgroundColor: colorCode }}
        onClick={() => {
          if (setFilter) setFilter("color", name);
        }}
      />
      <span className={cl.color__name}>{name}</span>
    </div>
  );
};

export default ColorPick;
