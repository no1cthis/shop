import reservModel from "./reserv.model";

module.exports = {
  Query: {
    reservs: (_, filter) => {
      return reservModel.getAllReservs(filter);
    },
  },
  Mutation: {
    cancelReserv: (_, { id }) => {
      return reservModel.cancelReserv({ id });
    },
  },
};
