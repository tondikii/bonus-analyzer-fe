import Swal from "sweetalert2";
import styles from "./styles.module.scss";

export const SwalError = (msg) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: msg,
    customClass: {
      confirmButton: styles.swalButton,
    },
  });
};

export const SwalSuccess = (msg) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: msg,
    customClass: {
      confirmButton: styles.swalButton,
    },
  });
};

export const SwalConfirm = ({ title = "Konfirmasi", text }) =>
  Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
    customClass: {
      confirmButton: styles.swalButton,
      cancelButton: styles.swalButton,
    },
  });

export const SwalToast = ({ icon = "success", title = "" }) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon,
    title,
  });
};
