// const express = require('express');
// const router = express.Router();
// const User = require('./user.model');
// const generateToken = require('../middleware/generateToken');
// const verifyToken = require('../middleware/verifyToken');
// const nodemailer = require('nodemailer');
// const axios = require('axios'); 
// require('dotenv').config()

// // ✅ Register endpoint
// router.post('/register', async (req, res) => {
//     try {
//         const { email, password, username } = req.body;
//         const user = new User({ email, password, username });
//         await user.save();
//         res.status(201).send({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error('Error registering user:', error);
//         if (error.code === 11000) {
//             return res.status(400).send({ message: 'Email is already registered. Please use a different email or log in.' });
//         }
//         res.status(500).send({ message: 'Registration failed' });
//     }
// });

// // ✅ Login endpoint
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }
//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//             return res.status(401).send({ message: 'Invalid credentials' });
//         }
//         const token = await generateToken(user._id);
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: true, 
//             sameSite: 'None'
//         });
//         res.status(200).send({
//             message: 'Logged in successfully',
//             token,
//             user: {
//                 _id: user._id,
//                 email: user.email,
//                 username: user.username,
//                 role: user.role,
//                 profileImage: user.profileImage,
//                 bio: user.bio,
//                 profession: user.profession,
//             }
//         });
//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).send({ message: 'Login failed' });
//     }
// });

// // ✅ Google Login
// router.post('/google-login', async (req, res) => {
//     try {
//         const { email, username, profileImage } = req.body;
//         let user = await User.findOne({ email });
//         if (!user) {
//             user = new User({
//                 email,
//                 username,
//                 profileImage,
//                 password: Math.random().toString(36).slice(-8), 
//                 role: 'user'
//             });
//             await user.save();
//         }
//         const token = await generateToken(user._id);
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'None'
//         });
//         res.status(200).send({
//             message: 'Logged in successfully with Google',
//             token,
//             user: {
//                 _id: user._id,
//                 email: user.email,
//                 username: user.username,
//                 role: user.role,
//                 profileImage: user.profileImage
//             }
//         });
//     } catch (error) {
//         console.error('Error with Google Login:', error);
//         res.status(500).send({ message: 'Google login failed' });
//     }
// });

// // ✅ All users & Admin logic
// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({}, 'id email role').sort({ createdAt: -1 });
//         res.status(200).send(users);
//     } catch (error) {
//         res.status(500).send({ message: 'Failed to fetch users' });
//     }
// });

// router.delete('/users/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         await User.findByIdAndDelete(id);
//         res.status(200).send({ message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).send({ message: 'Failed to delete user' });
//     }
// });

// // ✅ Edit Profile
// router.patch('/edit-profile', async (req, res) => {
//     try {
//         const { userId, username, profileImage, bio, profession } = req.body;
//         const user = await User.findById(userId);
//         if (!user) return res.status(404).send({ message: 'User not found' });

//         if (username !== undefined) user.username = username;
//         if (profileImage !== undefined) user.profileImage = profileImage;
//         if (bio !== undefined) user.bio = bio;
//         if (profession !== undefined) user.profession = profession;

//         await user.save();
//         res.status(200).send({ message: 'Profile updated successfully', user });
//     } catch (error) {
//         res.status(500).send({ message: 'Profile update failed' });
//     }
// });

// // ✅ BRANDED PROMOTIONAL EMAIL ROUTE
// router.post('/send-promo-email', async (req, res) => {
//     const { subject, message } = req.body;
//     try {
//         const users = await User.find({}, 'email');
//         if (users.length === 0) return res.status(404).send({ message: "No users found" });
//         const emailList = users.map(u => u.email).join(', ');

//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS
//             }
//         });

//         const mailOptions = {
//             from: `"Lebaba Official" <${process.env.EMAIL_USER}>`,
//             bcc: emailList,
//             subject: subject,
//             html: `<div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
//                 <div style="background: #000; padding: 20px; text-align: center;"><h1 style="color: #fff; margin:0; letter-spacing:5px;">LEBABA</h1></div>
//                 <div style="padding: 40px 20px; text-align: center;">
//                     <h2>${subject}</h2>
//                     <p>${message}</p>
//                     <a href="http://localhost:5173/shop" style="display:inline-block; padding:15px 30px; background:#d90429; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">SHOP NOW</a>
//                 </div>
//             </div>`
//         };

//         await transporter.sendMail(mailOptions);
//         res.status(200).send({ message: "Promotional emails sent successfully!" });
//     } catch (error) {
//         res.status(500).send({ message: 'Email sending failed' });
//     }
// });

// // ✅ VOICE AI ASSISTANT ROUTE (FIXED LOGS & API KEY)
// router.post('/voice-ai', async (req, res) => {
//     const { command } = req.body;
    
//     // 🎤 Terminal Log taake pata chalay request backend tak aayi
//     console.log("🎤 Voice Command Received in Backend:", command);

//     try {
//         const response = await axios.post(
//             "https://api.groq.com/openai/v1/chat/completions",
//             {
//                 model: "llama-3.3-70b-versatile",
//                 messages: [
//                     {
//                         role: "system",
//           content: `You are a strictly precise URL router for 'Lebaba Store'.

// MAPPING RULES:
// 1. If user says "home" or "main page", return ONLY: /
// 2. If user says "men" or "men collection", return: /shop?mainCategory=men
// 3. If user says "women" or "women collection", return: /shop?mainCategory=women
// 4. If user says "kids" or "kids collection", return: /shop?mainCategory=kids
// 5. If user says "shop" or "all products" or "collection", return: /shop
// 6. If user says "contact" , return: /contact
// 7. If user says "dashboard" or "open my dashboard", return: /dashboard
// 8. If user says "orders" or "my orders", return: /dashboard/orders
// 9. If user says "profile" or "my profile", return: /dashboard/profile
// 10. If user says "payment support" or "support", return: /dashboard/payment-support
// 11. If user says "reviews" or "my reviews", return: /dashboard/reviews

// STRICT RULES:
// - Return ONLY the raw path string. 
// - For Home, never return "/home", always return "/".
// - Do not include quotes or explanations.`
//                     },
//                     { role: "user", content: command }
//                 ],
//                 temperature: 0
//             },
//             {
//                 headers: {
//                     // ✅ FIXED: Using GROQ_API_KEY from backend .env
//                     Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         const targetPath = response.data.choices[0].message.content.trim().replace(/['"`. ]/g, "");
//         console.log("🎯 AI Decided Path:", targetPath);
        
//         res.status(200).json({ path: targetPath });

//     } catch (error) {
//         console.error("❌ Voice AI Error:", error.response ? error.response.data : error.message);
//         res.status(500).json({ path: '/shop', message: "AI Assistant Error" });
//     }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const User = require('./user.model');
const generateToken = require('../middleware/generateToken');
const verifyToken = require('../middleware/verifyToken');
const nodemailer = require('nodemailer');
const axios = require('axios'); 
require('dotenv').config()

// ✅ Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, password, username });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.code === 11000) {
            return res.status(400).send({ message: 'Email is already registered.' });
        }
        res.status(500).send({ message: 'Registration failed' });
    }
});

// ✅ Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).send({ message: 'Invalid credentials' });

        const token = await generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
        res.status(200).send({
            message: 'Logged in successfully',
            token,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
            }
        });
    } catch (error) {
        res.status(500).send({ message: 'Login failed' });
    }
});

// ✅ Google Login
router.post('/google-login', async (req, res) => {
    try {
        const { email, username, profileImage } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email, username, profileImage,
                password: Math.random().toString(36).slice(-8), 
                role: 'user'
            });
            await user.save();
        }
        const token = await generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
        res.status(200).send({
            message: 'Logged in successfully with Google',
            token,
            user: { _id: user._id, email: user.email, username: user.username, role: user.role, profileImage: user.profileImage }
        });
    } catch (error) {
        res.status(500).send({ message: 'Google login failed' });
    }
});

// ✅ All users & Admin logic
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role').sort({ createdAt: -1 });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch users' });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete user' });
    }
});

// ✅ Edit Profile
router.patch('/edit-profile', async (req, res) => {
    try {
        const { userId, username, profileImage, bio, profession } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).send({ message: 'User not found' });

        if (username !== undefined) user.username = username;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (bio !== undefined) user.bio = bio;
        if (profession !== undefined) user.profession = profession;

        await user.save();
        res.status(200).send({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).send({ message: 'Profile update failed' });
    }
});

// ✅ BRANDED PROMOTIONAL EMAIL ROUTE
router.post('/send-promo-email', async (req, res) => {
    const { subject, message } = req.body;
    try {
        const users = await User.find({}, 'email');
        if (users.length === 0) return res.status(404).send({ message: "No users found" });
        const emailList = users.map(u => u.email).join(', ');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const mailOptions = {
            from: `"Lebaba Official" <${process.env.EMAIL_USER}>`,
            bcc: emailList,
            subject: subject,
            html: `<div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background: #000; padding: 20px; text-align: center;"><h1 style="color: #fff; margin:0; letter-spacing:5px;">LEBABA</h1></div>
                <div style="padding: 40px 20px; text-align: center;">
                    <h2>${subject}</h2>
                    <p>${message}</p>
                    <a href="http://localhost:5173/shop" style="display:inline-block; padding:15px 30px; background:#d90429; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">SHOP NOW</a>
                </div>
            </div>`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: "Promotional emails sent successfully!" });
    } catch (error) {
        res.status(500).send({ message: 'Email sending failed' });
    }
});

// ✅ VOICE AI ASSISTANT ROUTE (STRICT & CLEAN)
router.post('/voice-ai', async (req, res) => {
    const { command } = req.body;
    console.log("🎤 Voice Command Received:", command);

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                                 content: `You are a strictly precise URL router for 'Lebaba Store'.

MAPPING RULES:
1. If user says "home" or "main page", return ONLY: /
2. If user says "men" or "men collection", return: /shop?mainCategory=men
3. If user says "women" or "women collection", return: /shop?mainCategory=women
4. If user says "kids" or "kids collection", return: /shop?mainCategory=kids
5. If user says "shop" or "all products" or "collection", return: /shop
6. If user says "contact" , return: /contact
7. If user says "dashboard" or "open my dashboard", return: /dashboard
8. If user says "orders" or "my orders", return: /dashboard/orders
9. If user says "profile" or "my profile", return: /dashboard/profile
10. If user says "payment support" or "support", return: /dashboard/payment-support
11. If user says "reviews" or "my reviews", return: /dashboard/reviews
12. If user says "cart" or "my shopping cart", return: /cart

STRICT RULES:
- Return ONLY the raw path string. 
- For Home, never return "/home", always return "/".
- Do not include quotes or explanations.`
                    },
                    { role: "user", content: command }
                ],
                temperature: 0
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const targetPath = response.data.choices[0].message.content.trim().replace(/['"`. ]/g, "");
        console.log("🎯 AI Decided Path:", targetPath);
        res.status(200).json({ path: targetPath });

    } catch (error) {
        console.error("❌ Voice AI Error:", error.response ? error.response.data : error.message);
        res.status(200).json({ path: '/shop', message: "Rate limit or AI Error" });
    }
});

module.exports = router;