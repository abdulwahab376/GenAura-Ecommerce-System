// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');
// const http = require('http'); // ✅ Required for Socket.io
// const { Server } = require('socket.io'); // ✅ Required for Socket.io
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000;

// // --- Socket.io Setup ---
// const server = http.createServer(app); // Create HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     credentials: true,
//   }
// });

// // ✅ Pass 'io' to all routes (Required for your notification system)
// app.set('socketio', io);

// // Import Utils & Routes
// const uploadImage = require("./src/utils/uploadImage");
// const authRoutes = require('./src/users/user.route');
// const productRoutes = require('./src/products/products.route');
// const orderRoutes = require('./src/orders/orders.route');
// const reviewRoutes = require('./src/reviews/reviews.router');
// const statsRoutes = require('./src/stats/stats.route');
// const chatRoutes = require('./src/chats/chats.route');

// // --- Middleware Setup ---
// app.use(cors({ 
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));

// app.use(express.json({ limit: "25mb" }));
// app.use(express.urlencoded({ limit: "25mb", extended: true })); 
// app.use(cookieParser());

// // --- Routes Setup ---
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/stats', statsRoutes);
// app.use('/api/chats', chatRoutes);

// // Root Route
// app.get('/', (req, res) => {
//   res.send('Lebaba Ecommerce Server is Running..!');
// });

// // Upload Image Route
// app.post("/uploadImage", (req, res) => {
//   uploadImage(req.body.image)
//     .then((url) => res.send(url))
//     .catch((err) => res.status(500).send(err));
// });

// // --- Socket Connection Logic ---
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);
  
//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// // --- Database Connection & Server Start ---
// async function main() {
//   if (!process.env.MONGODB_URL) {
//     console.error("ERROR: MONGODB_URL is not defined in your .env file!");
//     process.exit(1);
//   }
  
//   await mongoose.connect(process.env.MONGODB_URL);
//   console.log('Mongodb connected successfully!');
// }

// main().catch(err => console.log("Database connection error:", err));

// // ✅ Use server.listen instead of app.listen
// server.listen(port, () => {
//   console.log(`Server is successfully running on port ${port}`);
// });




const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const http = require('http'); // ✅ Required for Socket.io
const { Server } = require('socket.io'); // ✅ Required for Socket.io
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// --- Socket.io Setup ---
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }
});

// ✅ Pass 'io' to all routes (Required for your notification system)
app.set('socketio', io);

// Import Utils & Routes
const uploadImage = require("./src/utils/uploadImage");
const authRoutes = require('./src/users/user.route');
const productRoutes = require('./src/products/products.route');
const orderRoutes = require('./src/orders/orders.route');
const reviewRoutes = require('./src/reviews/reviews.router');
const statsRoutes = require('./src/stats/stats.route');
const chatRoutes = require('./src/chats/chats.route');
// 🚀 Naya Bundle Route Import
const bundleRoutes = require('./src/bundles/bundle.route'); 

// --- Middleware Setup ---
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true })); 
app.use(cookieParser());

// --- Routes Setup ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/chats', chatRoutes);
// ✅ Register Bundle Route
app.use('/api/bundles', bundleRoutes); 

// Root Route
app.get('/', (req, res) => {
  res.send('Lebaba Ecommerce Server is Running..!');
});

// Upload Image Route
app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});

// --- Socket Connection Logic ---
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// --- Database Connection & Server Start ---
async function main() {
  if (!process.env.MONGODB_URL) {
    console.error("ERROR: MONGODB_URL is not defined in your .env file!");
    process.exit(1);
  }
  
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Mongodb connected successfully!');
}

main().catch(err => console.log("Database connection error:", err));

// ✅ Use server.listen instead of app.listen
server.listen(port, () => {
  console.log(`Server is successfully running on port ${port}`);
});