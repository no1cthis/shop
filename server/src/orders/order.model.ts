import orderCollection from "./order.mongo";
import { Order } from "./orderType";

async function addNewOrder(order: Order) {
  await orderCollection.findOneAndUpdate(
    {
      id: order.id,
    },
    order,
    { upsert: true }
  );
  return order;
}

async function getAllOrders({
  sortBy = "created",
  sort = -1,
  customerName,
  recieverName,
  email,
  phone,
}: {
  sortBy: "created" | "status";
  sort: 1 | -1;
  customerName?: string;
  recieverName: string;
  email: string;
  phone: string;
}) {
  const filter: {
    customerName?: string;
    recieverName?: string;
    email?: string;
    phone?: string;
  } = {};
  if (customerName) {
    const pattern = customerName.trim().toLowerCase();
    filter["customer.name"] = new RegExp(pattern);
  }
  if (recieverName) {
    const pattern = recieverName.trim().toLowerCase();
    filter["reciever.name"] = new RegExp(pattern);
  }
  if (email) {
    const pattern = email.trim();
    filter["customer.email"] = new RegExp(pattern);
  }
  if (phone) {
    const pattern = phone.trim();
    filter["customer.phone"] = new RegExp(pattern);
  }

  const sortObj = { [sortBy]: sort };
  if (sortBy === "status") sortObj.created = sort;

  const result = await orderCollection.find(filter, { __v: 0 }).sort(sortObj);

  return result;
}

export default { addNewOrder, getAllOrders };
