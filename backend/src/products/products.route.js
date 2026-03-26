// const express = require("express");
// const Products = require("./products.model");
// const Reviews = require("../reviews/reviews.model");
// const router = express.Router();


// // =============================
// // Create Product
// // =============================
// router.post("/create-product", async (req, res) => {
//   try {

//     const newProduct = new Products({
//       ...req.body
//     });

//     const savedProduct = await newProduct.save();

//     const reviews = await Reviews.find({ productId: savedProduct._id });

//     if (reviews.length > 0) {
//       const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
//       const averageRating = totalRating / reviews.length;

//       savedProduct.rating = averageRating;
//       await savedProduct.save();
//     }

//     res.status(201).json(savedProduct);

//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ message: "Failed to create product" });
//   }
// });


// // =============================
// // Get All Products
// // =============================
// router.get("/", async (req, res) => {
//   try {

//     const { category, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

//     const filter = {};

//     if (category && category !== "all") {
//       filter.category = category;
//     }

//     if (color && color !== "all") {
//       filter.color = color;
//     }

//     if (minPrice && maxPrice) {

//       const min = parseFloat(minPrice);
//       const max = parseFloat(maxPrice);

//       if (!isNaN(min) && !isNaN(max)) {
//         filter.price = { $gte: min, $lte: max };
//       }

//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const totalProducts = await Products.countDocuments(filter);
//     const totalPages = Math.ceil(totalProducts / limit);

//     const products = await Products.find(filter)
//       .skip(skip)
//       .limit(parseInt(limit))
//       .populate("author", "email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       products,
//       totalPages,
//       totalProducts
//     });

//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).send({ message: "Failed to fetch products" });
//   }
// });


// // =============================
// // Get Single Product
// // =============================
// router.get("/:id", async (req, res) => {
//   try {

//     const productId = req.params.id;

//     if (!productId || productId === "undefined") {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }

//     const product = await Products.findById(productId)
//       .populate("author", "email username");

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const reviews = await Reviews.find({ productId })
//       .populate("userId", "username email");

//     res.status(200).json({
//       product,
//       reviews
//     });

//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).send({ message: "Failed to fetch product" });
//   }
// });


// // =============================
// // Update Product
// // =============================
// router.patch("/update-product/:id", async (req, res) => {
//   try {

//     const productId = req.params.id;

//     if (!productId) {
//       return res.status(400).json({ message: "Product ID required" });
//     }

//     const updatedProduct = await Products.findByIdAndUpdate(
//       productId,
//       { ...req.body },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).send({ message: "Product not found" });
//     }

//     res.status(200).json({
//       message: "Product updated successfully",
//       product: updatedProduct
//     });

//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).send({ message: "Failed to update product" });
//   }
// });


// // =============================
// // Delete Product
// // =============================
// router.delete("/:id", async (req, res) => {
//   try {

//     const productId = req.params.id;

//     if (!productId) {
//       return res.status(400).json({ message: "Product ID required" });
//     }

//     const deletedProduct = await Products.findByIdAndDelete(productId);

//     if (!deletedProduct) {
//       return res.status(404).send({ message: "Product not found" });
//     }

//     await Reviews.deleteMany({ productId });

//     res.status(200).json({
//       message: "Product and related reviews deleted"
//     });

//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).send({ message: "Failed to delete product" });
//   }
// });


// // =============================
// // Related Products
// // =============================
// router.get("/related/:id", async (req, res) => {
//   try {

//     const { id } = req.params;

//     if (!id || id === "undefined") {
//       return res.status(400).json({ message: "Invalid product ID" });
//     }

//     const product = await Products.findById(id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const titleRegex = new RegExp(
//       product.name
//         .split(" ")
//         .filter(word => word.length > 1)
//         .join("|"),
//       "i"
//     );

//     const relatedProducts = await Products.find({
//       _id: { $ne: id },
//       $or: [
//         { name: { $regex: titleRegex } },
//         { category: product.category }
//       ]
//     });

//     res.status(200).json(relatedProducts);

//   } catch (error) {
//     console.error("Error fetching related products:", error);
//     res.status(500).send({ message: "Failed to fetch related products" });
//   }
// });


// module.exports = router;



const express = require("express");
const Products = require("./products.model");
const Reviews = require("../reviews/reviews.model");
const router = express.Router();


// =============================
// Create Product
// =============================
router.post("/create-product", async (req, res) => {
  try {

    const newProduct = new Products({
      ...req.body
    });

    const savedProduct = await newProduct.save();

    const reviews = await Reviews.find({ productId: savedProduct._id });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      savedProduct.rating = averageRating;
      await savedProduct.save();
    }

    res.status(201).json(savedProduct);

  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
});


// =============================
// Get All Products (FIXED & OPTIMIZED)
// =============================
router.get("/", async (req, res) => {
  try {
    const { category, mainCategory, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const filter = {};

    // 1. Sub-category filter
    if (category && category !== "all" && category !== "") {
      filter.category = category;
    }

    // 2. mainCategory filter
    if (mainCategory && mainCategory !== "all" && mainCategory !== "") {
      filter.mainCategory = mainCategory;
    }

    // 3. Color filter
    if (color && color !== "all" && color !== "") {
      filter.color = color;
    }

    // 4. Price Filter Logic (Flexible Version)
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice && minPrice !== "") {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) filter.price.$gte = min;
      }
      if (maxPrice && maxPrice !== "" && maxPrice !== "Infinity") {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) filter.price.$lte = max;
      }
      
      // Agar price object khali reh gaya ho to delete kar dein
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Database Queries
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    const products = await Products.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      products,
      totalPages,
      totalProducts
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ message: "Failed to fetch products" });
  }
});

// =============================
// Get Single Product
// =============================
router.get("/:id", async (req, res) => {
  try {

    const productId = req.params.id;

    if (!productId || productId === "undefined") {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Products.findById(productId)
      .populate("author", "email username");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = await Reviews.find({ productId })
      .populate("userId", "username email");

    res.status(200).json({
      product,
      reviews
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({ message: "Failed to fetch product" });
  }
});


// =============================
// Update Product
// =============================
router.patch("/update-product/:id", async (req, res) => {
  try {

    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      { ...req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ message: "Failed to update product" });
  }
});


// =============================
// Delete Product
// =============================
router.delete("/:id", async (req, res) => {
  try {

    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const deletedProduct = await Products.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    await Reviews.deleteMany({ productId });

    res.status(200).json({
      message: "Product and related reviews deleted"
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Failed to delete product" });
  }
});


// =============================
// Related Products
// =============================
router.get("/related/:id", async (req, res) => {
  try {

    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const titleRegex = new RegExp(
      product.name
        .split(" ")
        .filter(word => word.length > 1)
        .join("|"),
      "i"
    );

    const relatedProducts = await Products.find({
      _id: { $ne: id },
      $or: [
        { name: { $regex: titleRegex } },
        { category: product.category }
      ]
    });

    res.status(200).json(relatedProducts);

  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).send({ message: "Failed to fetch related products" });
  }
});


module.exports = router;