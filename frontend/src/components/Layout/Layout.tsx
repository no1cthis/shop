import Head from "next/head";
import React, { FC } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

import cl from "./Layout.module.scss";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <div className={cl.layout}>
        <Head>
          <title>{title ? `${title} - Spaniel` : `Spaniel`}</title>
          <meta name="description" content="Shop website" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header>
          <Header />
        </header>
        <main className={cl.content}>{children}</main>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default Layout;
