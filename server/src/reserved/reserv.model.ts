import productsModel from "../products/products.model";
import reservCollection from "./reserv.mongo";
import { Reserved } from "./reservedType";

async function addNewReserv(reserved: Reserved) {
  for (let i = 0; i < reserved.products.length; i++) {
    const { title, color: colorName, quantity, size } = reserved.products[i];
    await productsModel.reservProduct({ title, colorName, size, quantity });
  }
  await reservCollection.findOneAndUpdate(
    {
      id: reserved.id,
    },
    reserved,
    { upsert: true }
  );

  return reserved;
}

async function cancelReserv({
  id,
  notReturnToStock,
}: {
  id: string;
  notReturnToStock?: boolean;
}) {
  const reserv = await reservCollection.findOne({ id });

  console.log(id, reserv);

  for (let i = 0; i < reserv.products.length; i++) {
    const { title, color: colorName, quantity, size } = reserv.products[i];
    await productsModel.reservProduct({
      title,
      colorName,
      size,
      quantity: notReturnToStock ? 0 : -1 * quantity,
    });
  }
  await reservCollection.findOneAndDelete({
    id,
  });

  return true;
}

async function getAllReservs({ sort = -1 }: { sort: 1 | -1 }) {
  const result = await reservCollection
    .find({}, { __v: 0 })
    .sort({ created: sort });

  return result;
}

export default { addNewReserv, cancelReserv, getAllReservs };
