// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
    
//     //  1. Yeh field add karein
//     stock: { type: Number, default: 0 }, 

//     oldPrice: { type: Number },
    
//     // Multiple images ke liye array
//     image: [{ type: String, required: true }], 

//     // Ab color aik string nahi, balki multiple colors ki list (Array) hai
//     color: [{ type: String }],

//     // Naya Field: Sizes ke liye array
//     size: [{ type: String }],

//     rating: { type: Number, default: 0 },
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
//   },
//   { timestamps: true }
// );

// const Products = mongoose.model("Product", ProductSchema);

// module.exports = Products;


const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // Sub-category (jackets, pants)
    
    // ✅ YEH FIELD MISSING THI - ISAY ADD KAREIN
    mainCategory: { type: String, required: true }, // Men, Women, Kids
    
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 }, 
    oldPrice: { type: Number },
    image: [{ type: String, required: true }], 
    color: [{ type: String }],
    size: [{ type: String }],
    rating: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;