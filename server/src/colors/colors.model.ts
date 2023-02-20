import { validator } from "../services/validator";
import colorsCollection from "./colors.mongo";
import productCollection from "../products/products.mongo";
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
  return (await colorsCollection.deleteMany({ name })).deletedCount > 0;
}

async function getColorsByType(type) {
  const result = [];
  const names = await productCollection
    .find(type === "all" ? {} : { type })
    .distinct("color.name");
  for (let i = 0; i < names.length; i++)
    result.push(
      await colorsCollection.findOne({ name: names[i] }, { name: 1, code: 1 })
    );

  return result;
}

export default { getAllColors, addNewColor, deleteColor, getColorsByType };
