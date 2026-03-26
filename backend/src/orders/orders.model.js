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

    address: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

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
      // ✅ Yahan exact wohi string add kar di hai jo frontend se aa rahi hai
      enum: [
        "Cash on Delivery", 
        "Online Payment", 
        "Manual Payment (EasyPaisa/JazzCash/Bank)"
      ], 
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