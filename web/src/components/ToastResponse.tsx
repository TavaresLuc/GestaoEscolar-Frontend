"use client";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function showToast(message: string, type: "success" | "error") {
  toast(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    type: type,
    transition: Bounce,
  });
}

export default function ToastNotification() {
  return <ToastContainer />;
}
