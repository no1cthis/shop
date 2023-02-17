import { FC, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import cl from "./menu.module.scss";

const Menu: FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ children, title, className }) => {
  const [active, setActive] = useState(false);
  return (
    <div className={`${cl.wrapper} ${className}`}>
      <div className={cl.toggler} onClick={() => setActive((prev) => !prev)}>
        {title}
        <AiOutlineDown
          className={`${cl.arrow} ${active && cl.arrow__active}`}
          style={{ transform: `${active ? "rotate(90deg)" : "rotate(0deg)"}` }}
        />
      </div>
      <div className={`${cl.content} ${active && cl.content__active}`}>
        {children}
      </div>
    </div>
  );
};

export default Menu;
