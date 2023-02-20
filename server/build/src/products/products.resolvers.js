"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_model_1 = __importDefault(require("./products.model"));
module.exports = {
    Query: {
        productByUrl: (_, { url }) => {
            return products_model_1.default.getProductByUrl(url);
        },
        productsByTitle: (_, { title }) => {
            return products_model_1.default.getProductsByTitle(title);
        },
        productsWithFilter: (_, { minPrice, maxPrice, sortBy, sort, type, colors, sizes }) => {
            return products_model_1.default.getAllProductsFilter({
                minPrice,
                maxPrice,
                sortBy,
                sort,
                type,
                colors,
                sizes,
            });
        },
        cardsWithFilter: (_, filter) => {
            return products_model_1.default.getAllCardsFilter(filter);
        },
        checkAvailable: (_, filter) => {
            return products_model_1.default.checkAvailable(filter);
        },
    },
    Mutation: {
        addNewProduct: (_, { title, description, type, price, allSizes, color }) => {
            return products_model_1.default.addNewProduct({
                title,
                description,
                type,
                price,
                allSizes,
                color,
            });
        },
        editProduct: (_, product) => {
            return products_model_1.default.editProduct(product);
        },
        deleteProduct: (_, { url }) => {
            return products_model_1.default.deleteProduct(url);
        },
        buyProduct: (_, details) => {
            return products_model_1.default.buyProduct(details);
        },
    },
};
//# sourceMappingURL=products.resolvers.js.map