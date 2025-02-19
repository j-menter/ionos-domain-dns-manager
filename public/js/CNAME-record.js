/* eslint-disable no-undef -- used for history back btns in dns views*/
document.addEventListener("DOMContentLoaded", function () {
const hostnameInput   = document.getElementById('hostname');
  const ttlSelect       = document.getElementById('ttl');
  const destinationInput= document.getElementById('destination');
  const previewRecord   = document.getElementById('previewRecord');
  const cnameForm       = document.getElementById('cnameForm');

  // Regex zur Validierung einer Domain
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

  function updatePreview() {
    const domain = document.querySelector('[data-domain]').dataset.domain;
    const hostname  = hostnameInput.value.trim();
    const destination = destinationInput.value.trim() || '""';
    const ttl       = ttlSelect.value;
    
    if (hostname) {
      previewRecord.textContent = `${hostname}.${domain} ${ttl} IN CNAME ${destination}`;
    } else {
      previewRecord.textContent = `${domain} ${ttl} IN CNAME ${destination}`;
    }
  }

  // Funktion zur Validierung des "destination"-Feldes
  function validateDestination() {
    const value = destinationInput.value.trim();
    if (domainRegex.test(value)) {
      destinationInput.classList.remove('is-invalid');
      destinationInput.classList.add('is-valid');
      return true;
    } else {
      destinationInput.classList.remove('is-valid');
      destinationInput.classList.add('is-invalid');
      return false;
    }
  }

  destinationInput.addEventListener('input', function() {
    validateDestination();
    updatePreview();
  });
  
  hostnameInput.addEventListener('input', updatePreview);
  ttlSelect.addEventListener('change', updatePreview);

  // Formular-Submit: Nur absenden, wenn die Destination gültig ist
  cnameForm.addEventListener('submit', function(e) {
    if (!validateDestination()) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  document.querySelector('.btn-secondary').addEventListener('click', function(e) {
    e.preventDefault();
    window.history.back();
  });

  updatePreview();
});