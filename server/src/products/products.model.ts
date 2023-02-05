import productCollection from "./products.mongo";
import { TITLECASE_TRANSFORMER, convert } from "url-slug";
import { Product, Sizes } from "./productType";
import { validator } from "../services/validator";

async function getAllProductsFilter({
  minPrice = 0,
  maxPrice = Number.MAX_VALUE,
  sortBy = "buyCount",
  sort = 1,
  type,
  colors,
  sizes,
}: {
  minPrice: number;
  maxPrice: number;
  sortBy: "buyCount" | "price";
  sort: 1 | -1;
  type: string;
  colors: string[];
  sizes: number[];
}) {
  console.log(minPrice, maxPrice, sortBy, sort, type, colors, sizes);

  const filter: {
    price: {
      $gte: number;
      $lte: number;
    };
    type: string;
    allSizes?: { $in: number[] };
    "color.name"?: { $in: string[] };
  } = {
    price: {
      $gte: minPrice,
      $lte: maxPrice,
    },
    type,
  };
  if (sizes && sizes.length) filter.allSizes = { $in: sizes };
  if (colors && colors.length) filter["color.name"] = { $in: colors };

  return await productCollection
    .find(filter, { __v: 0 })
    .sort({ [sortBy]: sort });
}

async function getProductByUrl(url: string) {
  return await productCollection.findOne(
    {
      url,
    },
    { __v: 0 }
  );
}

async function addNewProduct(product: Product) {
  const { error, value } = validator.validateProduct(product);
  if (error) return { message: error.message, __typename: "Error" };
  const { title, description, type } = product;
  const newProduct = {
    ...product,
    title: title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase(),
    description: description.trim(),
    type: type.trim(),
    buyCount: 0,
    url:
      type.trim() +
      "/" +
      convert(title, {
        separator: "-",
        transformer: TITLECASE_TRANSFORMER,
      }),
    __typename: "Product",
  };

  await productCollection.findOneAndUpdate(
    {
      title: newProduct.title,
    },
    newProduct,
    { upsert: true }
  );
  return newProduct;
}

export default {
  getAllProductsFilter,
  getProductByUrl,
  addNewProduct,
};
