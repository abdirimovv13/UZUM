let products = JSON.parse(localStorage.getItem("products")) || [];
let basket = JSON.parse(localStorage.getItem("basket")) || [];

function convertToBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.onerror = (error) => console.error("Xatolik:", error);
  reader.readAsDataURL(file);
}

function addProduct() {
  const name = document.getElementById("product-name").value.trim();
  const price = parseFloat(document.getElementById("product-price").value.trim());
  const imageFile = document.getElementById("product-image").files[0];

  if (!name || !price || !imageFile) return alert("Barcha maydonlarni to'ldiring!");
  
  convertToBase64(imageFile, (image) => {
    products.push({ name, price, image });
    localStorage.setItem("products", JSON.stringify(products));
    alert("Mahsulot qo'shildi!");
    document.getElementById("add-product-form").reset();
    loadProducts();
  });
}

function loadProducts(filter = "") {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  productList.innerHTML = "";
  const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
  
  if (!filtered.length) {
    productList.innerHTML = `<p class='text-center text-muted'>Mahsulot topilmadi.</p>`;
    return;
  }

  filtered.forEach((p, i) => {
    productList.innerHTML += `
      <div class='col-md-3'>
        <div class='card shadow-sm h-100' style='width: 18rem;'>
          <img src='${p.image}' class='card-img-top img-fluid' alt='${p.name}' style='height: 250px; object-fit: cover;'>
          <div class='card-body d-flex flex-column'>
            <h5 class='card-title'>${p.name}</h5>
            <p class='card-text'>${p.price} сум</p>
            <button class='btn btn-success mt-auto' onclick='addToBasket(${i})'>Купить</button>
          </div>
        </div>
      </div>`;
  });
}

function addToBasket(index) {
  let item = basket.find(b => b.name === products[index].name);
  item ? item.quantity++ : basket.push({ ...products[index], quantity: 1 });
  localStorage.setItem("basket", JSON.stringify(basket));
  updateCartCounter();
  loadBasket();
}

function updateCartCounter() {
  const cartCounter = document.getElementById("cart-counter");
  if (cartCounter) {
    const totalItems = basket.reduce((total, item) => total + item.quantity, 0);
    cartCounter.textContent = totalItems;
  }
}


function loadBasket(filter = "") {
  const basketList = document.getElementById("basket-list");
  if (!basketList) return;

  basketList.innerHTML = "";
  let total = 0;
  const filtered = basket.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()));
  
  if (!filtered.length) {
    basketList.innerHTML = `<p class='text-center text-muted'>Savatcha bo'sh.</p>`;
    document.getElementById("total-price").textContent = 0;
    return;
  }

  filtered.forEach((i, index) => {
    total += i.price * i.quantity;
    basketList.innerHTML += `
      <div class='col-md-6 col-lg-4'>
        <div class='card shadow-sm mb-3'>
          <img src='${i.image}' class='card-img-top img-fluid' alt='${i.name}'>
          <div class='card-body'>
            <h5 class='card-title'>${i.name}</h5>
            <p class='card-text text-muted'>${i.price} сум</p>
            <div class='d-flex justify-content-between align-items-center'>
              <button class='btn btn-danger btn-sm' onclick='removeFromBasket(${index})'>🗑 Удалить</button>
              <div class='d-flex align-items-center'>
                <button class='btn btn-outline-secondary btn-sm me-2' onclick='decreaseQuantity(${index})'>-</button>
                <span class='badge bg-primary'>${i.quantity} шт</span>
                <button class='btn btn-outline-secondary btn-sm ms-2' onclick='increaseQuantity(${index})'>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });

  document.getElementById("total-price").textContent = total;
}

function decreaseQuantity(index) {
  basket[index].quantity > 1 ? basket[index].quantity-- : basket.splice(index, 1);
  updateStorage();
}

function increaseQuantity(index) {
  basket[index].quantity++;
  updateStorage();
}

function removeFromBasket(index) {
  basket.splice(index, 1);
  updateStorage();
}

function updateStorage() {
  localStorage.setItem("basket", JSON.stringify(basket));
  updateCartCounter();
  loadBasket();
}

function searchProducts() {
  const filter = document.getElementById("search-input").value.trim();
  if (document.getElementById("product-list")) loadProducts(filter);
  if (document.getElementById("basket-list")) loadBasket(filter);
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("product-list")) loadProducts();
  if (document.getElementById("basket-list")) loadBasket();
  updateCartCounter();
  document.getElementById("search-input")?.addEventListener("input", searchProducts);
});
