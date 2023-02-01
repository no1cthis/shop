import productsModel from "./products.model";

module.exports = {
  Query: {
    productsByPopularity: (_, { minPrice, maxPrice, type }) => {
      return productsModel.getAllProductsByPopularity(minPrice, maxPrice, type);
    },
    productByUrl: (_, { url }) => {
      return productsModel.getProductByUrl(url);
    },
    productsByPrice: (_, { minPrice, maxPrice, sort, type }) => {
      return productsModel.getAllProductsByPrice(
        minPrice,
        maxPrice,
        sort,
        type
      );
    },
  },
  Mutation: {
    addNewProduct: (
      _,
      { title, description, type, price, allSizes, color }
    ) => {
      return productsModel.addNewProduct({
        title,
        description,
        type,
        price,
        allSizes,
        color,
      });
    },
  },
};
