"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nanoid_1 = require("nanoid");
const order_model_1 = __importDefault(require("../orders/order.model"));
const products_model_1 = __importDefault(require("../products/products.model"));
const reserv_model_1 = __importDefault(require("../reserved/reserv.model"));
require("dotenv").config;
const router = express_1.default.Router();
const Stripe = require("stripe");
router.post("/create-checkout-session", async (req, res) => {
    if (req.body.length === 0)
        res.send({ error: `No products in cart` });
    const stripe = Stripe(process.env.STRIPE_KEY);
    const reservedId = (0, nanoid_1.nanoid)();
    const line_items = [];
    const cart = [];
    for (let i = 0; i < req.body.length; i++) {
        const { title, color, price, size, photo, quantity } = req.body[i];
        const check = await products_model_1.default.checkAvailable({
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
    reserv_model_1.default.addNewReserv({
        id: reservedId,
        created: Date.now(),
        products: req.body,
    });
    res.send({ url: session.url });
});
router.post("/webhook", express_1.default.raw({ type: "application/json" }), async (req, res) => {
    console.log("webhook");
    const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK;
    const sig = req.headers["stripe-signature"];
    let event;
    const stripe = Stripe(process.env.STRIPE_KEY);
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    let data = event.data.object;
    let eventType = event.type;
    if (eventType === "checkout.session.completed") {
        const order = {
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
                    postal_code: data.shipping_details.address.postal_code.toLowerCase(),
                },
            },
            created: Date.now(),
            status: "Not sent",
        };
        console.log(data.metadata.reservedId, order);
        await order_model_1.default.addNewOrder(order);
        await reserv_model_1.default.cancelReserv({
            id: data.metadata.reservedId,
            notReturnToStock: true,
        });
        for (let i = 0; i < order.products.length; i++) {
            await products_model_1.default.buyProduct({
                title: order.products[i].title,
                quantity: order.products[i].quantity,
            });
        }
    }
    res.send().end();
});
exports.default = router;
//# sourceMappingURL=stripe.js.map