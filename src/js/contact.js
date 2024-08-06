emailjs.init({
  publicKey: "KzBHA4lsho3ngb2vi",
});

const nameInput = document.querySelector("#conatctSenderName");
const mailInput = document.querySelector("#conatctSenderEmail");
const messageInput = document.querySelector("#contactSenderMessage");

window.onload = function () {
  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      if (nameInput.value && mailInput.value && messageInput.value) {
        emailjs.sendForm("service_8s8wmll", "template_i52j67k", this).then(
          () => {
            Swal.fire({
              title: "Success",
              text: "Your message was sent successfully",
              icon: "success",
            });
            nameInput.value = "";
            mailInput.value = "";
            messageInput.value = "";
          },
          (error) => {
            console.log("FAILED...", error);
            Swal.fire({
              title: "Error!",
              text: "There was an error, please try again later",
              icon: "error",
            });
          }
        );
      } else {
        Swal.fire({
          title: "Error!",
          text: "all fields must be filled",
          icon: "error",
        });
      }
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
