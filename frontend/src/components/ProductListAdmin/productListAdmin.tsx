import { FETCH_PRODUCTS_WITH_FILTERS } from "@/graphQL/fetchList";
import { useFilter } from "@/service/useFilter";
import { Product } from "@/types/product";
import { FC, useState, useEffect } from "react";
import Filter from "../Filter/Filter";
import Loading from "../Loading/Loading";
import ProductAdmin from "../ProductAdmin/ProductAdmin";
import cl from "./productListAdmin.module.scss";

const ProductListAdmin: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(0);
  const [page, setPage] = useState(1);

  const {
    data,
    loading,
    error,
    filter,
    setFilter,
    setSort,
    minPrice,
    maxPrice,
  } = useFilter({
    usingRouter: false,
    fetchPolicy: "network-only",
    apolloQuery: FETCH_PRODUCTS_WITH_FILTERS,
    dbName: "productsWithFilter",
  });

  useEffect(() => {
    if (!data) return;
    setProducts(
      data.filter(
        (product: Product) =>
          product.price >= minPrice && product.price <= maxPrice
      )
    );
    setQuantity(data?.length);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    setProducts(
      data.filter(
        (product: Product) =>
          product.price >= minPrice && product.price <= maxPrice
      )
    );
    setQuantity(data?.length);
  }, [maxPrice, minPrice]);

  useEffect(() => {
    if (loading || !data) return;
    console.log(data);
    setProducts(
      data.filter(
        (product: Product) =>
          product.price >= minPrice && product.price <= maxPrice
      )
    );
  }, [loading]);

  useEffect(() => {
    if (!window) return;
    const addPage = () => {
      if (
        window.scrollY + window.innerHeight >
          document.body.scrollHeight - 100 &&
        page <= Math.round(products?.length / 20)
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", addPage);
    setQuantity(products.length);

    return () => {
      window.removeEventListener("scroll", addPage);
    };
  }, [products, page]);

  console.log(page, Math.round(products?.length / 20));

  const productList = products
    ?.slice(0, page * 20)
    .map((product) => (
      <ProductAdmin
        product={product}
        key={product.title}
        setProducts={setProducts}
        setQuantity={setQuantity}
      />
    ));

  if (error) return <>{error.message}</>;

  return (
    <div>
      <Filter
        filter={filter}
        quantity={quantity}
        setFilter={setFilter}
        setSort={setSort}
        typeToFetch={false}
        isAdminPanel={true}
        searchBar={true}
      />
      <div className={cl.list}>
        {loading && <Loading />}
        <div>{productList}</div>
        {products && products.length === 0 ? (
          <div>So far, it&apos;s empty.</div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductListAdmin;
