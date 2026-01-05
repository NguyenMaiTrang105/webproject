let cartQuantity =
  parseInt(JSON.parse(localStorage.getItem("cartQuantity"))) || 0;

function updateCartQuantity(inputElement) {
  const value = parseInt(inputElement);
  if (cartQuantity + value > 10) {
    alert("The cart is full");
  } else if (cartQuantity + value < 0) {
    alert("Not enough items in the cart");
  } else {
    cartQuantity += value;
    localStorage.setItem("cartQuantity", cartQuantity);
    displayCartQuantity();
  }
}
function displayCartQuantity() {
  const quantityElement = document.querySelector(".js-cartQuantity");
  if (quantityElement) {
    quantityElement.textContent = cartQuantity;
  }
}
displayCartQuantity();
