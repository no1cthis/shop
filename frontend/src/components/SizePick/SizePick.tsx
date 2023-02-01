import { FilterType } from "@/types/filter";
import { FC } from "react";
import cl from "./sizePick.module.scss";

interface SizePickProps {
  active: boolean;
  size: number;
  setFilter?: (FilterType: string, value: string | number) => void;
}

const SizePick: FC<SizePickProps> = ({ active, setFilter, size }) => {
  return (
    <span
      className={`${cl.size} ${cl.unselectable} ${
        active ? cl.size__active : undefined
      } `}
      onClick={() => {
        if (setFilter) setFilter("size", size);
      }}
    >
      {size}
    </span>
  );
};

export default SizePick;
