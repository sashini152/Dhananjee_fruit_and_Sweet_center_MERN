const stripe = require('../../config/stripe');
const userModel = require('../../models/userModel');
const orderModel = require('../../models/orderProductModel'); // Assuming you have this model for saving orders

const paymentController = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const user = await userModel.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({ error: "User not found", success: false });
        }

        // Create the Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            submit_type: 'pay',
            mode: "payment",
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            customer_email: user.email,
            metadata: {
                userId: req.userId
            },
            line_items: cartItems.map(item => ({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.productId.productName,
                        images: item.productId.productImage,
                        metadata: {
                            productId: item.productId._id
                        }
                    },
                    unit_amount: item.productId.sellingPrice * 100
                },
                adjustable_quantity: { enabled: true, minimum: 1 },
                quantity: item.quantity
            })),
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        // Prepare the order details to be saved in MongoDB after payment success
        const orderDetails = {
            productDetails: cartItems.map(item => ({
                name: item.productId.productName,
                quantity: item.quantity,
                price: item.productId.sellingPrice * item.quantity,
            })),
            email: user.email,
            userId: req.userId,
            paymentDetails: {
                paymentId: session.id, // Stripe session ID as payment ID
                payment_method_type: session.payment_method_types,
                payment_status: "pending", // Initial status, will be updated after payment success
            },
            shipping_options: [], // You can adjust this if you need shipping details
            totalAmount: cartItems.reduce((total, item) => total + (item.productId.sellingPrice * item.quantity), 0),
        };

        // Save the order to MongoDB with the initial payment status set to "pending"
        const order = new orderModel(orderDetails);

        console.log("________orderMode",order)
        await order.save();

        // Respond with the session ID to redirect to Stripe for payment
        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Stripe Payment Error:", error.message);
        res.status(500).json({
            message: error?.message || "Payment session creation failed",
            success: false
        });
    }
};

module.exports = paymentController;
