const orderModel = require("../../models/orderProductModel");

const orderController = async (request, response) => {
    try {
        const currentUserId = request.userId; // Fixed typo
        if (!currentUserId) {
            return response.status(401).json({ message: "Unauthorized access", error: true });
        }

        const orderList = await orderModel.find({ userId: currentUserId });

        response.json({
            data: orderList,
            message: "Order List",
            success: true
        });

    } catch (err) {
        response.status(500).json({
            message: err.message || "Server Error",
            error: true
        });
    }
};

module.exports = orderController;
