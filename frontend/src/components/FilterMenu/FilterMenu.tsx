import { Product } from "@/types/product";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import {
  FC,
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useMemo,
} from "react";
import { FETCH_COLORS, FETCH_COLORS_BY_TYPE } from "../../graphQL/fetchList";
import PriceSlider from "../PriceSlider/PriceSlider";
import { FilterType } from "../../types/filter";
import cl from "./FilterMenu.module.scss";
import SizePick from "../SizePick/SizePick";
import ColorPick from "../ColorPick/ColorPick";
import { sizes } from "@/types/sizes";
import { ColorChoose } from "@/types/colorChoose";

interface FilterMenuProps {
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
  typeToFetch?: string | boolean;
}

const FilterMenu: FC<FilterMenuProps> = ({
  showMenu,
  setShowMenu,
  filter,
  setFilter,
  typeToFetch,
}) => {
  const router = useRouter();
  const type =
    typeof typeToFetch === "string"
      ? typeToFetch
      : typeToFetch === false
      ? undefined
      : router.asPath.slice(1);
  const [colors, setColors] = useState<ColorChoose[]>();

  useQuery(type ? FETCH_COLORS_BY_TYPE : FETCH_COLORS, {
    variables: { type },
    onCompleted: (
      data: { colorsByType: ColorChoose[] } | { colors: ColorChoose[] }
    ) => {
      // @ts-expect-error
      setColors(data[type ? "colorsByType" : "colors"]);
    },
  });

  const changeFilter = useCallback(
    (value: string | number, filterType?: string) => {
      switch (filterType) {
        case "size":
          const size = new Map(filter.size);
          if (size.get(Number(value))) size.delete(Number(value));
          else size.set(Number(value), Number(value));
          setFilter({ ...filter, size });
          break;
        case "color":
          const color = new Map(filter.color);
          if (color.get(value.toString())) color.delete(value.toString());
          else color.set(value.toString(), value.toString());
          setFilter({ ...filter, color });
          break;
      }
    },
    [filter]
  );

  const sizesFilter = useMemo(
    () =>
      sizes.map((size) => (
        <SizePick
          size={size}
          active={!!filter.size.get(size)}
          setFilter={changeFilter}
          key={size}
        />
      )),
    [sizes]
  );

  const colorsFilter = useMemo(
    () =>
      colors?.map((color) => (
        <ColorPick
          name={color.name}
          colorCode={color.code}
          active={!!filter.color.get(color.name)}
          setFilter={changeFilter}
          key={color.name}
        />
      )),
    [colors]
  );

  return (
    <div
      className={cl.menu}
      style={{
        right: showMenu ? 0 : undefined,
      }}
    >
      <div className={cl.close} onClick={() => setShowMenu(false)} />
      <div className={cl.title}>FILTER</div>
      <div className={cl.filters}>
        <div className={cl.filters__title}>size</div>
        <div>{sizesFilter}</div>
      </div>
      <div className={cl.filters}>
        <div className={cl.filters__title}>Colors</div>
        <div className={`${cl.colors} ${cl.unselectable}`}>{colorsFilter}</div>
      </div>
      <div className={cl.filters}>
        <div className={cl.filters__title}>Price</div>
        <div className={`${cl.price__choose} ${cl.unselectable}`}>
          <PriceSlider filter={filter} setFilter={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;
