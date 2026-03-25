// const express = require("express");
// const User = require("../users/user.model");
// const Order = require("../orders/orders.model");
// const Reviews = require("../reviews/reviews.model");
// const Products = require("../products/products.model");
// const router = express.Router();

// router.get("/user-stats/:email", async (req, res) => {
//   const { email } = req.params;

//   if (!email) {
//     return res.status(400).json({ message: "Email parameter is required" });
//   }

//   try {
//     // Find user by email
//     const user = await User.findOne({ email: email });
//     // console.log(user)

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Aggregate total payments (sum of all order amounts)
//     const totalPaymentsResult = await Order.aggregate([
//       { $match: { email: email } },
//       { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
//     ]);

//     const totalPaymentsAmount = totalPaymentsResult.length > 0 ? totalPaymentsResult[0].totalAmount : 0;

//     // Aggregate total reviews given
//     const totalReviews = await Reviews.countDocuments({ userId: user._id });

//     // Aggregate total purchased products (count distinct product IDs)
//     const purchasedProductIds = await Order.distinct("products.productId", { email: email });
//     const totalPurchasedProducts = purchasedProductIds.length;

//     res.status(200).json({
//       totalPayments: totalPaymentsAmount.toFixed(2), // Format as currency if needed
//       totalReviews,
//       totalPurchasedProducts,
//     });
//   } catch (error) {
//     console.error("Error fetching user stats:", error);
//     res.status(500).json({ message: "Failed to fetch user stats" });
//   }
// });

// router.get('/admin-stats', async (req, res) => {
//   try {
//     // Count total orders
//     const totalOrders = await Order.countDocuments();

//     // Count total products
//     const totalProducts = await Products.countDocuments();

//     // Count total reviews
//     const totalReviews = await Reviews.countDocuments();

//     // Count total users
//     const totalUsers = await User.countDocuments();

//     // Calculate total earnings by summing the 'amount' of all orders
//     const totalEarningsResult = await Order.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalEarnings: { $sum: "$amount" },
//         },
//       },
//     ]);

//     const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;

//     // Calculate monthly earnings by summing the 'amount' of all orders grouped by month
//     const monthlyEarningsResult = await Order.aggregate([
//       {
//         $group: {
//           _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
//           monthlyEarnings: { $sum: "$amount" },
//         },
//       },
//       {
//         $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
//       }
//     ]);

//     // Format the monthly earnings data for easier consumption on the frontend
//     const monthlyEarnings = monthlyEarningsResult.map(entry => ({
//       month: entry._id.month,
//       year: entry._id.year,
//       earnings: entry.monthlyEarnings,
//     }));

//     // Send the aggregated data
//     res.status(200).json({
//       totalOrders,
//       totalProducts,
//       totalReviews,
//       totalUsers,
//       totalEarnings, // Include total earnings
//       monthlyEarnings, // Include monthly earnings
//     });
//   } catch (error) {
//     console.error("Error fetching admin stats:", error);
//     res.status(500).json({ message: "Failed to fetch admin stats" });
//   }
// });

// module.exports = router;



const express = require("express");
const User = require("../users/user.model");
const Order = require("../orders/orders.model");
const Reviews = require("../reviews/reviews.model");
const Products = require("../products/products.model");
const router = express.Router();

// --- User Stats Route (No changes needed here) ---
router.get("/user-stats/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) return res.status(400).json({ message: "Email parameter is required" });

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalPaymentsResult = await Order.aggregate([
      { $match: { email: email } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);

    const totalPaymentsAmount = totalPaymentsResult.length > 0 ? totalPaymentsResult[0].totalAmount : 0;
    const totalReviews = await Reviews.countDocuments({ userId: user._id });
    const purchasedProductIds = await Order.distinct("products.productId", { email: email });
    const totalPurchasedProducts = purchasedProductIds.length;

    res.status(200).json({
      totalPayments: totalPaymentsAmount.toFixed(2),
      totalReviews,
      totalPurchasedProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
});

// --- UPDATED ADMIN STATS ROUTE ---
router.get('/admin-stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Products.countDocuments();
    const totalReviews = await Reviews.countDocuments();
    const totalUsers = await User.countDocuments();

    // 1. Total Earnings
    const totalEarningsResult = await Order.aggregate([
      { $group: { _id: null, totalEarnings: { $sum: "$amount" } } }
    ]);
    const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;

    // 2. Monthly Earnings (For Charts)
    const monthlyEarningsResult = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          monthlyEarnings: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthlyEarnings = monthlyEarningsResult.map(entry => ({
      month: entry._id.month,
      year: entry._id.year,
      earnings: entry.monthlyEarnings,
    }));

    // 3.  HIGHEST SALE PRODUCTS (Top 5)
    const topSellingProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          name: { $first: "$products.name" },
          totalSales: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          name: 1,
          totalSales: 1,
          category: { $literal: "General" } // Backend me category store nahi hai isliye default
        }
      }
    ]);

    // 4.  OUT OF STOCK / LOW STOCK (Stock < 6)
    const outOfStockProducts = await Products.find({ stock: { $lt: 6 } })
      .select('name category stock')
      .limit(5)
      .sort({ stock: 1 });

    // 5. Final Response
    res.status(200).json({
      totalOrders,
      totalProducts,
      totalReviews,
      totalUsers,
      totalEarnings,
      monthlyEarnings,
      topSellingProducts, // Frontend pe tables ke liye
      outOfStockProducts  // Frontend pe tables ke liye
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

module.exports = router;
