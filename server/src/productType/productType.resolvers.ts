import productTypeModel from "./productType.model";

module.exports = {
  Query: {
    allProductTypes: () => {
      return productTypeModel.getAllProductType();
    },
  },
  Mutation: {
    addNewProductType: (_, { name }) => {
      return productTypeModel.addNewProductType({
        name,
      });
    },
    deleteProductType: (_, { name }) => {
      return productTypeModel.deleteProductType(name);
    },
  },
};
