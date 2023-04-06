import Image from "next/image";
import Link from "next/link";
import cl from "./Header.module.scss";
import { FaUserAlt, FaSearch } from "react-icons/fa";
import { BsFillBagFill } from "react-icons/bs";
import Container from "../Container/Container";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import ShopBasket from "../ShopBasket/ShopBasket";
import { CartProductType } from "@/types/cartProductType";
import SearchBar from "../SearchBar/SearchBar";
import logo from "../../../public/logo.jpg";
import { useLazyQuery, useQuery } from "@apollo/client";
import { FETCH_PRODUCT_TYPES } from "@/graphQL/fetchList";
import BurgerButton from "../BurgerButton/BurgerButton";
import { useRouter } from "next/router";

interface HeaderProps {
  isAdminPanel?: boolean;
  cart?: CartProductType[];
  setCart?: Dispatch<SetStateAction<CartProductType[]>>;
}

const Header: FC<HeaderProps> = ({ isAdminPanel, cart, setCart }) => {
  const router = useRouter();
  const [showBasket, setShowBasket] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [qtyTypes, setQtyTypes] = useState(-1);
  const [types, setTypes] = useState<{ name: string; link: string }[]>([]);
  useQuery(FETCH_PRODUCT_TYPES, {
    onCompleted: ({
      allProductTypes,
    }: {
      allProductTypes: { name: string }[];
    }) => {
      setTypes([
        {
          name: "All",
          link: "/all",
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
      <li key={link.link} className={cl.menu__item}>
        <Link href={link.link}>{link.name}</Link>
      </li>
    ));
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 800) {
        setQtyTypes(0);
      } else if (window.innerWidth < 1000 && links.length > 2) {
        setQtyTypes(2);
      } else if (links.length > 5) {
        setQtyTypes(4);
      } else {
        setQtyTypes(-1);
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  let links;
  if (isAdminPanel) links = generateMenu(adminPages);
  else links = generateMenu(types);
  return (
    <div className={cl.header}>
      <Container>
        <Link href={"/all"} className={cl.logo}>
          <Image fill src={logo} alt="Logo" />
        </Link>
        <nav>
          <ul className={cl.menu}>
            {qtyTypes !== -1 ? links.slice(0, qtyTypes) : links}
            {qtyTypes !== -1 && (
              <BurgerButton
                content={links.slice(qtyTypes)}
                className={cl.menu__item}
              >
                <a>{window.innerWidth < 800 ? "Types" : "Other Types"}</a>
              </BurgerButton>
            )}
          </ul>
        </nav>
        <div className={cl.icons}>
          {typeof window !== "undefined" && window.innerWidth > 1400 && (
            <Link href={"/admin-panel/add-forms"}>
              <FaUserAlt />
            </Link>
          )}
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
