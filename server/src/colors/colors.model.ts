import colorsCollection from "./colors.mongo";

async function getAllColors() {
  return await colorsCollection.find({}, { __v: 0 }).sort({ name: -1 });
}

async function addNewColor({ name, code }) {
  const newColor = {
    name,
    code,
  };

  await colorsCollection.findOneAndUpdate(
    {
      name: newColor.name,
    },
    newColor,
    { upsert: true }
  );
  return { message: "Color added!" };
}

export default { getAllColors, addNewColor };
