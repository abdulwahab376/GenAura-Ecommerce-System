// const express = require("express");
// const Reviews = require("./reviews.model");
// const Products = require("../products/products.model");
// const router = express.Router();

// // post a new review or update a existing review
// router.post('/post-review', async (req, res) => {
//   try {
//     const { comment, rating, productId, userId } = req.body;

//     // Validate request data
//     if (!comment || rating === undefined || !productId || !userId) {
//       return res.status(400).send({ message: 'All fields are required' });
//     }

//     // Find existing review by userId and productId
//     const existingReview = await Reviews.findOne({ productId, userId });

//     if (existingReview) {
//       // Update existing review
//       existingReview.comment = comment;
//       existingReview.rating = rating;
//       await existingReview.save();
//     } else {
//       // Create a new review
//       const newReview = new Reviews({
//         comment,
//         rating,
//         userId,
//         productId,
//       });

//       await newReview.save();
//     }

//     // Calculate the new average rating for the product
//     const reviews = await Reviews.find({ productId });
//     if (reviews.length > 0) {
//       const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
//       const averageRating = totalRating / reviews.length;

//       const product = await Products.findById(productId);
//       if (product) {
//         product.rating = averageRating;
//         await product.save({ validateBeforeSave: false }); // Disable validation on save
//       } else {
//         return res.status(404).send({ message: 'Product not found' });
//       }
//     }

//     res.status(200).send({
//       message: 'Review processed successfully', reviews: reviews
//     });
//   } catch (error) {
//     console.error('Error posting review:', error);
//     res.status(500).send({ message: 'Failed to post review', error: error.message });
//   }
// });
// // total review count
// router.get("/total-reviews", async (req, res) => {
//   try {
//     const totalReviews = await Reviews.countDocuments({});
//     res.status(200).send({ totalReviews });
//   } catch (error) {
//     console.error("Error fetching total comments:", error);
//     res.status(500).send({ message: "Failed to fetch total reviews" });
//   }
// });

// // get reviews by user
// router.get("/:userId", async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({ message: "User id is required" });
//   }

//   try {
//     const reviews = await Reviews.find({ userId: userId }).sort({ createdAt: -1 });

//     if (reviews.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No reviews found for this user" });
//     }

//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error("Error fetching reviews by user:", error);
//     res.status(500).json({ message: "Failed to fetch reviews" });
//   }
// });

// module.exports = router;






// const express = require("express");
// const Reviews = require("./reviews.model");
// const Products = require("../products/products.model");
// const router = express.Router();

// // post a new review or update a existing review
// router.post('/post-review', async (req, res) => {
//   try {
//     const { comment, rating, productId, userId } = req.body;

//     // Validate request data
//     if (!comment || rating === undefined || !productId || !userId) {
//       return res.status(400).send({ message: 'All fields are required' });
//     }

//     // Find existing review by userId and productId
//     const existingReview = await Reviews.findOne({ productId, userId });

//     if (existingReview) {
//       // Update existing review
//       existingReview.comment = comment;
//       existingReview.rating = rating;
//       await existingReview.save();
//     } else {
//       // Create a new review
//       const newReview = new Reviews({
//         comment,
//         rating,
//         userId,
//         productId,
//       });

//       await newReview.save();
//     }

//     // ⭐ Logic to update Product with new Rating and Review Count
//     const reviews = await Reviews.find({ productId });
    
//     if (reviews.length > 0) {
//       const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
//       const averageRating = totalRating / reviews.length;

//       const product = await Products.findById(productId);
//       if (product) {
//         // 1. Average rating update
//         product.rating = averageRating;
        
//         // 2. ✅ Update total reviews count field
//         product.numReviews = reviews.length;
        
//         // 3. ✅ Update reviews array with all review IDs
//         product.reviews = reviews.map(rev => rev._id);

//         // Save product changes without triggering full schema validation
//         await product.save({ validateBeforeSave: false });
//       } else {
//         return res.status(404).send({ message: 'Product not found' });
//       }
//     }

//     res.status(200).send({
//       message: 'Review processed successfully', 
//       reviews: reviews
//     });
//   } catch (error) {
//     console.error('Error posting review:', error);
//     res.status(500).send({ message: 'Failed to post review', error: error.message });
//   }
// });

// // Get total review count across all products
// router.get("/total-reviews", async (req, res) => {
//   try {
//     const totalReviews = await Reviews.countDocuments({});
//     res.status(200).send({ totalReviews });
//   } catch (error) {
//     console.error("Error fetching total comments:", error);
//     res.status(500).send({ message: "Failed to fetch total reviews" });
//   }
// });

// // Get all reviews posted by a specific user
// router.get("/:userId", async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({ message: "User id is required" });
//   }

//   try {
//     const reviews = await Reviews.find({ userId: userId }).sort({ createdAt: -1 });

//     if (reviews.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No reviews found for this user" });
//     }

//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error("Error fetching reviews by user:", error);
//     res.status(500).json({ message: "Failed to fetch reviews" });
//   }
// });

// module.exports = router;





const express = require("express");
const Reviews = require("./reviews.model");
const Products = require("../products/products.model");
const router = express.Router();

// post a new review or update a existing review
router.post('/post-review', async (req, res) => {
  try {
    const { comment, rating, productId, userId } = req.body;

    if (!comment || rating === undefined || !productId || !userId) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const existingReview = await Reviews.findOne({ productId, userId });

    if (existingReview) {
      existingReview.comment = comment;
      existingReview.rating = rating;
      await existingReview.save();
    } else {
      const newReview = new Reviews({
        comment,
        rating,
        userId,
        productId,
      });
      await newReview.save();
    }

    const reviews = await Reviews.find({ productId });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      const product = await Products.findById(productId);
      if (product) {
        product.rating = averageRating;
        product.numReviews = reviews.length;
        product.reviews = reviews.map(rev => rev._id);
        await product.save({ validateBeforeSave: false });
      } else {
        return res.status(404).send({ message: 'Product not found' });
      }
    }

    res.status(200).send({
      message: 'Review processed successfully', 
      reviews: reviews
    });
  } catch (error) {
    console.error('Error posting review:', error);
    res.status(500).send({ message: 'Failed to post review', error: error.message });
  }
});

// Get total review count across all products
router.get("/total-reviews", async (req, res) => {
  try {
    const totalReviews = await Reviews.countDocuments({});
    res.status(200).send({ totalReviews });
  } catch (error) {
    console.error("Error fetching total comments:", error);
    res.status(500).send({ message: "Failed to fetch total reviews" });
  }
});

// Get all reviews posted by a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId || userId === 'undefined') {
    return res.status(400).json({ message: "Valid User id is required" });
  }

  try {
    // UPDATED: Added path and select for more reliable population
    const reviews = await Reviews.find({ userId: userId })
      .sort({ createdAt: -1 })
    // Aisa likha hona chahiye:
.populate({
  path: 'productId',
  model: 'Product', // 'Product' wahi naam hona chahiye jo Products model mein define hai
  select: 'name image'
})
      .exec();

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this user" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by user:", error);
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
});

module.exports = router;