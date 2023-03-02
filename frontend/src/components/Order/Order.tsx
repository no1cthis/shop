import { EDIT_ORDER } from "@/graphQL/mutationList";
import { OrderType } from "@/types/orderType";
import { useMutation } from "@apollo/client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import Menu from "../menu/Menu";
import cl from "./order.module.scss";

const Order: FC<{
  order?: OrderType;
  number?: number;
  setOrders?: Dispatch<SetStateAction<OrderType[]>>;
  setFilter?: Dispatch<
    SetStateAction<{
      customerName: string;
      recieverName: string;
      email: string;
      phone: string;
      sortBy: string;
      sort: number;
    }>
  >;
}> = ({ order, setOrders, number, setFilter }) => {
  const [loading, setLoading] = useState(false);
  const formatString = (value: String) =>
    value.length > 0
      ? value.slice(0, 1).toUpperCase() + value.slice(1).toLowerCase()
      : "—";

  const everyWordCapitalLetter = (value: String) =>
    value
      .split(" ")
      .map((word) => formatString(word))
      .join(" ");

  const [editOrder] = useMutation(EDIT_ORDER, {
    onCompleted: (data) => {
      if (!setOrders || typeof number === "undefined") return;

      setOrders((prev) => {
        const temp = [...prev];
        temp[number] = {
          ...temp[number],
          status: data.editOrder.status,
        };

        setLoading(false);
        return temp;
      });
    },
    onError: (err) => {
      alert(err.message);
      setLoading(false);
    },
  });

  const handleStatus = () => {
    if (loading) return;
    if (!setOrders || typeof number === "undefined") return;

    setLoading(true);
    editOrder({
      variables: {
        order: {
          ...order,
          status: order?.status === "Not sent" ? "Sent" : "Not sent",
        },
      },
    });
  };
  function changeSort(sortName: "created" | "status") {
    // @ts-expect-error
    setFilter((prev) => {
      let temp = {
        ...prev,
        sortBy: sortName,
        sort: sortName === prev.sortBy ? (prev.sort === -1 ? 1 : -1) : -1,
      };
      return temp;
    });
  }

  if (setFilter || !order) {
    return (
      <>
        <span className={cl.col}>{`Ordered by`}</span>
        <span className={cl.col}>{`Send to`}</span>
        <span className={cl.col}>{`Country`}</span>
        <span className={cl.col}>{`City`}</span>
        <span className={cl.col}>{`State`}</span>
        <span className={cl.col}>{`Adress`}</span>
        <span className={cl.col}>{`Postal Code`}</span>
        <span className={cl.col}>{``}</span>
        <span
          className={`${cl.col} ${cl.pointer}`}
          onClick={() => changeSort("created")}
        >{`Ordered`}</span>
        <span
          className={`${cl.col} ${cl.pointer}`}
          onClick={() => changeSort("status")}
        >{`Status`}</span>
      </>
    );
  }
  return (
    <>
      <Menu
        title={everyWordCapitalLetter(order.customer.name)}
        className={cl.col}
      >
        <div>
          Email: <br />
          {order.customer.email}
        </div>
        <div style={{ marginTop: "5px" }}>
          Phone: <br />
          {order.customer.phone}
        </div>
      </Menu>
      <span className={cl.col}>
        {everyWordCapitalLetter(order.reciever.name)}
      </span>
      <span className={cl.col}>
        {order.reciever.address.country.toUpperCase()}
      </span>
      <span className={cl.col}>
        {formatString(order.reciever.address.city)}
      </span>
      <span className={cl.col}>
        {formatString(order.reciever.address.state)}
      </span>
      <span className={cl.col}>
        {everyWordCapitalLetter(
          order.reciever.address.line1 + " " + order.reciever.address.line2
        )}
      </span>
      <span className={cl.col}>{order.reciever.address.postal_code}</span>
      <Menu title="Products" className={cl.col}>
        {order.products.map((item) => (
          <div
            style={{ borderBottom: "2px #000 solid" }}
            key={item.photo + item.color + item.quantity + item.size}
          >
            <div>Title: {item.title}</div>
            <div>Color: {item.color}</div>
            <div>Size: {item.size}</div>
            <div>Quantity: {item.quantity}</div>
          </div>
        ))}
      </Menu>
      <span className={cl.col}>
        {`${new Date(order.created).getDate()}/${
          new Date(order.created).getMonth() + 1
        }/${new Date(order.created).getFullYear()}`}{" "}
      </span>
      <span className={`${cl.col} ${cl.pointer}`} onClick={handleStatus}>
        {order.status}
      </span>
    </>
  );
};

export default Order;
