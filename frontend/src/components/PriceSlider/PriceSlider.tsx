import { FilterType } from "@/types/filter";
import {
  FC,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  useCallback,
} from "react";
import cl from "./priceSlider.module.scss";

interface PriceSliderProps {
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
}

const PriceSlider: FC<PriceSliderProps> = ({ filter, setFilter }) => {
  const {
    min: minPrice,
    max: maxPrice,
    lowerPrice,
    higherPrice,
  } = filter.price;
  const minInput = useRef<HTMLInputElement>(null);
  const maxInput = useRef<HTMLInputElement>(null);

  const handleInput = useCallback(
    (input: string, type: "minPrice" | "maxPrice") => {
      if (!/^\d*\.?\d?\d?$/.test(input)) {
        return;
      }
      if (input.length > 10) return;
      switch (type) {
        case "minPrice":
          setFilter({
            ...filter,
            price: { ...filter.price, min: Number(input) },
          });
          break;
        case "maxPrice":
          setFilter({
            ...filter,
            price: { ...filter.price, max: Number(input) },
          });
          break;
      }
    },
    [filter]
  );

  const checkInputWidth = useCallback(() => {
    if (maxInput.current)
      maxInput.current.style.width = maxPrice.toString().length * 12 + "px";
    if (minInput.current)
      minInput.current.style.width = minPrice.toString().length * 12 + "px";
  }, [minPrice, maxPrice]);

  useEffect(() => {
    checkInputWidth();
  }, [minPrice, maxPrice]);
  return (
    <>
      <div className={cl.price__inputs}>
        $
        <input
          className={`${cl.price__input} ${cl.price__input__min}`}
          value={minPrice}
          ref={minInput}
          onChange={(e) => {
            handleInput(e.target.value, "minPrice");
          }}
        />
        <div className={cl.price__separator}> – </div>
        $
        <input
          className={`${cl.price__input} ${cl.price__input__max}`}
          value={maxPrice}
          ref={maxInput}
          onChange={(e) => {
            handleInput(e.target.value, "maxPrice");
          }}
        />
      </div>
      <div className={cl.price__sliders}>
        <div className={cl.price__slider__visual}>
          <div
            className={cl.price__slider__active}
            style={{
              left: `${
                ((minPrice - lowerPrice) / (higherPrice - lowerPrice)) * 100
              }%`,
              right: `${
                100 -
                ((maxPrice - lowerPrice) / (higherPrice - lowerPrice)) * 100
              }%`,
            }}
          />
        </div>
        <input
          className={cl.price__slider}
          type={"range"}
          min={lowerPrice}
          max={higherPrice}
          step={0.01}
          value={minPrice || 0}
          onChange={(e) => {
            if (Number(e.target.value) > Number(maxPrice)) return;
            setFilter({
              ...filter,
              price: { ...filter.price, min: Number(e.target.value) },
            });
            checkInputWidth();
          }}
        />
        <input
          className={cl.price__slider}
          type={"range"}
          min={lowerPrice}
          max={higherPrice}
          step={0.01}
          value={Number(maxPrice) > Number(minPrice) ? maxPrice : minPrice}
          onChange={(e) => {
            if (Number(e.target.value) < Number(minPrice)) return;
            setFilter({
              ...filter,
              price: { ...filter.price, max: Number(e.target.value) },
            });
            checkInputWidth();
          }}
        />
      </div>
    </>
  );
};

export default PriceSlider;
