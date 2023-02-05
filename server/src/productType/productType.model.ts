import { validator } from "../services/validator";
import productTypeCollection from "./productType.mongo";

async function getAllProductType() {
  return await productTypeCollection.find({}, { __v: 0 }).sort({ name: -1 });
}

async function addNewProductType(productType: {
  name: string;
  __typename?: string;
}) {
  console.log(productType.name);
  const { error, value } = validator.validateProductType(productType);
  if (error) return { message: error.message, __typename: "Error" };
  productType = {
    name: productType.name.toLowerCase().trim(),
    __typename: "ProductType",
  };

  await productTypeCollection.findOneAndUpdate(
    {
      name: productType.name,
    },
    productType,
    { upsert: true }
  );
  return productType;
}

export default { getAllProductType, addNewProductType };
