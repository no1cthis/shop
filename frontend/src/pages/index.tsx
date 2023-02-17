import { Inter } from "@next/font/google";
import { useRouter } from "next/router";
import { NextResponse } from "next/server";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/sales");
  }, []);
  return <></>;
}
