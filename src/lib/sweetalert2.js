import Swal from "sweetalert2";

export const SwalError = (msg) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: msg,
  });
};

export const SwalSuccess = (msg) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: msg,
  });
};
