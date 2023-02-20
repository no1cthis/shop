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
    cancelAllOlderThanReserv: (_, { olderThan }) => {
      return reservModel.cancelAllOlderThanReserv(olderThan);
    },
  },
};
