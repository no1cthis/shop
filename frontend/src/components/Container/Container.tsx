import cl from "./Container.module.scss";
import { FC } from "react";

const Container: FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  return <div className={cl.container}>{children}</div>;
};

export default Container;
