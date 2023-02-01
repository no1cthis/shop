import { FC } from "react";
import Layout from "@/components/Layout/Layout";
import AdminPanel from "../../components/AdminPanel/AdminPanel";

const AdminPanelPage: FC = () => {
  return (
    <Layout>
      <AdminPanel />
    </Layout>
  );
};

export default AdminPanelPage;
