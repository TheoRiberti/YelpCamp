// JS FOR THE BTSTRAP FOR VALIDATION BELOW (used by new.ejs and edit.ejs)

//Copied from btstrp website, just replace a couple of things to a more modern syntax

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".validated-form");

  //// Loop over them and prevent submission
  //Array.from turns it into an array
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
