import { FC, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { useRouter } from "next/router";

const AdminPanelPage: FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/add-forms");
  }, []);
  return <></>;
};

export default AdminPanelPage;
