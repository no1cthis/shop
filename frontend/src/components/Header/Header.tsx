import Image from "next/image";
import Link from "next/link";
import cl from "./Header.module.scss";
import { FaUserAlt, FaSearch } from "react-icons/fa";
import { BsFillBagFill } from "react-icons/bs";
import Container from "../Container/Container";
import { Dispatch, FC, SetStateAction, useState } from "react";
import ShopBasket from "../ShopBasket/ShopBasket";
import { CartProductType } from "@/types/cartProductType";
import SearchBar from "../SearchBar/SearchBar";
import logo from "../../../public/logo.jpg";
import { useQuery } from "@apollo/client";
import { FETCH_PRODUCT_TYPES } from "@/graphQL/fetchList";

interface HeaderProps {
  isAdminPanel?: boolean;
  cart?: CartProductType[];
  setCart?: Dispatch<SetStateAction<CartProductType[]>>;
}

const Header: FC<HeaderProps> = ({ isAdminPanel, cart, setCart }) => {
  const [showBasket, setShowBasket] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [types, setTypes] = useState<{ name: string; link: string }[]>([]);
  useQuery(FETCH_PRODUCT_TYPES, {
    onCompleted: ({
      allProductTypes,
    }: {
      allProductTypes: { name: string }[];
    }) => {
      setTypes([
        {
          name: "Sales",
          link: "/sales",
        },
        ...allProductTypes.map((el) => {
          return {
            name: el.name.slice(0, 1).toUpperCase() + el.name.slice(1),
            link: "/" + el.name,
          };
        }),
      ]);
    },
  });

  // const types: { name: string; link: string }[] | React.ReactNode[] = [
  //   {
  //     name: "Sales",
  //     link: "/sales",
  //   },
  //   {
  //     name: "Sneakers",
  //     link: "/sneakers",
  //   },
  //   {
  //     name: "Shoes",
  //     link: "/shoes",
  //   },
  //   {
  //     name: "Boots",
  //     link: "/boots",
  //   },
  //   {
  //     name: "Slipers",
  //     link: "/slippers",
  //   },
  // ];
  const adminPages: { name: string; link: string }[] | React.ReactNode[] = [
    {
      name: "Add Forms",
      link: "/admin-panel/add-forms",
    },
    {
      name: "Product List",
      link: "/admin-panel/product-list",
    },
    {
      name: "Order List",
      link: "/admin-panel/order-list",
    },
    {
      name: "Reserved List",
      link: "/admin-panel/reserved-list",
    },
  ];

  const generateMenu = (array: { name: string; link: string }[]) => {
    return array.map((link) => (
      <li key={link.link}>
        <Link href={link.link}>{link.name}</Link>
      </li>
    ));
  };

  let links;
  if (isAdminPanel) links = generateMenu(adminPages);
  else links = generateMenu(types);
  return (
    <div className={cl.header}>
      <Container>
        <Link href={"/sales"} className={cl.logo}>
          <Image width={50} height={50} src={logo} alt="Logo" />
        </Link>
        <nav>
          <ul className={cl.menu}>{links}</ul>
        </nav>
        <div className={cl.icons}>
          <Link href={"/admin-panel/add-forms"}>
            <FaUserAlt />
          </Link>
          <FaSearch onClick={() => setShowSearchBar(true)} />
          {!!cart &&
            setCart && [
              <span
                key="icon"
                className={cl.cart__wrapper}
                onClick={() => setShowBasket(true)}
              >
                <BsFillBagFill onClick={() => setShowBasket(true)} />
                {cart.length > 0 && (
                  <div className={cl.cart__qty}>{cart.length}</div>
                )}
              </span>,
              <ShopBasket
                showMenu={showBasket}
                setShowMenu={setShowBasket}
                cart={cart}
                setCart={setCart}
                key={"cart"}
              />,
            ]}
        </div>
      </Container>
      <SearchBar isActive={showSearchBar} setActive={setShowSearchBar} />
    </div>
  );
};

export default Header;
