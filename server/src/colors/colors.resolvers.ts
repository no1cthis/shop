import colorsModel from "./colors.model";

module.exports = {
  Query: {
    colors: () => {
      return colorsModel.getAllColors();
    },
  },
  Mutation: {
    addNewColor: (_, { name, code }) => {
      return colorsModel.addNewColor({
        name,
        code,
      });
    },
  },
};
