import React, { Dispatch, FC, SetStateAction, useRef } from "react";
import cl from "./modalWindow.module.scss";

const ModalWindow: FC<{
  children: React.ReactNode;
  setModal: Dispatch<SetStateAction<boolean>>;
  className?: string;
}> = ({ children, setModal, className }) => {
  const window = useRef(null);
  return (
    <div
      className={cl.modal__wrapper}
      onClick={() => {
        setModal(false);
      }}
    >
      <div
        ref={window}
        className={`${cl.modal} ${className ? className : null}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cl.close} onClick={() => setModal(false)} />
        {children}
      </div>
    </div>
  );
};

export default ModalWindow;
