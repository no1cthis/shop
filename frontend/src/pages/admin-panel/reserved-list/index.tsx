import { FC } from "react";
import Layout from "@/components/Layout/Layout";
import ReservedList from "@/components/ReservedList/ReservedList";

const AdminPanelPage: FC = () => {
  return (
    <Layout title="Admin Panel">
      <ReservedList />
    </Layout>
  );
};

export default AdminPanelPage;
