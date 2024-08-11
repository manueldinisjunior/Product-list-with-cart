// const dataResponse = await fetch("http://127.0.0.1:5500/data.json"); // for quokka testing
const dataResponse = await fetch("data.json"); // for final live websitedata.json
const data = await dataResponse.json();
const addToCartBtns = document.querySelectorAll(".add-cart-container");
const plusBtns = document.querySelectorAll(".plus");
const minusBtns = document.querySelectorAll(".minus");
const totalItemsInCart = document.querySelector("span[data-total-items");
const cartMessage = document.querySelector(".cart-message");
const orderListDiv = document.querySelector(".order-list-container");
const orderListUl = orderListDiv.querySelector(".order-list");
const orderTotal = document.getElementById("order-total");
const confirmBtn = orderListDiv.querySelector(".confirm-btn");
const orderDialog = document.getElementById("order-confirmation");
const newOrderBtn = orderDialog.querySelector(".confirm-btn");
const confirmOrderUl = document.querySelector(".confirm-order-list");
const orderListObj = {};
for (const obj of data) {
  orderListObj[obj["name"]] = {
    price: obj["price"],
    image: obj["image"],
    category: obj["category"],
    quanity: 0,
    total: 0,
    ele: null,
  };
}

const changeAddCartBtn = (e) => {
  const itemQuantity = parseInt(e.currentTarget.value);

  const card = e.currentTarget.parentElement.parentElement;

  // add item selected border
  const img = card.querySelector("picture");
  img.classList.toggle("selected-item");

  // update order list obj
  const name = card.querySelector(".card-title").textContent.trim();
  orderListObj[name].quanity = 1;
  orderListObj[name].total = orderListObj[name].price;

  // add item to orderList
  const orderListEle = addListItem(name);

  orderListObj[name].ele = orderListEle;

  const AddItemBtn =
    e.currentTarget.parentElement.querySelector(".add-cart-counter");

  e.currentTarget.classList.toggle("hide");

  AddItemBtn.classList.toggle("hide");

  updateItemsInCart(itemQuantity);
  changeCartView(itemQuantity);

  //update order total
  updateOrderTotal(orderListObj[name].price);
};

const updateOrderTotal = (price) => {
  //update order total
  orderTotal.textContent = `$${(
    parseFloat(orderTotal.textContent.slice(1)) + price
  ).toFixed(2)}`;
};

const addListItem = (name) => {
  const orderListUl = document.querySelector(".order-list");

  const liEle = document.createElement("li");
  liEle.classList.add("list-item");
  orderListUl.appendChild(liEle);

  const itemInfoDiv = document.createElement("div");
  itemInfoDiv.classList.add("item-info");
  liEle.appendChild(itemInfoDiv);

  const itemTitleP = document.createElement("p");
  itemTitleP.setAttribute("class", "item-title red-hat-text-600");
  const itemTitleText = document.createTextNode(`${name}`);
  itemTitleP.appendChild(itemTitleText);
  itemInfoDiv.append(itemTitleP);

  const itemPricesDiv = document.createElement("div");
  itemPricesDiv.classList.add("item-prices");
  itemInfoDiv.appendChild(itemPricesDiv);

  const quanityPara = document.createElement("p");
  const quanityParaText = document.createTextNode(
    `${orderListObj[name].quanity}x`
  );
  quanityPara.setAttribute("class", "item-quantity red-hat-text-700");
  quanityPara.appendChild(quanityParaText);

  const pricePara = document.createElement("p");
  const priceParaText = document.createTextNode(
    `@ $${orderListObj[name].price.toFixed(2)}`
  );
  pricePara.setAttribute("class", "item-price red-hat-text-600");
  pricePara.appendChild(priceParaText);

  const totalPricePara = document.createElement("p");
  const totalPriceParaText = document.createTextNode(
    `$${orderListObj[name].total.toFixed(2)}`
  );
  totalPricePara.setAttribute("class", "item-total-price red-hat-text-700");
  totalPricePara.appendChild(totalPriceParaText);

  itemPricesDiv.appendChild(quanityPara);
  itemPricesDiv.appendChild(pricePara);
  itemPricesDiv.appendChild(totalPricePara);

  const removeItemBtn = document.createElement("button");
  removeItemBtn.setAttribute("class", "remove-item-btn");
  removeItemBtn.setAttribute("value", -1);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "width", "10");
  svg.setAttributeNS(null, "height", "10");
  svg.setAttributeNS(null, "fill", "none");
  svg.setAttributeNS(null, "viewBox", "0.5 0 10 10");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttributeNS(null, "fill", "#CAAFA7");
  path.setAttributeNS(
    null,
    "d",
    "M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
  );
  svg.appendChild(path);
  removeItemBtn.appendChild(svg);

  liEle.appendChild(removeItemBtn);

  removeItemBtn.addEventListener("click", removeItem);

  return itemInfoDiv;
};

const changeBtn = (ele) => {
  const addItemBtn = ele;
  const addToCart = addItemBtn.previousElementSibling;

  const img = addToCart.previousElementSibling;
  img.classList.toggle("selected-item");

  addToCart.classList.toggle("hide");
  addItemBtn.classList.toggle("hide");
};

const removeItem = (e) => {
  const name =
    e.currentTarget.parentElement.querySelector(".item-title").textContent;
  const oldAmount = parseInt(totalItemsInCart.getAttribute("data-total-items"));

  const itemQuantity = orderListObj[name].quanity;
  updateItemsInCart(-itemQuantity);

  changeCartView(oldAmount - itemQuantity > 0 ? true : false);

  const cardTitleEles = document.querySelectorAll(".card-title");
  const cardTitleEle = [...cardTitleEles].find(
    (e) => e.textContent.trim() === name
  );
  const addCartCounter =
    cardTitleEle.parentElement.querySelector(".add-cart-counter");
  const amount = addCartCounter.querySelector(".amount");
  changeBtn(addCartCounter);

  //update order total
  updateOrderTotal(-orderListObj[name].price * orderListObj[name].quanity);

  // update counter and reset object
  amount.textContent = 1;

  orderListObj[name].quanity = 0;
  orderListObj[name].total = 0;

  // remove item here and update order list
  orderListObj[name].ele.parentElement.remove();
  orderListObj[name].ele = null;
};

const changeCartView = (firstItem) => {
  cartMessage.classList.toggle("hide", firstItem);
  orderListDiv.classList.toggle("hide", !firstItem);
};

const updateAmount = (e) => {
  const amount = e.currentTarget.parentElement.querySelector(".amount");

  let newVal = parseInt(e.currentTarget.getAttribute("data-amount"));
  let updatedAmount = parseInt(amount.textContent) + newVal;

  // update quantity and total
  const name = e.currentTarget.parentElement.parentElement.parentElement
    .querySelector(".card-title")
    .textContent.trim();
  orderListObj[name].quanity += newVal;
  orderListObj[name].total += newVal * orderListObj[name].price;

  //update order total
  updateOrderTotal(newVal * orderListObj[name].price);

  if (updatedAmount <= 0) {
    updatedAmount = 1;
    newVal = -1;
    changeBtn(e.currentTarget.parentElement);
    changeCartView(
      parseInt(totalItemsInCart.getAttribute("data-total-items")) + newVal
    );
    orderListObj[name].ele.parentElement.remove();
  }
  amount.textContent = updatedAmount;

  // updating item on the orderList
  orderListObj[name].ele.querySelector(
    ".item-quantity"
  ).textContent = `${updatedAmount}x`;
  orderListObj[name].ele.querySelector(
    ".item-total-price"
  ).textContent = `$${orderListObj[name].total.toFixed(2)}`;

  updateItemsInCart(newVal);
};

const updateItemsInCart = (val) => {
  const oldAmount = parseInt(totalItemsInCart.getAttribute("data-total-items"));
  totalItemsInCart.setAttribute(
    "data-total-items",
    oldAmount + val > 0 ? oldAmount + val : 0
  );

  totalItemsInCart.textContent = `(${totalItemsInCart.getAttribute(
    "data-total-items"
  )})`;
};
const keyPress = (e) => {
  if (e.key === "Enter") {
    updateAmount(e);
  }
};
for (const plusBtn of plusBtns) {
  plusBtn.addEventListener("click", updateAmount);
  plusBtn.addEventListener("keypress", keyPress);
}
for (const minusBtn of minusBtns) {
  minusBtn.addEventListener("click", updateAmount);
  minusBtn.addEventListener("keypress", keyPress);
}

for (const addToCartBtn of addToCartBtns) {
  addToCartBtn.addEventListener("click", changeAddCartBtn);
}

confirmBtn.addEventListener("click", () => {
  orderDialog.showModal();

  for (const li of orderListUl.children) {
    const name = li.querySelector(".item-title").textContent;
    const confirmItemLi = document.createElement("li");
    confirmItemLi.classList.add("confirm-list-item");

    confirmOrderUl.appendChild(confirmItemLi);
    const thumbnailImg = document.createElement("img");
    thumbnailImg.setAttribute("class", "thumbnail");
    thumbnailImg.setAttribute("src", orderListObj[name].image.thumbnail);

    confirmItemLi.appendChild(thumbnailImg);

    const itemInfoDiv = document.createElement("div");
    itemInfoDiv.classList.add("confirm-item-info");
    confirmItemLi.appendChild(itemInfoDiv);

    const itemTitleH3 = document.createElement("h3");
    const itemTitleText = document.createTextNode(`${name}`);
    itemTitleH3.appendChild(itemTitleText);
    itemInfoDiv.appendChild(itemTitleH3);

    const confirmItemPriceDiv = document.createElement("div");
    confirmItemPriceDiv.classList.add("confirm-item-price");
    itemInfoDiv.appendChild(confirmItemPriceDiv);

    const quantityPara = document.createElement("p");
    quantityPara.setAttribute("class", "item-quantity red-hat-text-700");
    const quanityText = document.createTextNode(
      `${orderListObj[name].quanity}x`
    );
    quantityPara.appendChild(quanityText);
    confirmItemPriceDiv.appendChild(quantityPara);

    const itemPricePara = document.createElement("p");
    itemPricePara.setAttribute("class", "item-price red-hat-text-700");
    const priceText = document.createTextNode(
      `@ ${orderListObj[name].price.toFixed(2)}`
    );
    itemPricePara.appendChild(priceText);
    confirmItemPriceDiv.appendChild(itemPricePara);

    const totalItemPricePara = document.createElement("p");
    totalItemPricePara.setAttribute(
      "class",
      "confirm-total-item-price red-hat-text-700"
    );
    const totalItemPriceText = document.createTextNode(
      `$${orderListObj[name].total.toFixed(2)}`
    );
    totalItemPricePara.append(totalItemPriceText);
    confirmItemLi.appendChild(totalItemPricePara);
  }
  document.querySelector(
    ".confirm-order-number"
  ).textContent = `${orderTotal.textContent}`;
});

newOrderBtn.addEventListener("click", () => {
  orderDialog.close();
  const orderLength = Object.values(orderListObj).reduce(
    (prev, curr) => prev.quantity + curr.quantity,
    0
  );

  for (const li of orderListUl.children) {
    const name = li.querySelector(".item-title").textContent;
    orderListObj[name].ele = null;
    orderListObj[name].quanity = 0;
    orderListObj[name].total = 0;
  }

  orderListUl.replaceChildren();
  confirmOrderUl.replaceChildren();

  orderTotal.textContent = `$00.00`;
  updateItemsInCart(-orderLength);
  changeCartView(false);

  const selectedItems = document.querySelectorAll(".selected-item");

  for (const selectedItem of selectedItems) {
    const imgContainer = selectedItem.parentElement;
    const addItemBtn = imgContainer.querySelector(".add-cart-counter");
    const counter = addItemBtn.querySelector(".amount");
    counter.textContent = "1";
    changeBtn(addItemBtn);
  }
});
