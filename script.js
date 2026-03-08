if (document.readyState == `loading`) {
  document.addEventListener(`DOMContentLoaded`, ready);
} else {
  ready();
}

function ready() {
  let removeCartItemButtons = document.getElementsByClassName("btn-danger");
  console.log(removeCartItemButtons);
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i];
    button.addEventListener("click", removCartItem);
  }
  let quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  let addToCartButton = document.getElementsByClassName("shop-item-button");
  for (let i = 0; i < addToCartButton.length; i++) {
    let button = addToCartButton[i];
    button.addEventListener("click", addToCartClicked);
  }

  document
    .getElementsByClassName("btn-purchase")[0]
    .addEventListener("click", purchaseClicked);

  loadCart();
}

function purchaseClicked() {
  alert("Thank you for purchase");
  let cartItems = document.getElementsByClassName("cart-items")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
  saveData();
}

function removCartItem(event) {
  let buttonClicked = event.target;
  let confirmReomveItem = confirm("Are you sure you want to remove the item?");
  if (confirmReomveItem) {
    buttonClicked.parentElement.parentElement.remove();
  } else {
    buttonClicked;
  }
  updateCartTotal();
  saveCart();
}

function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    let confirmQuantityCount = confirm(
      "The item quantity is zero, do you want to delete it?"
    );
    if (confirmQuantityCount) {
      input.parentElement.parentElement.remove();
    } else {
      input.value = 1;
    }
  }
  updateCartTotal();
  saveCart();
}

function addToCartClicked(event) {
  let button = event.target;
  let shopItem = button.parentElement.parentElement;
  let title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  let price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  let imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
  console.log(title, price, imageSrc);
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
  saveData();
}

function addItemToCart(title, price, imageSrc) {
  let cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  let cartItems = document.getElementsByClassName("cart-items")[0];
  let cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      let quantityElement = cartItems.getElementsByClassName(
        "cart-quantity-input"
      )[i];
      quantityElement.value = Number(quantityElement.value) + 1;
      return;
    }
  }
  let cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
  saveCart();
}

function updateCartTotal() {
  let cartItemContainer = document.getElementsByClassName("cart-items")[0];
  let cartRows = cartItemContainer.getElementsByClassName("cart-row");
  let total = 0;
  for (let i = 0; i < cartRows.length; i++) {
    let cartRow = cartRows[i];
    let priceElement = cartRow.getElementsByClassName("cart-price")[0];
    let quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    let price = parseFloat(priceElement.innerText.replace("$", ""));
    let quantit = quantityElement.value;
    total = total + price * quantit;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$" + total;
  saveCart();
}

function saveCart() {
  let cartItems = document.getElementsByClassName("cart-items")[0];
  let cartRows = cartItems.getElementsByClassName("cart-row");

  let cart = [];

  for (let i = 0; i < cartRows.length; i++) {
    let cartRow = cartRows[i];

    let title = cartRow.getElementsByClassName("cart-item-title")[0].innerText;
    let price = cartRow.getElementsByClassName("cart-price")[0].innerText;
    let imageSrc = cartRow.getElementsByClassName("cart-item-image")[0].src;
    let quantity = cartRow.getElementsByClassName("cart-quantity-input")[0]
      .value;

    cart.push({
      title: title,
      price: price,
      image: imageSrc,
      quantity: quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart"));

  if (!cart) return;

  for (let i = 0; i < cart.length; i++) {
    addItemToCart(cart[i].title, cart[i].price, cart[i].image);

    let cartItems = document.getElementsByClassName("cart-items")[0];
    let cartRows = cartItems.getElementsByClassName("cart-row");
    let lastRow = cartRows[cartRows.length - 1];

    lastRow.getElementsByClassName("cart-quantity-input")[0].value =
      cart[i].quantity;
  }

  updateCartTotal();
}
