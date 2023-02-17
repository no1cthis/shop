import { FC } from "react";
import Layout from "@/components/Layout/Layout";
import OrderList from "@/components/OrderList/OrderList";

const AdminPanelPage: FC = () => {
  return (
    <Layout title="Admin Panel">
      <OrderList />
    </Layout>
  );
};

export default AdminPanelPage;
