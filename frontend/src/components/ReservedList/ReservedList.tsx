import { FETCH_RESERVED } from "@/graphQL/fetchList";
import {
  CANCEL_ALL_OLDER_THAN_RESERVS,
  CANCEL_RESERV,
} from "@/graphQL/mutationList";
import { Reserved } from "@/types/reserved";
import { useMutation, useQuery } from "@apollo/client";
import { FC, useCallback, useRef, useState } from "react";
import Loading from "../Loading/Loading";
import Menu from "../menu/Menu";
import cl from "./reservedList.module.scss";

const ReservedList: FC = () => {
  const [reserved, setReserved] = useState<Reserved[]>([]);
  const [days, setDays] = useState<number>(0);
  const number = useRef(-1);
  const [cancelReserv] = useMutation(CANCEL_RESERV, {
    onCompleted: (data) => {
      if (!data.cancelReserv) {
        alert("Error");
        return;
      }

      setReserved((prev) => [
        ...prev.slice(0, number.current),
        ...prev.slice(number.current + 1),
      ]);
    },
    onError: (err) => alert(err.message),
  });
  const { loading } = useQuery(FETCH_RESERVED, {
    onCompleted: (data: { reservs: Reserved[] }) => {
      setReserved(data.reservs);
    },
    onError: (err) => alert(err.message),
    fetchPolicy: "network-only",
  });

  const [cancelAllOlderThan] = useMutation(CANCEL_ALL_OLDER_THAN_RESERVS, {
    onCompleted: () =>
      setReserved((prev) =>
        prev.filter((reserv) => reserv.created > Date.now() - 86400000 * days)
      ),
    onError: (err) => alert(err.message),
  });

  const cancelReserved = useCallback(() => {
    if (
      !confirm(
        `Are you sure you want to cancel all older than ${days} ${
          days === 1 ? `day` : `days`
        } reservs?`
      )
    )
      return;
    const trashhold = Date.now() - 86400000 * days;
    cancelAllOlderThan({ variables: { olderThan: trashhold } });
  }, [days]);

  const reservedElems = reserved?.map((reserv, i) => {
    const date = new Date(reserv.created);
    return (
      <div className={cl.reserv} key={reserv.id}>
        <Menu
          title={`RESERVED ${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`}
          className={cl.menu}
        >
          {reserv.products.map((product) => (
            <div
              key={
                product.title + product.size + product.color + product.quantity
              }
              style={{ borderBottom: "2px #000 solid" }}
              className={cl.products}
            >
              <div className={cl.col}>Title: {product.title}</div>
              <div className={cl.col}>Color: {product.color}</div>
              <div className={cl.col}>Size: {product.size}</div>
              <div className={cl.col}>Quantity: {product.quantity}</div>
            </div>
          ))}
          <div className={cl.col} style={{ padding: "10px 0" }}>
            <button
              onClick={() => {
                number.current = i;
                cancelReserv({
                  variables: { cancelReservId: reserv.id },
                });
              }}
            >
              Cancel
            </button>
          </div>
        </Menu>
      </div>
    );
  });
  if (!loading && reservedElems.length === 0)
    return <div className={cl.empty}>So far, it&apos;s empty.</div>;
  return (
    <div className={cl.wrapper}>
      <div className={cl.delete}>
        <button onClick={cancelReserved}>Cancel</button> all older than{" "}
        <input
          value={days}
          type="number"
          // @ts-expect-error
          onChange={(e) => setDays(e.target.value)}
          onBlur={(e) => {
            if (e.target.value === "") setDays(0);
          }}
        />{" "}
        day
      </div>
      {loading && <Loading />}
      {reservedElems}
    </div>
  );
};

export default ReservedList;
