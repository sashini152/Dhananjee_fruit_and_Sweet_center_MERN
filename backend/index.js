const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const app = express();
const router = require('./routes');

// ✅ Raw body for Stripe webhooks (must come BEFORE express.json)
app.post('/api/webhook', express.raw({ type: 'application/json' }), require('./controller/order/webhook'));


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json()); // ✅ Safe now because /webhook is already defined
app.use(cookieParser());

// Routes
app.use("/api", router);

// Port
const PORT = process.env.PORT || 8080;

//initial commit shashini
// dev branch created
//my new changes AV new
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("✅ Connected to DB");
        console.log("🚀 Server is running on port " + PORT);
    });
}).catch(err => {
    console.error("❌ Error connecting to DB:", err);
});
