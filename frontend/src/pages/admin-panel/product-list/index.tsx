import { FC } from "react";
import Layout from "@/components/Layout/Layout";
import ProductListAdmin from "@/components/ProductListAdmin/productListAdmin";

const AdminPanelPage: FC = () => {
  return (
    <Layout title="Admin Panel">
      <ProductListAdmin />
    </Layout>
  );
};

export default AdminPanelPage;
