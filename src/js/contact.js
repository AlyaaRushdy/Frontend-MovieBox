import Swal from "sweetalert2";
import { sendForm, init } from "@emailjs/browser";
import "../../node_modules/@popperjs/core/dist/umd/popper";
import "bootstrap";

init({
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
        sendForm("service_8s8wmll", "template_i52j67k", this).then(
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
