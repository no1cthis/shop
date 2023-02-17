import { validator } from "../services/validator";
import colorsCollection from "./colors.mongo";
import { ColorChoose } from "./colorType";

async function getAllColors(name: string) {
  console.log(name);
  return await colorsCollection
    .find(name ? { name } : {}, { __v: 0 })
    .sort({ name: 1 });
}

async function addNewColor(color: ColorChoose) {
  const { error, value } = validator.validateColor(color);
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
async function deleteColor(name: String) {
  return (await colorsCollection.deleteOne({ name })).deletedCount > 0;
}

export default { getAllColors, addNewColor, deleteColor };
