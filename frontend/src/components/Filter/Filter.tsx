import { FC, Dispatch, SetStateAction, useState, useMemo } from "react";
import Container from "../Container/Container";
import { GoSettings } from "react-icons/go";
import cl from "./Filter.module.scss";
import FilterMenu from "../FilterMenu/FilterMenu";
import { FilterType } from "@/types/filter";

interface FilterProps {
  quantity: number;
  setSort: Dispatch<SetStateAction<string>>;
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
  typeToFetch?: string | boolean;
  isAdminPanel?: boolean;
  searchBar?: boolean;
  showQuantity?: number;
}

const Filter: FC<FilterProps> = ({
  quantity,
  setSort,
  filter,
  setFilter,
  typeToFetch,
  isAdminPanel,
  searchBar,
  showQuantity,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const optionsArray = useMemo(
    () =>
      ["Best sellers", "Price low to high", "Price high to low"].concat(
        isAdminPanel ? ["Type", "Title"] : []
      ),
    []
  );
  const optionsElems = useMemo(
    () =>
      optionsArray.map((text) => (
        <option value={text} key={text}>
          {text}
        </option>
      )),
    []
  );
  return (
    <Container>
      <FilterMenu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        filter={filter}
        setFilter={setFilter}
        typeToFetch={typeToFetch}
      />
      <div className={cl.wrapper}>
        <div className={cl.filter} onClick={() => setShowMenu(!showMenu)}>
          <span className={cl.icon}>
            <GoSettings />
          </span>
          &nbsp; Filter
        </div>
        <div>
          <span className={cl.num}>
            {showQuantity ? `${showQuantity} of ` : null} {quantity}{" "}
            {quantity === 1 ? `product` : `products`}
          </span>
          {searchBar && (
            <input
              type="text"
              className={cl.input}
              placeholder="Search by title"
              value={filter.title}
              onChange={(e) => setFilter({ ...filter, title: e.target.value })}
            />
          )}
          <select
            onChange={(e) => {
              setSort(e.target.value);
            }}
            name="sort"
            id="sort"
            className={cl.sort}
          >
            {optionsElems}
          </select>
        </div>
      </div>
    </Container>
  );
};

export default Filter;
