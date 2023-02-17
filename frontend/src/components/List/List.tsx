import React, { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import Card from "../Card/Card";
import { Product } from "../../types/product";
import cl from "./List.module.scss";
import Container from "../Container/Container";
import Filter from "../Filter/Filter";
import { useFilter } from "@/service/useFilter";
import { FETCH_CARDS_WITH_FILTERS } from "@/graphQL/fetchList";
import { CardType } from "@/types/card";
import { CartProductType } from "@/types/cartProductType";
import { useRouter } from "next/router";
import Loading from "../Loading/Loading";

interface ListProps {
  setCart?: Dispatch<SetStateAction<CartProductType[]>>;
}

const List: FC<ListProps> = ({ setCart }) => {
  const router = useRouter();
  let usingRouter = useMemo(
    () => !(router.asPath.split("/").pop() === "sales"),
    [router.asPath]
  );
  const { data, filter, loading, error, setFilter, setSort } = useFilter({
    usingRouter,
    apolloQuery: FETCH_CARDS_WITH_FILTERS,
    dbName: `cardsWithFilter`,
  });

  if (!loading && error) {
    return <>{error.message}</>;
  }
  const cards = data?.map((card: CardType) => {
    return (
      <Card
        title={card.title}
        price={card.price}
        url={card.url}
        colors={card.color}
        allSizes={card.allSizes}
        key={card.title}
        setCart={setCart}
      />
    );
  });
  return (
    <Container>
      <div>
        <Filter
          quantity={data?.length || 0}
          setSort={setSort}
          filter={filter}
          setFilter={setFilter}
          typeToFetch={usingRouter}
        />
        <div className={cl.list}>
          {loading && <Loading />}
          {cards}
        </div>
      </div>
    </Container>
  );
};

export default List;
