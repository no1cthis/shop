import colorsModel from "./colors.model";

module.exports = {
  Query: {
    colors: (_, { name }) => {
      return colorsModel.getAllColors(name);
    },
    colorsByType: (_, { type }) => {
      return colorsModel.getColorsByType(type);
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
