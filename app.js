const body = document.querySelector("body");
const screenModeButton = document.querySelectorAll('input[type="radio"]');

screenModeButton.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("dark-mode")) {
      body.classList.add("theme-dark");
    } else {
      body.classList.remove("theme-dark");
    }
  });
});
