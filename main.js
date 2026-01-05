document.querySelectorAll(".detail-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const popup = this.nextElementSibling;
    popup.classList.toggle("active");
  });
});
document.querySelectorAll(".close").forEach((close) => {
  close.addEventListener("click", function () {
    this.parentElement.classList.remove("active");
  });
});
