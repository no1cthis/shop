import Layout from "@/components/Layout/Layout";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const router = useRouter();
  useEffect(() => {
    localStorage.clear();
    setTimeout(() => {
      router.push("/all");
    }, 3000);
  }, []);
  return (
    <Layout cart={[]} setCart={() => {}}>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "30vh",
          fontSize: "56px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Payment success
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
