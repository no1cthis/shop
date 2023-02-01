import Link from "next/link";
import { FC } from "react";
import Container from "../Container/Container";
import cl from "./Footer.module.scss";

const Footer: FC = () => {
  return (
    <div className={cl.footer}>
      <Container>
        <div className={cl.wrapper}>
          <div className={cl.columnLeft}>
            <span>Want to see more my projects?</span>
            <br /> Click on button!
          </div>
          <div className={cl.columnRight}>
            <Link href={"https://no1cthis.github.io/"}>
              <span>My porfolio</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
