emailjs.init({
  publicKey: "KzBHA4lsho3ngb2vi",
});

window.onload = function () {
  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      // these IDs from the previous steps
      emailjs.sendForm("service_8s8wmll", "template_i52j67k", this).then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
    });
};

//* change color mode
const colorSchemeToggler = document.querySelector("#color-scheme-toggler");
colorSchemeToggler.addEventListener("click", function () {
  console.log("clicked!");
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    colorSchemeToggler.childNodes[1].classList.remove("fa-sun");
    colorSchemeToggler.childNodes[1].classList.add("fa-moon");
  } else {
    document.documentElement.classList.add("dark");
    colorSchemeToggler.childNodes[1].classList.remove("fa-moon");
    colorSchemeToggler.childNodes[1].classList.add("fa-sun");
  }
});
