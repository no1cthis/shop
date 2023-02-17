import productCollection from "./products.mongo";
import { TITLECASE_TRANSFORMER, convert } from "url-slug";
import { Product, Sizes } from "./productType";
import { validator } from "../services/validator";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import sharp from "sharp";
import rimraf from "rimraf";
require("dotenv").config();

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
  const filter: {
    price: {
      $gte: number;
      $lte: number;
    };
    type?: string;
    allSizes?: { $in: number[] };
    "color.name"?: { $in: string[] };
  } = {
    price: {
      $gte: minPrice,
      $lte: maxPrice,
    },
  };
  if (sizes && sizes.length) filter.allSizes = { $in: sizes };
  if (colors && colors.length) filter["color.name"] = { $in: colors };
  if (type) filter.type = type;

  const result = await productCollection
    .find(filter, { __v: 0 })
    .sort({ [sortBy]: sort });

  // result.map((product) => {
  //   const demoPhotos = [];
  //   product.color.forEach((color) => {
  //     demoPhotos.push(color.photos[0]);
  //   });
  //   // @ts-expect-error
  //   product.demoPhotos = demoPhotos;
  // });
  return result;
}

async function getAllCardsFilter({
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
  const filter: {
    price: {
      $gte: number;
      $lte: number;
    };
    type?: string;
    allSizes?: { $in: number[] };
    "color.name"?: { $in: string[] };
  } = {
    price: {
      $gte: minPrice,
      $lte: maxPrice,
    },
  };
  if (sizes && sizes.length) filter.allSizes = { $in: sizes };
  if (colors && colors.length) filter["color.name"] = { $in: colors };
  if (type) filter.type = type;

  const result = await productCollection
    .find(filter, { __v: 0 }) // NOT CHECKED!!!!!!!!!!!!!!!!!!!!!!!!!!!!! { __v: 0, title: 1, price: 1, url: 1, color: 1, allSizes: 1 }
    .sort({ [sortBy]: sort });

  result.forEach((product) => {
    product.color = product.color.map((color) => {
      // @ts-expect-error
      color.photo = color.photos[0];
      delete color.photos;
      return color;
    });
  });
  console.log(result);
  return result;
}

async function getProductByUrl(url: string) {
  console.log(url);
  return await productCollection.findOne(
    {
      url,
    },
    { __v: 0 }
  );
}

async function getProductsByTitle(title: string) {
  title = title.trim();
  const pattern =
    title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase();
  return await productCollection
    .find(
      {
        title: new RegExp(pattern),
      },
      { __v: 0 }
    )
    .sort({ buyCount: 1 });
}

async function addNewProduct(product: Product) {
  const { error, value } = validator.validateProduct(product);
  if (error) return { message: error.message, __typename: "Error" };
  const { title, description, type } = product;
  const check = await productCollection.findOne(
    {
      title: title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase(),
    },
    { title: 1 }
  );
  if (check !== null)
    return {
      message: "Product with this title already exist",
      __typename: "Error",
    };

  const url =
    type.trim() +
    "/" +
    convert(title, { separator: "-", transformer: TITLECASE_TRANSFORMER });

  const pathToImage = path.join("./photos", url);
  if (!fs.existsSync("./photos")) fs.mkdirSync("./photos");
  if (!fs.existsSync(path.join("./photos", type)))
    fs.mkdirSync(path.join("./photos", type));
  if (!fs.existsSync(pathToImage)) fs.mkdirSync(pathToImage);
  console.log(111);
  product.color.forEach((color) => {
    const { name: colorName, photos } = color;
    color.photos = photos.map((photo) => {
      const fileName = nanoid() + ".webp";
      console.log(color.name);
      if (!fs.existsSync(path.join(pathToImage, colorName)))
        fs.mkdirSync(path.join(pathToImage, colorName));
      let buff = Buffer.from(photo.split(";base64,").pop(), "base64");
      sharp(buff)
        .webp()
        .toBuffer()
        .then((newBuffer) => {
          fs.writeFileSync(
            path.join(pathToImage, colorName, fileName),
            newBuffer,
            {
              encoding: "base64",
            }
          );
        });

      console.log(`${process.env.BACKEND_URL}/${pathToImage}/${fileName}`);
      return `${process.env.BACKEND_URL}photos/${url}/${colorName}/${fileName}`;
    });
  });
  const newProduct = {
    ...product,
    title: title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase(),
    description: description.trim(),
    type: type.trim(),
    price: Number(product.price).toFixed(2),
    buyCount: 0,
    url,
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

async function editProduct(product: Product) {
  const { error } = validator.validateProduct(product);
  if (error) return { message: error.message, __typename: "Error" };
  const { title, description, type, url: prevUrl } = product;
  const prevProduct = await productCollection.findOne({
    url: product.url,
  });
  if (!prevProduct) return;
  const {
    title: prevTitle,
    type: prevType,
    buyCount: prevBuycount,
  } = prevProduct;

  const isUrlChanged = type !== prevType || title !== prevTitle;

  const url = isUrlChanged
    ? type.trim() +
      "/" +
      convert(title, { separator: "-", transformer: TITLECASE_TRANSFORMER })
    : prevUrl;
  const pathToImage = path.join("./photos", url);

  if (isUrlChanged) {
    if (!fs.existsSync(path.join("./photos", type)))
      fs.mkdirSync(path.join("./photos", type));
    if (fs.existsSync(path.join("./photos", prevUrl)))
      fs.renameSync(path.join("./photos", prevUrl), path.join("./photos", url));
    else
      return {
        message: "Directory with photos doesn't exist",
        __typename: "Error",
      };
  }
  const prevPhotosMap = new Map<string, string>();
  const prevColorsMap = new Map<string, string[]>();

  prevProduct.color.forEach(({ photos, name: colorName }) => {
    prevColorsMap.set(colorName, photos);
    photos.forEach((photo) => prevPhotosMap.set(photo, colorName));
  });

  product.color.forEach((color) => {
    const { name: colorName, photos } = color;
    prevColorsMap.delete(colorName);

    color.photos = photos.map((photo) => {
      prevPhotosMap.delete(photo);
      if (!/^data:((?:\w+\/(?:(?!;).)+)?)((?:;[\w=]*[^;])*),(.+)$/.test(photo))
        return isUrlChanged ? photo.replace(prevUrl, url) : photo;
      const fileName = nanoid() + ".webp";
      if (!fs.existsSync(path.join(pathToImage, colorName)))
        fs.mkdirSync(path.join(pathToImage, colorName));
      let buff = Buffer.from(photo.split(";base64,").pop(), "base64");
      sharp(buff)
        .webp()
        .toBuffer()
        .then((newBuffer) => {
          fs.writeFileSync(
            path.join(pathToImage, colorName, fileName),
            newBuffer,
            {
              encoding: "base64",
            }
          );
        });

      return `${process.env.BACKEND_URL}photos/${url}/${colorName}/${fileName}`;
    });
  });

  prevColorsMap.forEach((photos, colorName) => {
    rimraf(`./photos/${url}/${colorName}`);
    photos.forEach((photo) => prevPhotosMap.delete(photo));
  });

  prevPhotosMap.forEach((colorName, photoPath) => {
    rimraf(photoPath.replace(process.env.BACKEND_URL, "./"));
  });

  const newProduct = {
    ...product,
    title: title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase(),
    description: description.trim(),
    type: type.trim(),
    price: Number(product.price).toFixed(2),
    buyCount: prevBuycount,
    url,
    __typename: "Product",
  };

  await productCollection.findOneAndUpdate(
    {
      url: prevUrl,
    },
    newProduct,
    { upsert: true }
  );

  return newProduct;
}

async function deleteProduct(url: String) {
  const isDeleted =
    (await productCollection.deleteOne({ url })).deletedCount > 0;
  if (isDeleted) {
    rimraf(`./photos/${url}`);
  }
  return isDeleted;
}

async function buyProduct({
  title,
  quantity,
}: {
  title: String;
  quantity: number;
  colorName: string;
}) {
  await productCollection.findOneAndUpdate(
    {
      title,
    },
    {
      $inc: { buyCount: quantity },
    },
    { new: true }
  );

  return true;
}

async function reservProduct({
  title,
  colorName,
  size,
  quantity,
}: {
  title: string;
  colorName: string;
  size: number;
  quantity: number;
}) {
  const product = await productCollection.findOne(
    {
      title,
    },
    { _id: 0 }
  );

  console.log(product);

  product.color = product.color.map((color) => {
    if (color.name !== colorName) return color;
    color.sizesAvailable[`_${size}`] -= quantity;
    return color;
  });

  await productCollection.findOneAndUpdate(
    {
      title,
    },
    product,
    { upsert: true }
  );

  return true;
}

async function checkAvailable({
  title,
  colorName,
  size,
  quantity,
}: {
  title: String;
  colorName: String;
  size: number;
  quantity: number;
}) {
  const sizeStr = `_${size}`;

  let found = await productCollection.findOne(
    {
      title,
    },
    {
      color: {
        name: 1,
        sizesAvailable: 1,
      },
    }
  );
  if (!found)
    return {
      ok: false,
      available: 0,
    };
  const product = found.color.filter((el) => el.name === colorName);

  return {
    ok: product[0].sizesAvailable[sizeStr] >= quantity,
    available: product[0].sizesAvailable[sizeStr],
  };
}

export default {
  getAllProductsFilter,
  getAllCardsFilter,
  getProductsByTitle,
  getProductByUrl,
  addNewProduct,
  editProduct,
  deleteProduct,
  buyProduct,
  checkAvailable,
  reservProduct,
};
