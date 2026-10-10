// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Workaround for Bootstrap dropdown toggling on Enter in form inputs
// See: https://github.com/twbs/bootstrap/issues/41354

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    if (
      event.target.tagName === 'INPUT' &&
      event.target.form
    ) {
      // Find all dropdown toggles after the input in the same form
      let dropdowns = Array.from(event.target.form.querySelectorAll('[data-bs-toggle="dropdown"]'));
      let inputIndex = Array.from(event.target.form.elements).indexOf(event.target);
      if (dropdowns.some(btn => Array.from(event.target.form.elements).indexOf(btn) > inputIndex)) {
        event.stopPropagation();
      }
    }
  }
}, true);
