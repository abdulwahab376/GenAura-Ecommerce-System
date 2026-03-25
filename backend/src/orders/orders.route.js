// const express = require("express");
// const Order = require("./orders.model");
// const router = express.Router();


// // Create Order (Cash on Delivery)
// router.post("/create-order", async (req, res) => {
//   try {

//     const { products, userId, email, totalAmount } = req.body;

//     if (!products || products.length === 0) {
//       return res.status(400).json({ message: "No products in order" });
//     }

//     const newOrder = new Order({
//       userId,
//       email,
//       products,
//       amount: totalAmount,
//       paymentMethod: "Cash on Delivery",
//       status: "pending",
//     });

//     await newOrder.save();

//     res.status(201).json({
//       message: "Order placed successfully",
//       order: newOrder,
//     });

//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // Get single order (ADMIN VIEW ORDER)
// router.get("/order/:id", async (req, res) => {
//   try {

//     const orderId = req.params.id;

//     if (!orderId) {
//       return res.status(400).json({ message: "Order ID required" });
//     }

//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json(order);

//   } catch (error) {
//     console.error("Error fetching order:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // Get all orders (Admin Dashboard)
// router.get("/", async (req, res) => {
//   try {

//     const orders = await Order.find().sort({ createdAt: -1 });

//     res.status(200).json(orders);

//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // Get orders by email (User Orders)
// router.get("/user/:email", async (req, res) => {

//   const email = req.params.email;

//   if (!email) {
//     return res.status(400).json({ message: "Email parameter is required" });
//   }

//   try {

//     const orders = await Order.find({ email }).sort({ createdAt: -1 });

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({
//         order: 0,
//         message: "No orders found for this email",
//       });
//     }

//     res.json(orders);

//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Server error" });
//   }

// });


// // Update order status
// router.patch("/update-order-status/:id", async (req, res) => {
//   try {

//     const { id } = req.params;
//     const { status } = req.body;

//     if (!status) {
//       return res.status(400).json({ message: "Order status is required" });
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       id,
//       { status, updatedAt: Date.now() },
//       { new: true, runValidators: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json({
//       message: "Order status updated successfully",
//       order: updatedOrder,
//     });

//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // Delete order
// router.delete("/delete-order/:id", async (req, res) => {
//   try {

//     const { id } = req.params;

//     const deletedOrder = await Order.findByIdAndDelete(id);

//     if (!deletedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json({
//       message: "Order deleted successfully",
//       order: deletedOrder,
//     });

//   } catch (error) {
//     console.error("Error deleting order:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const Order = require("./orders.model");
const Products = require("../products/products.model"); 
const router = express.Router();

// 1. CREATE ORDER (With Safe Inventory Update)
router.post("/create-order", async (req, res) => {
  try {
    const { products, userId, email, amount, address, phone, paymentMethod } = req.body;

    // A. Naya Order Create Karein
    const newOrder = new Order({
      userId,
      email,
      products,
      amount: amount,
      address,
      phone,
      paymentMethod: paymentMethod || "Cash on Delivery",
      status: "pending",
    });

    // B. Order Save Karein
    await newOrder.save();

    // C.  SAFE SMART LOGIC: String Type Mismatch Error se bachne ke liye
    for (const item of products) {
      const productData = await Products.findById(item.productId);
      
      if (productData) {
        // Force conversion: String ho ya Number, hum isay number bana kar minus karenge
        const currentStock = Number(productData.stock) || 0;
        const newStock = currentStock - item.quantity;

        await Products.findByIdAndUpdate(
          item.productId, 
          { stock: newStock } // Direct value set karein taake $inc ka type error na aaye
        );
      }
    }

    res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
});

// ⭐ 2. GET SINGLE ORDER
router.get("/order/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ⭐ 3. GET ORDERS BY EMAIL
router.get("/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const orders = await Order.find({ email: email }).sort({ createdAt: -1 });
    res.status(200).json(orders || []);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4. GET ALL ORDERS (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 5. UPDATE STATUS & DELETE
router.patch("/update-order-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ message: "Status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete-order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;