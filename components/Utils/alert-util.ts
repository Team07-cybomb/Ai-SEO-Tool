import Swal, { SweetAlertIcon } from "sweetalert2";

// 🎨 Base function (pastel theme)
const showAlert = (
  title: string,
  message: string,
  icon: SweetAlertIcon = "info",
  options: any = {}
) => {
  return Swal.fire({
    title,
    html: `<p style="font-size:16px; color:#333;">${message}</p>`,
    icon,
    confirmButtonText: "OK",
    confirmButtonColor: "#6c63ff",
    background: "#fdf6f0", // pastel background
    customClass: {
      popup: "rounded-2xl shadow-lg",
      title: "text-lg font-bold text-gray-800",
      confirmButton: "px-4 py-2 rounded-lg",
    },
    ...options, // allow overrides
  });
};

// 🟢 Success → Toast Style (auto close, top-end)
export const showSuccessAlert = (message: string) =>
  showAlert("✅ Success", message, "success", {
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

// 🔴 Error
export const showErrorAlert = (message: string) =>
  showAlert("❌ Error", message, "error");

// ⚠️ Warning
export const showWarningAlert = (message: string) =>
  showAlert("⚠️ Warning", message, "warning");

// 🔵 Info
export const showInfoAlert = (message: string) =>
  showAlert("ℹ️ Info", message, "info");
