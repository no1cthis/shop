import { FilterType } from "@/types/filter";
import { FC } from "react";
import cl from "./sizePick.module.scss";

interface SizePickProps {
  active: boolean;
  size: number;
  setFilter?: (value: string | number, FilterType?: string) => void;
  fontSize?: number;
}

const SizePick: FC<SizePickProps> = ({ active, setFilter, size, fontSize }) => {
  return (
    <span
      className={`${cl.size} ${cl.unselectable} ${
        active ? cl.size__active : undefined
      } ${!setFilter ? cl.crossedOut : undefined}`}
      style={{ fontSize }}
      onClick={() => {
        if (setFilter) setFilter(size, "size");
      }}
    >
      {size}
    </span>
  );
};

export default SizePick;
