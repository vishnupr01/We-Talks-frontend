import React from 'react';
import Swal from 'sweetalert2';

function showBlockedAlert() {
    Swal.fire({
      title: 'Access Denied',
      text: 'You are blocked ',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  };



export default showBlockedAlert
