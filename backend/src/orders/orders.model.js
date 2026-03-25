const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      default: () => "ORD" + Date.now()
    },

    userId: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        image: {
          type: String,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    //  Address ko object bana diya taake sari details save hon
    address: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    //  Phone number ke liye alag field
    phone: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Online Payment", "Manual Payment"], // Option barha diya
      default: "Cash on Delivery",
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;