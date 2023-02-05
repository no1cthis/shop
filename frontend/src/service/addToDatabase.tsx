import { SetStateAction } from "react";

export const addToDatabase = ({
  text,
  setResultFunction,
  list,
  setListFunction,
  errorMessage,
  data,
}: {
  text: string;
  setResultFunction: (value: SetStateAction<string>) => void;
  list?: any[] | undefined;
  setListFunction?: (value: SetStateAction<any>) => void;
  errorMessage?: string;
  data?: any;
}) => {
  if (errorMessage) setResultFunction(errorMessage);
  else {
    setResultFunction(
      `${text.slice(0, 1).toUpperCase() + text.slice(1)} has been added`
    );
    if (list && setListFunction) setListFunction([...list, data]);
  }

  setTimeout(() => setResultFunction(""), 5000);
};
