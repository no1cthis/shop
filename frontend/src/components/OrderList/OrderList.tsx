import { FETCH_ORDERS } from "@/graphQL/fetchList";
import { OrderType } from "@/types/orderType";
import { useLazyQuery } from "@apollo/client";
import { FC, useEffect, useState } from "react";
import Loading from "../Loading/Loading";

import Order from "../Order/Order";
import cl from "./orderList.module.scss";

const OrderList: FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filter, setFilter] = useState({
    customerName: "",
    recieverName: "",
    email: "",
    phone: "",
    sortBy: "created",
    sort: -1,
  });

  const [fetchOrders, { loading }] = useLazyQuery(FETCH_ORDERS, {
    onCompleted: (data) => {
      setOrders(data.orders);
      console.log(data.orders);
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders({
        variables: filter,
        fetchPolicy: "no-cache",
      });
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [filter]);

  const ordersElem = orders?.map((order, i) => (
    <Order key={order.id} order={order} setOrders={setOrders} number={i} />
  ));

  return (
    <div>
      <div className={cl.filter}></div>
      <div className={cl.inputs}>
        <input
          placeholder="Customer name"
          value={filter.customerName}
          onChange={(e) =>
            setFilter({ ...filter, customerName: e.target.value })
          }
        />
        <input
          placeholder="Reciever name"
          value={filter.recieverName}
          onChange={(e) =>
            setFilter({ ...filter, recieverName: e.target.value })
          }
        />
        <input
          placeholder="Email"
          value={filter.email}
          onChange={(e) => setFilter({ ...filter, email: e.target.value })}
        />
        <input
          type={"number"}
          placeholder="Phone"
          value={filter.phone}
          onChange={(e) => setFilter({ ...filter, phone: e.target.value })}
        />
      </div>
      <div className={cl.list}>
        {loading && <Loading />}
        <Order setFilter={setFilter} />
        {ordersElem}
      </div>
    </div>
  );
};

export default OrderList;
