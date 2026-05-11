import nodemailer from 'nodemailer';
import User from './user.model.js'; // Check karein path sahi hai

export const sendPromoEmail = async (req, res) => {
    const { subject, message } = req.body;

    try {
        const users = await User.find({}, 'email');
        const emailList = users.map(u => u.email).join(', ');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Lebaba Promo" <${process.env.EMAIL_USER}>`,
            bcc: emailList, 
            subject: subject,
            html: `
                <div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background: #000; padding: 20px; text-align: center;">
                        <h1 style="color: #fff; margin: 0; letter-spacing: 2px;">LEBABA</h1>
                    </div>
                    <div style="padding: 30px; text-align: center;">
                        <h2 style="color: #333;">Special Update For You!</h2>
                        <p style="color: #666; line-height: 1.6;">${message}</p>
                        <a href="http://localhost:5173/shop" style="display: inline-block; margin-top: 20px; padding: 12px 25px; background: #d90429; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">SHOP NOW</a>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Emails sent!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};