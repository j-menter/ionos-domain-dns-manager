/* eslint-disable no-undef -- used for history back btns in dns views */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("userDropdown").addEventListener("click", function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  });
});
