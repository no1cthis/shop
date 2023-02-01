import { ColorChoose } from "@/types/colorChoose";
import { Details } from "@/types/product";
import { FC, useState } from "react";
import { ADD_COLOR } from "@/service/mutationList";
import Container from "../Container/Container";
import cl from "./adminPanel.module.scss";

const AdminPanel: FC = () => {
  const [details, setDetails] = useState<Details>({
    title: "",
    description: "",
    price: "",
    type: "",
    color: [],
    allSizes: [],
  });
  const [color, setColor] = useState<ColorChoose>({
    name: "",
    code: "",
  });

  const addColor = () => {};

  const addProductInputs = Object.entries(details).map((input) => {
    if (typeof input[1] !== "string") return;
    const title = input[0].slice(0, 1).toUpperCase() + input[0].slice(1);
    return (
      <div className={cl.input}>
        <label>{title}</label>
        <input
          type="text"
          placeholder={title}
          required={true}
          //@ts-ignore
          value={details[input[0]]}
          onChange={(e) =>
            setDetails({ ...details, [input[0]]: e.target.value })
          }
        />
      </div>
    );
  });

  return (
    <Container>
      <div className={cl.wrapper}>
        <form>
          <div className={cl.container__title}>Add Product</div>
          {addProductInputs}
          <button className={cl.submit}>Add Product</button>
        </form>
        <form className={cl.addColor__wrapper}>
          <div className={cl.container__title}>Add Color</div>
          <div className={cl.input}>
            <label>Name</label>
            <input type="text" placeholder="Name" required={true} />
          </div>
          <div className={cl.input}>
            <label>{"Code"}</label>
            <input type="text" placeholder="#000000" required={true} />
          </div>
          <button className={cl.submit}>Add Color</button>
        </form>
      </div>
    </Container>
  );
};

export default AdminPanel;
