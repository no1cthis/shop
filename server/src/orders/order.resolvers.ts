import orderModel from "./order.model";

module.exports = {
  Query: {
    orders: (_, filter) => {
      return orderModel.getAllOrders(filter);
    },
  },
  Mutation: {
    editOrder: (_, { order }) => {
      return orderModel.addNewOrder(order);
    },
  },
};
