import { ADD_PRODUCT_TYPE } from "@/graphQL/mutationList";
import { addToDatabase } from "@/service/addToDatabase";
import { useMutation } from "@apollo/client";
import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import cl from "../addForms.module.scss";

interface AddProductTypeFormProps {
  productTypeList: string[] | undefined;
  setProductTypeList: Dispatch<SetStateAction<string[] | undefined>>;
}

const AddProductTypeForm: FC<AddProductTypeFormProps> = ({
  productTypeList,
  setProductTypeList,
}) => {
  const [productTypeToAdd, setProductTypeToAdd] = useState("");
  const [productTypeAddResultMessage, setProductTypeAddResultMessage] =
    useState("");
  const [addProductTypeMutation] = useMutation(ADD_PRODUCT_TYPE, {
    onCompleted: (data) => {
      addToDatabase({
        text: data.addNewProductType.name,
        list: productTypeList,
        setResultFunction: setProductTypeAddResultMessage,
        setListFunction: setProductTypeList,
        data: data.addNewProductType.name,
      });
    },
    onError: (err) => setProductTypeAddResultMessage(err.message),
  });
  const addProductType = (e: FormEvent) => {
    e.preventDefault();
    if (productTypeList && productTypeList.length > 5) {
      alert("Max 5 type.");
      return;
    }
    addProductTypeMutation({ variables: { name: productTypeToAdd } });
  };
  return (
    <form className={cl.form} onSubmit={addProductType}>
      <div className={cl.container__title}>Add Type</div>
      <div className={cl.input}>
        <label>Type</label>
        <input
          type="text"
          placeholder="Type"
          required={true}
          value={productTypeToAdd}
          onChange={(e) => {
            setProductTypeToAdd(e.target.value);
            setTimeout(() => setProductTypeToAdd(""), 5000);
          }}
        />
      </div>

      <button className={cl.submit} type={"submit"}>
        Add Type
      </button>
      <div
        className={cl.result}
        style={{ display: !productTypeAddResultMessage ? "hidden" : undefined }}
      >
        {productTypeAddResultMessage}
      </div>
    </form>
  );
};

export default AddProductTypeForm;
