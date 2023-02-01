import { Product } from "@/types/product";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { FC, Dispatch, SetStateAction, useState } from "react";
import { FETCH_PRODUCTS_BY_POPULARITY_AND_COLOR } from "../../service/fetchList";
import PriceSlider from "../PriceSlider/PriceSlider";
import { FilterType } from "../../types/filter";
import cl from "./FilterMenu.module.scss";
import SizePick from "../SizePick/SizePick";
import ColorPick from "../ColorPick/ColorPick";

interface FilterMenuProps {
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
}

const FilterMenu: FC<FilterMenuProps> = ({
  showMenu,
  setShowMenu,
  filter,
  setFilter,
}) => {
  const router = useRouter();
  const [colors, setColors] = useState<[string, string][]>();
  useQuery<{
    productsByPopularity: [Product];
    colors: [{ name: String; code: String }];
  }>(FETCH_PRODUCTS_BY_POPULARITY_AND_COLOR, {
    variables: { type: router.pathname.slice(1) },
    onCompleted: (data) => {
      const colorsMap = new Map();
      data.productsByPopularity.forEach((product) => {
        product.color.forEach((color) => {
          //@ts-ignore
          colorsMap.set(
            color.name,
            data.colors.find(
              (colorFromData) => color.name === colorFromData.name
            )?.code
          );
        });
      });
      console.log(data);
      setColors(Array.from(colorsMap));
    },
  });

  const changeFilter = (filterType: string, value: string | number) => {
    switch (filterType) {
      case "size":
        const size = new Map(filter.size);
        if (size.get(Number(value))) size.delete(Number(value));
        else size.set(Number(value), true);
        setFilter({ ...filter, size });
        break;
      case "color":
        const color = new Map(filter.color);
        if (color.get(value.toString())) color.delete(value.toString());
        else color.set(value.toString(), true);
        setFilter({ ...filter, color });
        break;
    }
  };
  const allSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
  const sizesFilter = allSizes.map((size) => (
    <SizePick
      size={size}
      active={!!filter.size.get(size)}
      setFilter={changeFilter}
      key={size}
    />
  ));

  const colorsFilter = colors?.map((color) => (
    <ColorPick
      name={color[0]}
      colorCode={color[1]}
      active={!!filter.color.get(color[0])}
      setFilter={changeFilter}
      key={color[1]}
    />
  ));

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
        <div className={cl.filters__choose}>{sizesFilter}</div>
      </div>
      <div className={cl.filters}>
        <div className={cl.filters__title}>Colors</div>
        <div className={`${cl.filters__choose} ${cl.unselectable}`}>
          {colorsFilter}
        </div>
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
