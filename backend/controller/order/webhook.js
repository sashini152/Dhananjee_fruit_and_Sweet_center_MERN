const stripe = require('../../config/stripe');

const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

const getLineItems = async (lineItemsResponse) => {
    const lineItems = lineItemsResponse.data;
    return lineItems.map(item => ({
        name: item.description,
        quantity: item.quantity,
        price: item.amount_total / 100,  // Convert to dollars
    }));
};

const webhooks = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`🔔 Received Stripe Event: ${event.type}`);

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log("Webhook triggered - Payment Successful");

            // Log session data for debugging
            console.log("Session Data:", session);

            // Ensure `session.shipping_details` is handled correctly
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            const productDetails = await getLineItems(lineItems);

            // Ensure payment was successful before saving order
            if (session.payment_status === 'paid') {
                const orderDetails = {
                    productDetails,
                    email: session.customer_details?.email || "No email", // Optional chaining
                    userId: session.metadata?.userId || "No userId", // Optional chaining
                    paymentDetails: {
                        paymentId: session.payment_intent,
                        payment_method_type: session.payment_method_types,
                        payment_status: session.payment_status,
                    },
                    shipping_options: session.shipping_options || [], // Default to empty array if missing
                    shipping_details: session.shipping_details || {}, // Default to empty object if missing
                    totalAmount: session.amount_total / 100,  // Convert amount to dollars
                };

                // Log order details to confirm the structure
                console.log('Order Details:', orderDetails);

                // Save order to MongoDB if payment is successful
                const order = new orderModel(orderDetails);
                await order.save();
                console.log('✅ Order saved successfully:', order);
            } else {
                console.log('⚠️ Payment not successful. Order not saved.');
                return res.status(400).send('Payment not successful. Order not saved.');
            }
        }
    } catch (err) {
        console.error('❌ Error processing webhook event:', err);
        return res.status(500).send('Internal Server Error');
    }

    // Respond to Stripe that the event was received successfully
    res.sendStatus(200); // This tells Stripe we have processed the event
};

module.exports = webhooks;
