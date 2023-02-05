import { validator } from "../services/validator";
import colorsCollection from "./colors.mongo";
import { ColorChoose } from "./colorType";

async function getAllColors() {
  return await colorsCollection.find({}, { __v: 0 }).sort({ name: 1 });
}

async function addNewColor(color: ColorChoose) {
  const { error, value } = validator.validateColor(color);

  console.log(value, error);
  if (error) return { message: error.message, __typename: "Error" };
  color = {
    ...color,
    name: color.name.toLowerCase().trim(),
    __typename: "ColorChoose",
  };

  await colorsCollection.findOneAndUpdate(
    {
      name: color.name,
    },
    color,
    { upsert: true }
  );
  return color;
}

export default { getAllColors, addNewColor };
