import productsModel from "./products.model";

module.exports = {
  Query: {
    productByUrl: (_, { url }) => {
      return productsModel.getProductByUrl(url);
    },
    productsByTitle: (_, { title }) => {
      return productsModel.getProductsByTitle(title);
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
    cardsWithFilter: (_, filter) => {
      return productsModel.getAllCardsFilter(filter);
    },
    checkAvailable: (_, filter) => {
      return productsModel.checkAvailable(filter);
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
    editProduct: (_, product) => {
      return productsModel.editProduct(product);
    },
    deleteProduct: (_, { url }) => {
      return productsModel.deleteProduct(url);
    },
    buyProduct: (_, details) => {
      return productsModel.buyProduct(details);
    },
  },
};
