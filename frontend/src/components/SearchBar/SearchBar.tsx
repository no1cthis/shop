import { FETCH_PRODUCTS_BY_TITLE } from "@/graphQL/fetchList";
import { Product } from "@/types/product";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Container from "../Container/Container";
import Loading from "../Loading/Loading";
import ProductInSearch from "../ProductInSearch/ProductInSearch";
import cl from "./searchBar.module.scss";

interface SearchBarProps {
  isActive: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
}

const SearchBar: FC<SearchBarProps> = ({ isActive, setActive }) => {
  const [search, setSearch] = useState("");

  const [fetchByTitle, { data, loading }] = useLazyQuery(
    FETCH_PRODUCTS_BY_TITLE
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search) {
        return;
      }
      fetchByTitle({ variables: { title: search } });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const closeSearch = () => {
    setActive(false);
    setSearch("");
  };

  let results = [];
  if (data)
    results = data.productsByTitle.map((product: Product) => {
      const { title, url, type } = product;
      const colors = product.color.map((el) => el.name);
      const photo = product.color[0].photos[0];
      return (
        <ProductInSearch
          key={title}
          title={title}
          url={url}
          photo={photo}
          colors={colors}
          type={type}
          closeSearch={closeSearch}
        />
      );
    });

  return (
    <div className={`${cl.wrapper} ${isActive ? cl.active : null}`}>
      <Container>
        <div className={cl.searchBar}>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className={cl.icon} />
          <div
            className={`${cl.results} ${
              search ? cl.results__active : undefined
            }`}
          >
            {!loading && results}
            {loading && <Loading />}
          </div>
        </div>
      </Container>
      <div className={cl.close} onClick={closeSearch} />
    </div>
  );
};

export default SearchBar;
