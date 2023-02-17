import { ADD_COLOR } from "@/graphQL/mutationList";
import { addToDatabase } from "@/service/addToDatabase";
import { ColorChoose } from "@/types/colorChoose";
import { useMutation } from "@apollo/client";
import { useState, FormEvent, FC, Dispatch, SetStateAction } from "react";
import cl from "../addForms.module.scss";

const AddColorForm: FC<{
  colorList: ColorChoose[] | undefined;
  setColorList: Dispatch<SetStateAction<ColorChoose[] | undefined>>;
}> = ({ colorList, setColorList }) => {
  const [colorToAdd, setColorToAdd] = useState<ColorChoose>({
    name: "",
    code: "",
  });
  const [colorAddResultMessage, setColorAddResultMessage] = useState("");
  const [addColorMutation] = useMutation(ADD_COLOR, {
    onCompleted: (data) => {
      addToDatabase({
        text: data.addNewColor.name,
        list: colorList,
        setResultFunction: setColorAddResultMessage,
        setListFunction: setColorList,
        errorMessage: data.addNewColor.message,
        data: data.addNewColor,
      });
    },
    onError: (err) => {
      setColorAddResultMessage(err.message);
      setTimeout(() => setColorAddResultMessage(""), 5000);
    },
  });
  const addColor = (e: FormEvent) => {
    e.preventDefault();
    addColorMutation({ variables: colorToAdd });
  };
  return (
    <form className={cl.form} onSubmit={addColor}>
      <div className={cl.container__title}>Add Color</div>
      <div className={cl.input}>
        <label>Name</label>
        <input
          type="text"
          placeholder="Name"
          required={true}
          value={colorToAdd.name}
          onChange={(e) =>
            setColorToAdd({ ...colorToAdd, name: e.target.value })
          }
        />
      </div>
      <div className={cl.input}>
        <label>{"Code"}</label>
        <input
          type="text"
          placeholder="#000000"
          required={true}
          value={colorToAdd.code}
          onChange={(e) =>
            setColorToAdd({ ...colorToAdd, code: e.target.value })
          }
        />
      </div>
      <div
        className={cl.demonstrate}
        style={{ backgroundColor: colorToAdd.code }}
      ></div>
      <button className={cl.submit} type={"submit"}>
        Add Color
      </button>
      <div
        className={cl.result}
        style={{ display: !colorAddResultMessage ? "hidden" : undefined }}
      >
        {colorAddResultMessage}
      </div>
    </form>
  );
};

export default AddColorForm;
