// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     category: { type: String, required: true }, // Sub-category (jackets, pants)
    
//     // ✅ YEH FIELD MISSING THI - ISAY ADD KAREIN
//     mainCategory: { type: String, required: true }, // Men, Women, Kids
    
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     stock: { type: Number, default: 0 }, 
//     oldPrice: { type: Number },
//     image: [{ type: String, required: true }], 
//     color: [{ type: String }],
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
    
    // ✅ Main Category (Men, Women, Kids)
    mainCategory: { type: String, required: true }, 
    
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 }, 
    oldPrice: { type: Number },
    image: [{ type: String, required: true }], 
    color: [{ type: String }],
    size: [{ type: String }],
    
    // ⭐ Ratings & Reviews logic
    rating: { type: Number, default: 0 }, // Average rating (e.g., 4.5)
    
    // ✅ Yeh field zaroori thi reviews count ke liye
    reviews: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Review' 
      }
    ],
    
    // ✅ Direct count store karne ke liye (Fast performance)
    numReviews: { type: Number, default: 0 },

    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  { timestamps: true }
);

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;