import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import "./Toast.css";

function Toast() {
  const { toast } = useCart();

  return (
    <div className={`toast-notification ${toast.visible ? "show" : ""}`}>
      {toast.message}
    </div>
  );
}

export default Toast;
