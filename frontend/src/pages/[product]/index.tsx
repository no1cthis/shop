import { FC, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { useQuery } from "@apollo/client";
import { FETCH_PRODUCTS_BY_URL } from "../../service/fetchList";
import { useRouter } from "next/router";
import { Product } from "@/types/product";

const Sneakers: FC = () => {
  const [data, setData] = useState<Product>();
  const router = useRouter();
  useQuery(FETCH_PRODUCTS_BY_URL, {
    variables: { url: router.query.product },
    onCompleted: (fetchedData) => {
      setData(fetchedData.productByUrl);
    },
  });
  return <Layout>Product Page</Layout>;
};

export default Sneakers;
