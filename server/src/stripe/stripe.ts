import express from "express";
import { nanoid } from "nanoid";
import orderModel from "../orders/order.model";
import { Order } from "../orders/orderType";
import productsModel from "../products/products.model";
import reservModel from "../reserved/reserv.model";
require("dotenv").config;

const router = express.Router();
const Stripe = require("stripe");

router.post("/create-checkout-session", async (req, res) => {
  if (req.body.length === 0) res.send({ error: `No products in cart` });

  const stripe = Stripe(process.env.STRIPE_KEY);

  const reservedId = nanoid();
  const line_items = [];
  const cart = [];

  for (let i = 0; i < req.body.length; i++) {
    const { title, color, price, size, photo, quantity } = req.body[i];

    const check = await productsModel.checkAvailable({
      title,
      colorName: color,
      size,
      quantity,
    });

    if (!check.ok) {
      res.send({
        err: `The stock has changed and we no longer have ${color} ${title} with ${size} size in the quantity of ${quantity}. We have ${check.available} now. We are sorry :c`,
      });
      return;
    }
    cart.push({ title, color, size, quantity });
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: title,
          images: [photo],
          description: `Color: ${color} \nSize: ${size}`,
        },
        unit_amount: price * 100,
      },
      quantity,
    });
  }

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ["UA", "PL", "GB", "DE", "LV", "EE", "JP", "FR", "IT"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "usd" },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 14 },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    metadata: {
      cart: JSON.stringify(cart),
      reservedId,
    },
    line_items,
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/payment-success`,
    cancel_url: `${process.env.FRONTEND_URL}/all`,
  });

  reservModel.addNewReserv({
    id: reservedId,
    created: Date.now(),
    products: req.body,
  });

  res.send({ url: session.url });
});

// Stripe webhook

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("webhook");
    const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK;
    const sig = req.headers["stripe-signature"];

    let event;
    const stripe = Stripe(process.env.STRIPE_KEY);
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    let data = event.data.object;
    let eventType = event.type;

    // handle the event
    if (eventType === "checkout.session.completed") {
      const order: Order = {
        id: data.metadata.reservedId,
        products: JSON.parse(data.metadata.cart),
        customer: {
          email: data.customer_details.email,
          phone: data.customer_details.phone,
          name: data.customer_details.name.toLowerCase(),
        },
        reciever: {
          name: data.shipping_details.name.toLowerCase(),
          address: {
            city: data.shipping_details.address.city.toLowerCase(),
            country: data.shipping_details.address.country.toLowerCase(),
            line1: data.shipping_details.address.line1.toLowerCase(),
            line2: data.shipping_details.address.line2.toLowerCase(),
            state: data.shipping_details.address.state.toLowerCase(),
            postal_code:
              data.shipping_details.address.postal_code.toLowerCase(),
          },
        },
        created: Date.now(),
        status: "Not sent",
      };
      console.log(data.metadata.reservedId, order);
      await orderModel.addNewOrder(order);
      await reservModel.cancelReserv({
        id: data.metadata.reservedId,
        notReturnToStock: true,
      });
      for (let i = 0; i < order.products.length; i++) {
        await productsModel.buyProduct({
          title: order.products[i].title,
          quantity: order.products[i].quantity,
        });
      }
    }

    // return 200
    res.send().end();
  }
);

export default router;
