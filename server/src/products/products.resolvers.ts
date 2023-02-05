import productsModel from "./products.model";

module.exports = {
  Query: {
    productByUrl: (_, { url }) => {
      return productsModel.getProductByUrl(url);
    },
    productsWithFilter: (
      _,
      { minPrice, maxPrice, sortBy, sort, type, colors, sizes }
    ) => {
      return productsModel.getAllProductsFilter({
        minPrice,
        maxPrice,
        sortBy,
        sort,
        type,
        colors,
        sizes,
      });
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
