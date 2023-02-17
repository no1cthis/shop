import React, { FC, useEffect, useRef, useState } from "react";

const ResizeDiv: FC<{
  children: React.ReactNode;
  className?: string;
  width?: string | number;
}> = ({ children, className, width }) => {
  const elem = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!elem.current) return;
    setHeight(parseFloat(window.getComputedStyle(elem.current).width));
    const resizeHeight = () => {
      if (!elem.current) return;
      setHeight(parseFloat(window.getComputedStyle(elem.current).width));
    };
    window.addEventListener("resize", resizeHeight);
    return () => {
      window.removeEventListener("resize", resizeHeight);
    };
  }, []);
  return (
    <div
      ref={elem}
      className={className}
      style={{
        width: width ? width : "100%",
        height,
        position: "relative",
        maxHeight: "95vh",
      }}
    >
      {children}
    </div>
  );
};

export default ResizeDiv;
