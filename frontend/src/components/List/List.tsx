import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [page, setPage] = useState(-1);

  let usingRouter = useMemo(
    () => !(router.asPath.split("/").pop() === "all"),
    [router.asPath]
  );

  const { data, filter, loading, error, setFilter, setSort, sort } = useFilter({
    usingRouter,
    apolloQuery: FETCH_CARDS_WITH_FILTERS,
    dbName: `cardsWithFilter`,
  });

  useEffect(() => {
    const addPage = () => {
      if (
        window.scrollY + window.innerHeight >
          document.body.scrollHeight - 100 &&
        page < Math.round(data?.length / 12)
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", addPage);

    return () => {
      window.removeEventListener("scroll", addPage);
    };
  }, [page]);

  useEffect(() => {
    if (!data) return;
    setPage(1);
  }, [data]);

  if (!loading && error) {
    return <>{error.message}</>;
  }

  const cards = data?.slice(0, page * 12).map((card: CardType) => {
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
          showQuantity={cards?.length}
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
