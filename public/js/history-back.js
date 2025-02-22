/* eslint-disable no-undef -- used for history back btns in dns views */
document.addEventListener("DOMContentLoaded", function () {
  const cancelBtn = document.querySelector(".btn.btn-secondary");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.history.back();
    });
  }
});
