import { FC } from "react";
import Layout from "@/components/Layout/Layout";
import AddForms from "@/components/AddForms/addForms";

const AdminPanelPage: FC = () => {
  return (
    <Layout title="Admin Panel">
      <AddForms />
    </Layout>
  );
};

export default AdminPanelPage;
