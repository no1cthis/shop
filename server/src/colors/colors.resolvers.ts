import colorsModel from "./colors.model";

module.exports = {
  Query: {
    colors: (_, { name }) => {
      return colorsModel.getAllColors(name);
    },
  },
  Mutation: {
    addNewColor: (_, { name, code }) => {
      return colorsModel.addNewColor({
        name,
        code,
      });
    },
    deleteColor: (_, { name }) => {
      return colorsModel.deleteColor(name);
    },
  },
};
