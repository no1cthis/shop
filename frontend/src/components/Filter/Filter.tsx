import {
  FC,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  useState,
} from "react";
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
}

const Filter: FC<FilterProps> = ({ quantity, setSort, filter, setFilter }) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <Container>
      <FilterMenu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        filter={filter}
        setFilter={setFilter}
      />
      <div className={cl.wrapper}>
        <div className={cl.filter} onClick={() => setShowMenu(!showMenu)}>
          {
            <span className={cl.icon}>
              <GoSettings />
            </span>
          }
          &nbsp; Filter
        </div>
        <div>
          <span className={cl.num}>{quantity} products</span>
          <select
            onChange={(e) => {
              setSort(e.target.value);
            }}
            name="sort"
            id="sort"
            className={cl.sort}
          >
            <option id="productsByPopularity" value="Best sellers">
              Best sellers
            </option>
            <option id="productsByPriceLowToHigh" value="Price low to high">
              Price, low to high
            </option>
            <option id="productsByPriceHighToLow" value="Price high to low">
              Price, high to low
            </option>
          </select>
        </div>
      </div>
    </Container>
  );
};

export default Filter;
