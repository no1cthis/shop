"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_mongo_1 = __importDefault(require("./products.mongo"));
const url_slug_1 = require("url-slug");
const validator_1 = require("../services/validator");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const nanoid_1 = require("nanoid");
const sharp_1 = __importDefault(require("sharp"));
const rimraf_1 = __importDefault(require("rimraf"));
require("dotenv").config();
async function getAllProductsFilter({ minPrice = 0, maxPrice = Number.MAX_VALUE, sortBy = "buyCount", sort = 1, type, colors, sizes, }) {
    const filter = {
        price: {
            $gte: minPrice,
            $lte: maxPrice,
        },
    };
    if (sizes && sizes.length)
        filter.allSizes = { $in: sizes };
    if (colors && colors.length)
        filter["color.name"] = { $in: colors };
    if (type)
        filter.type = type;
    const result = await products_mongo_1.default
        .find(filter, { __v: 0 })
        .sort({ [sortBy]: sort });
    return result;
}
async function getAllCardsFilter({ minPrice = 0, maxPrice = Number.MAX_VALUE, sortBy = "buyCount", sort = 1, type, colors, sizes, }) {
    const cardsPerPage = 12;
    const filter = {
        price: {
            $gte: minPrice,
            $lte: maxPrice,
        },
    };
    if (sizes && sizes.length)
        filter.allSizes = { $in: sizes };
    if (colors && colors.length)
        filter["color.name"] = { $in: colors };
    if (type)
        filter.type = type;
    const result = await products_mongo_1.default
        .find(filter, { __v: 0 })
        .sort({ [sortBy]: sort });
    result.forEach((product) => {
        product.color = product.color.map((color) => {
            color.photo = color.photos[0];
            delete color.photos;
            return color;
        });
    });
    return result;
}
async function getProductByUrl(url) {
    return await products_mongo_1.default.findOne({
        url,
    }, { __v: 0 });
}
async function getProductsByTitle(title) {
    title = title.trim();
    const pattern = title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase();
    return await products_mongo_1.default
        .find({
        title: new RegExp(pattern),
    }, { __v: 0 })
        .sort({ buyCount: 1 })
        .limit(5);
}
async function addNewProduct(product) {
    const { error, value } = validator_1.validator.validateProduct(product);
    if (error)
        return { message: error.message, __typename: "Error" };
    const { title, description, type } = product;
    const check = await products_mongo_1.default.findOne({
        title: title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase(),
    }, { title: 1 });
    if (check !== null)
        return {
            message: "Product with this title already exist",
            __typename: "Error",
        };
    const url = type.trim() +
        "/" +
        (0, url_slug_1.convert)(title, { separator: "-", transformer: url_slug_1.TITLECASE_TRANSFORMER });
    try {
        const pathToImage = path_1.default.join("./photos", url);
        if (!fs_1.default.existsSync("./photos"))
            fs_1.default.mkdirSync("./photos");
        if (!fs_1.default.existsSync(path_1.default.join("./photos", type)))
            fs_1.default.mkdirSync(path_1.default.join("./photos", type));
        if (!fs_1.default.existsSync(pathToImage))
            fs_1.default.mkdirSync(pathToImage);
        product.color.forEach((color) => {
            const { name: colorName, photos } = color;
            color.photos = photos.map((photo) => {
                const fileName = (0, nanoid_1.nanoid)() + ".webp";
                if (!fs_1.default.existsSync(path_1.default.join(pathToImage, colorName)))
                    fs_1.default.mkdirSync(path_1.default.join(pathToImage, colorName));
                let buff = Buffer.from(photo.split(";base64,").pop(), "base64");
                (0, sharp_1.default)(buff)
                    .webp()
                    .toBuffer()
                    .then((newBuffer) => {
                    fs_1.default.writeFileSync(path_1.default.join(pathToImage, colorName, fileName), newBuffer, {
                        encoding: "base64",
                    });
                });
                return `${process.env.BACKEND_URL}photos/${url}/${colorName}/${fileName}`;
            });
        });
    }
    catch (err) {
        console.log(err.message);
    }
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
    await products_mongo_1.default.findOneAndUpdate({
        title: newProduct.title,
    }, newProduct, { upsert: true });
    return newProduct;
}
async function editProduct(product) {
    const { error } = validator_1.validator.validateProduct(product);
    if (error)
        return { message: error.message, __typename: "Error" };
    const { title, description, type, url: prevUrl } = product;
    const prevProduct = await products_mongo_1.default.findOne({
        url: product.url,
    });
    if (!prevProduct)
        return;
    const { title: prevTitle, type: prevType, buyCount: prevBuycount, } = prevProduct;
    const isUrlChanged = type !== prevType || title !== prevTitle;
    const url = isUrlChanged
        ? type.trim() +
            "/" +
            (0, url_slug_1.convert)(title, { separator: "-", transformer: url_slug_1.TITLECASE_TRANSFORMER })
        : prevUrl;
    const pathToImage = path_1.default.join("./photos", url);
    if (isUrlChanged) {
        if (!fs_1.default.existsSync(path_1.default.join("./photos", type)))
            fs_1.default.mkdirSync(path_1.default.join("./photos", type));
        if (fs_1.default.existsSync(path_1.default.join("./photos", prevUrl)))
            fs_1.default.renameSync(path_1.default.join("./photos", prevUrl), path_1.default.join("./photos", url));
        else
            return {
                message: "Directory with photos doesn't exist",
                __typename: "Error",
            };
    }
    const prevPhotosMap = new Map();
    const prevColorsMap = new Map();
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
            const fileName = (0, nanoid_1.nanoid)() + ".webp";
            if (!fs_1.default.existsSync(path_1.default.join(pathToImage, colorName)))
                fs_1.default.mkdirSync(path_1.default.join(pathToImage, colorName));
            let buff = Buffer.from(photo.split(";base64,").pop(), "base64");
            (0, sharp_1.default)(buff)
                .webp()
                .toBuffer()
                .then((newBuffer) => {
                fs_1.default.writeFileSync(path_1.default.join(pathToImage, colorName, fileName), newBuffer, {
                    encoding: "base64",
                });
            });
            return `${process.env.BACKEND_URL}photos/${url}/${colorName}/${fileName}`;
        });
    });
    prevColorsMap.forEach((photos, colorName) => {
        (0, rimraf_1.default)(`./photos/${url}/${colorName}`);
        photos.forEach((photo) => prevPhotosMap.delete(photo));
    });
    prevPhotosMap.forEach((colorName, photoPath) => {
        (0, rimraf_1.default)(photoPath.replace(process.env.BACKEND_URL, "./"));
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
    await products_mongo_1.default.findOneAndUpdate({
        url: prevUrl,
    }, newProduct, { upsert: true });
    return newProduct;
}
async function deleteProduct(url) {
    const isDeleted = (await products_mongo_1.default.deleteOne({ url })).deletedCount > 0;
    if (isDeleted) {
        (0, rimraf_1.default)(`./photos/${url}`);
    }
    return isDeleted;
}
async function buyProduct({ title, quantity, }) {
    await products_mongo_1.default.findOneAndUpdate({
        title,
    }, {
        $inc: { buyCount: quantity },
    }, { new: true });
    return true;
}
async function reservProduct({ title, colorName, size, quantity, }) {
    const product = await products_mongo_1.default.findOne({
        title,
    }, { _id: 0 });
    product.color = product.color.map((color) => {
        if (color.name !== colorName)
            return color;
        color.sizesAvailable[`_${size}`] -= quantity;
        return color;
    });
    await products_mongo_1.default.findOneAndUpdate({
        title,
    }, product, { upsert: true });
    return true;
}
async function checkAvailable({ title, colorName, size, quantity, }) {
    const sizeStr = `_${size}`;
    let found = await products_mongo_1.default.findOne({
        title,
    }, {
        color: {
            name: 1,
            sizesAvailable: 1,
        },
    });
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
exports.default = {
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
//# sourceMappingURL=products.model.js.map