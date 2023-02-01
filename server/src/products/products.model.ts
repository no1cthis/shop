import productCollection from "./products.mongo";
import { TITLECASE_TRANSFORMER, convert } from "url-slug";

async function getAllProductsByPopularity(minPrice, maxPrice, type) {
  return await productCollection
    .find(
      {
        price: {
          $gte: minPrice ? minPrice : 0,
          $lt: maxPrice ? maxPrice : Number.MAX_VALUE,
        },
        type,
      },
      { __v: 0 }
    )
    .sort({ buyCount: -1 });
}

async function getAllProductsByPrice(minPrice, maxPrice, sort, type) {
  return await productCollection
    .find(
      {
        price: {
          $gte: minPrice ? minPrice : 0,
          $lt: maxPrice ? maxPrice : Number.MAX_VALUE,
        },
        type,
      },
      { __v: 0 }
    )
    .sort({ price: sort ? sort : 1 });
}

async function getProductByUrl(url) {
  return await productCollection.findOne(
    {
      url,
    },
    { __v: 0 }
  );
}

async function addNewProduct({
  title,
  description,
  type,
  price,
  allSizes,
  color,
}) {
  const newProduct = {
    title: title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase(),
    description,
    type,
    price,
    allSizes,
    buyCount: 0,
    url: convert(title, {
      separator: "-",
      transformer: TITLECASE_TRANSFORMER,
    }),
    color,
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
  getAllProductsByPopularity,
  getAllProductsByPrice,
  getProductByUrl,
  addNewProduct,
};
