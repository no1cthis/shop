import cl from "./loading.module.scss";

const Loading = () => {
  return (
    <div className={cl.wrapper}>
      <div className={cl.loading} />
    </div>
  );
};

export default Loading;
