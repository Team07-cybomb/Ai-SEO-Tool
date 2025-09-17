import Swal from 'sweetalert2';

export const showSuccessAlert = (title: string, text: string) => {
  Swal.fire({
    icon: 'success',
    title,
    text,
    showConfirmButton: false,
    timer: 2000,
    toast: true,
    position: 'top-end',
  });
};

export const showErrorAlert = (title: string, text: string) => {
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
  });
};