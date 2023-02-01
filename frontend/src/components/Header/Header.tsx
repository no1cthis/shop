import Image from "next/image";
import Link from "next/link";
import cl from "./Header.module.scss";
import { FaUserAlt, FaSearch } from "react-icons/fa";
import { BsFillBagFill } from "react-icons/bs";
import Container from "../Container/Container";

interface HeaderProps {
  title?: string;
  children: React.ReactNode;
}

const Header = () => {
  return (
    <div className={cl.header}>
      <Container>
        <div className={cl.logo}>
          {/* TODO: use Image component */}
          <img
            className={cl.logo}
            src="https://i.pinimg.com/564x/d1/65/38/d165388e31a2b0c5235a4cccc0f2b695.jpg"
            alt="Logo"
          />
        </div>
        <nav>
          <ul className={cl.menu}>
            <li>
              <Link href={"/sales"}>Sales</Link>
            </li>
            <li>
              <Link href={"/sneakers"}>Sneakers</Link>
            </li>
            <li>
              <Link href={"/shoes"}>Shoes</Link>
            </li>
            <li>
              <Link href={"/boots"}>Boots</Link>
            </li>
            <li>
              <Link href={"/slippers"}>Slippers</Link>
            </li>
            <li>
              <Link href={"/accesories"}>Accesories</Link>
            </li>
          </ul>
        </nav>
        <div className={cl.icons}>
          <FaUserAlt />
          <FaSearch />
          <BsFillBagFill />
        </div>
      </Container>
    </div>
  );
};

export default Header;
