// Seleccionamos el contenedor principal
const productsContainer = document.querySelector(".products");
const WHATSAPP_NUMBER = "573007492673";
let currentCategory = "all";
// Función para formatear precio
function formatPrice(price) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(price);
}

// Crear botón WhatsApp
function createWhatsAppLink(productName, extraInfo = "") {
  const baseMessage = `
Hola 

Estoy interesado en el siguiente producto:

 Producto: ${productName}
${extraInfo}

¿Está disponible?
Gracias.
  `;

  return `https://wa.me/573007492673?text=${encodeURIComponent(baseMessage)}`;
}


// Función para crear tarjeta HTML

function createProductCard(product) {

  // PRODUCTO SIMPLE
  if (product.type === "simple") {
    return `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-img">
        ${product.featured ? `<span class="badge">Más Vendido</span>` : ""}
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <a href="${createWhatsAppLink(product.name)}" 
           target="_blank"
           class="whatsapp-btn">
          Comprar por WhatsApp
        </a>
        <a href="product.html?id=${product.id}" class="details-btn">
          Ver producto
        </a>
      </div>
    `;
  }

  // PRODUCTO VARIABLE
  if (product.type === "variable") {

    const options = product.variants
      .map((variant, index) => `
        <option value="${variant.price}" ${index === 0 ? "selected" : ""}>
          ${variant.color} - ${formatPrice(variant.price)}
        </option>
      `)
      .join("");

    return `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <h3 class="product-name">${product.name}</h3>

        <select class="variant-select">
          ${options}
        </select>

        <a href="#" class="whatsapp-btn variable-btn">
          Comprar por WhatsApp
        </a>

        <a href="product.html?id=${product.id}" class="details-btn">
          Ver producto
        </a>
      </div>
    `;
  }

  // PRODUCTO COTIZACIÓN
  if (product.type === "quote") {
    return `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">Cotiza según referencia</p>

        <a href="#" 
           class="whatsapp-btn quote-btn"
           data-name="${product.name}">
          Cotizar por WhatsApp
        </a>

        <a href="product.html?id=${product.id}" class="details-btn">
          Ver producto
        </a>
      </div>
    `;
  }

  return "";
}

// Función principal que renderiza productos
let allProducts = [];

async function renderProducts() {
  try {
    const response = await fetch("data/products.json");
    allProducts = await response.json();

    allProducts.sort((a, b) => {
  if (a.featured) return -1;
  if (b.featured) return 1;
  return 0;
});

    displayProducts(allProducts);
    setupFilters();
    setupSorting();

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}
function displayProducts(products) {

  productsContainer.classList.add("fade-out");

  setTimeout(() => {

    productsContainer.innerHTML = products
      .map(product => createProductCard(product))
      .join("");

    activateVariableButtons(products);
    activateQuoteButtons();

    productsContainer.classList.remove("fade-out");
    productsContainer.classList.add("fade-in");

  }, 200);
}
function setupFilters() {
  const filterButtons = document.querySelectorAll(".category");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {

      // Quitar clase active
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;
      currentCategory = category;

   applyFiltersAndSort();

    });
  });
}


// Activar botones de productos variables
function activateVariableButtons(products) {
  const variableCards = document.querySelectorAll(".product-card");

  variableCards.forEach((card, index) => {
    const product = products[index];

    if (product.type === "variable") {
      const select = card.querySelector(".variant-select");
      const button = card.querySelector(".variable-btn");

      button.addEventListener("click", () => {
  const selectedText = select.options[select.selectedIndex].text;

  button.href = createWhatsAppLink(
    product.name,
    `🎨 Variante: ${selectedText}`
  );
});
    }
  });
}

function activateQuoteButtons() {
  const quoteButtons = document.querySelectorAll(".quote-btn");

  quoteButtons.forEach(button => {
    button.addEventListener("click", () => {

      const productName = button.dataset.name;

      button.href = createWhatsAppLink(
        productName,
        "📝 Solicitud de cotización"
      );

      button.target = "_blank";
    });
  });
}

function setupSorting() {
  const sortSelect = document.getElementById("sortSelect");

  sortSelect.addEventListener("change", () => {
    applyFiltersAndSort();
  });
}

function applyFiltersAndSort() {

  let filtered = currentCategory === "all"
    ? [...allProducts]
    : allProducts.filter(p => p.category === currentCategory);

  const sortValue = document.getElementById("sortSelect").value;

  if (sortValue === "asc") {
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  }

  if (sortValue === "desc") {
    filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  displayProducts(filtered);
}

// Ejecutamos al cargar
renderProducts();