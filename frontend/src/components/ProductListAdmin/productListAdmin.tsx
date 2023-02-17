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

  const { data, loading, error, filter, setFilter, setSort } = useFilter({
    usingRouter: false,
    fetchPolicy: "network-only",
    apolloQuery: FETCH_PRODUCTS_WITH_FILTERS,
    dbName: "productsWithFilter",
  });

  useEffect(() => {
    if (data) setQuantity(data?.length);
  }, [data]);
  useEffect(() => {
    if (loading) return;
    setProducts(data);
  }, [loading]);

  const productList = products?.map((product) => (
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
