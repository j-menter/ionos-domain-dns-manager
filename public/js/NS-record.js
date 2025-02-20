/* eslint-disable no-undef -- used to load links of dns table*/
document.addEventListener("DOMContentLoaded", function () {
  const hostnameInput = document.getElementById('hostname');
  const ttlSelect = document.getElementById('ttl');
  const destinationInput = document.getElementById('destination');
  const previewRecord = document.getElementById('previewRecord');

  function updatePreview() {
    const domain = document.querySelector('[data-domain]').dataset.domain;
    const hostname = hostnameInput.value.trim();
    const destination = destinationInput.value.trim() || '""';
    const ttl = ttlSelect.value;

    if (hostname) {
      previewRecord.textContent = `${hostname}.${domain} ${ttl} IN NS ${destination}`;
    } else {
      previewRecord.textContent = `${domain} ${ttl} IN NS ${destination}`;
    }
  }

  hostnameInput.addEventListener('input', updatePreview);
  ttlSelect.addEventListener('change', updatePreview);
  destinationInput.addEventListener('input', updatePreview);

  document.querySelector('.btn-secondary').addEventListener('click', function(e) {
    e.preventDefault();
    window.history.back();
  });

  updatePreview();
});