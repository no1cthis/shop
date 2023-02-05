import { Color } from "@/types/product";
import { Sizes } from "@/types/sizes";
import {
  ChangeEvent,
  FC,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { AiOutlineDown } from "react-icons/ai";
import cl from "./sizeAvailable.module.scss";

interface SizeAvailableProps {
  color: string;
  stock: Map<string, Sizes>;
  setStock: Dispatch<SetStateAction<Map<string, Sizes>>>;
}

const SizeAvailable: FC<SizeAvailableProps> = ({ color, stock, setStock }) => {
  const [active, setActive] = useState(false);
  const [sizes, setSizes] = useState<Sizes>({
    _36: 0,
    _37: 0,
    _38: 0,
    _39: 0,
    _40: 0,
    _41: 0,
    _42: 0,
    _43: 0,
    _44: 0,
    _45: 0,
    _46: 0,
    _47: 0,
  });
  const onChangeInput = (e: ChangeEvent<HTMLInputElement>, size: string) => {
    setSizes({
      ...sizes,
      [size]: Number(e.target.value) || 0,
    });
  };

  useEffect(() => {
    const timer = setTimeout(
      () => setStock(new Map(stock).set(color, sizes)),
      500
    );
    return () => {
      clearTimeout(timer);
    };
  }, [sizes]);

  const inputs = Object.keys(sizes).map((size) => {
    return (
      <div className={cl.size} key={size}>
        {size.slice(1)}{" "}
        <input
          type="number"
          min={0}
          //@ts-expect-error
          value={sizes[size]}
          onChange={(e) => onChangeInput(e, size)}
        />
      </div>
    );
  });

  return (
    <div className={cl.wrapper}>
      <div className={cl.toggler} onClick={() => setActive((prev) => !prev)}>
        {color}
        <AiOutlineDown
          className={`${cl.arrow} ${active && cl.arrow__active}`}
          style={{ transform: `${active ? "rotate(90deg)" : "rotate(0deg)"}` }}
        />
      </div>
      <div className={`${cl.sizes} ${active && cl.sizes__active}`}>
        <div className={cl.size}>
          <div>Size</div> <div>quantity</div>
        </div>
        {inputs}
      </div>
    </div>
  );
};

export default SizeAvailable;
