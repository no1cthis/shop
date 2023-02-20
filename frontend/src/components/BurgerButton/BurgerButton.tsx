import React, { FC, useState } from "react";
import cl from "./burgerButton.module.scss";

const BurgerButton: FC<{
  children: React.ReactNode;
  content: React.ReactNode[];
  className?: string;
}> = ({ children, content, className }) => {
  const [isActive, setActive] = useState(false);
  return (
    <div
      className={`${cl.button} ${className ? className : null}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
      }}
    >
      {children}
      <div className={`${cl.content} ${isActive ? cl.content__active : null}`}>
        {content}
      </div>
    </div>
  );
};

export default BurgerButton;
