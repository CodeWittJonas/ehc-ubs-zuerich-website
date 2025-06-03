// Simple form validation and feedback
(() => {
    'use strict';

    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Form is valid - here you can implement form submission logic (e.g., AJAX or Netlify forms)

        alert('Thank you for contacting EHC UBS Zurich! We will get back to you soon.');

        form.reset();
        form.classList.remove('was-validated');
    });
})();
