import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";

const displayINRCurrency = (amount) => `Rs.${parseFloat(amount || 0).toFixed(2)}`;

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(SummaryApi.getOrder.url, {
        method: SummaryApi.getOrder.method.trim(),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Order list:", responseData);

      if (responseData.success) {
        setOrders(responseData.data);
      } else {
        console.error("Error fetching orders:", responseData.message);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <div style={styles.orderContainer}>
      <h2 style={styles.orderTitle}>Your Orders</h2>

      {orders.length === 0 ? (
        <p style={styles.noOrders}>No orders available</p>
      ) : (
        <div style={styles.orderList}>
          {orders.map((item, index) => (
            <div key={item.userId + index} style={styles.orderCard}>
              <p style={styles.orderDate}>{moment(item?.createdAt).format("LL")}</p>

              {item?.productDetails?.map((product, idx) => (
                <div key={product?.productId + idx} style={styles.productContainer}>
                  {/* Left side - Product Image */}
                  <div style={styles.productImageContainer}>
                    <img src={product?.imageUrl} alt={product?.name} style={styles.productImg} />
                  </div>

                  {/* Right side - Product & Payment Details */}
                  <div style={styles.detailsContainer}>
                    <div>
                      <p style={styles.productName}>{product?.name}</p>
                      <p style={styles.productPrice}>{displayINRCurrency(product?.price)}</p>
                      <p style={styles.productQuantity}>Quantity: {product?.quantity || 1}</p>
                    </div>

                    {/* Payment Details on the right */}
                    <div style={styles.paymentDetails}>
                      <h4>Payment Details</h4>
                      <p>Status: {item?.paymentDetails?.Payment_status || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div style={styles.shippingDetails}>
                <h4>Shipping Details</h4>
                {item?.shippingDetails?.map((shipping, idx) => (
                  <p key={shipping?.shipping_rate + idx}>
                    Shipping Amount: {displayINRCurrency(shipping?.shipping_amount)}
                  </p>
                ))}
              </div>

              <div style={styles.totalAmount}>
                <strong>Total: {displayINRCurrency(item?.totalAmount)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  orderContainer: {
    padding: "20px",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  orderTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  noOrders: {
    textAlign: "center",
    color: "gray",
    fontSize: "16px",
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  orderCard: {
    background: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
  },
  orderDate: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px",
  },
  productContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  productImageContainer: {
    flex: "1",
    display: "flex",
    justifyContent: "center",
  },
  productImg: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  detailsContainer: {
    flex: "2",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  productPrice: {
    color: "#27ae60",
    fontSize: "14px",
  },
  productQuantity: {
    fontSize: "12px",
    color: "#555",
  },
  paymentDetails: {
    textAlign: "right",
    fontSize: "14px",
    color: "#444",
  },
  shippingDetails: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#444",
  },
  totalAmount: {
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#d35400",
  },
};

export default OrderPage;
