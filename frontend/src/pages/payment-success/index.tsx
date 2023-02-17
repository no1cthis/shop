import Layout from "@/components/Layout/Layout";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";

const PaymentSuccess = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <Layout cart={[]} setCart={() => {}}>
      payment success
    </Layout>
  );
};

export default PaymentSuccess;
