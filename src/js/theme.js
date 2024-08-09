//* change color mode
const colorSchemeToggler = document.querySelector("#color-scheme-toggler");
const theme = window.localStorage.getItem("theme");

if (theme == "light") {
  document.documentElement.classList.remove("dark");
} else {
  document.documentElement.classList.add("dark");
}

colorSchemeToggler.addEventListener("click", function () {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    colorSchemeToggler.childNodes[1].classList.remove("fa-sun");
    colorSchemeToggler.childNodes[1].classList.add("fa-moon");
    window.localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    colorSchemeToggler.childNodes[1].classList.remove("fa-moon");
    colorSchemeToggler.childNodes[1].classList.add("fa-sun");
    window.localStorage.setItem("theme", "dark");
  }
});
