// Seleccionamos el contenedor principal
const productsContainer = document.querySelector(".products");
const WHATSAPP_NUMBER = "573007492673";
// Función para formatear precio
function formatPrice(price) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(price);
}

// Crear botón WhatsApp
function createWhatsAppLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
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
        <a href="${createWhatsAppLink(`Hola, me interesa ${product.name}`)}" 
           target="_blank"
           class="whatsapp-btn">
          Comprar por WhatsApp
        </a>
      </div>
    `;
  }

  // PRODUCTO VARIABLE (con variantes)
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

        <a href="#" 
           class="whatsapp-btn variable-btn">
          Comprar por WhatsApp
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
        <a href="${createWhatsAppLink(`Hola, quiero cotizar ${product.name}`)}" 
           target="_blank"
           class="whatsapp-btn">
          Cotizar por WhatsApp
        </a>
      </div>
    `;
  }

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

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(product => createProductCard(product))
    .join("");

  activateVariableButtons(products);
}
function setupFilters() {
  const filterButtons = document.querySelectorAll(".category");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {

      // Quitar clase active
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;

      if (category === "all") {
        displayProducts(allProducts);
      } else {
        const filtered = allProducts.filter(
          product => product.category === category
        );
        displayProducts(filtered);
      }

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

        const message = `Hola, me interesa ${product.name} - ${selectedText}`;

        button.href = createWhatsAppLink(message);
        button.target = "_blank";
      });
    }
  });
}

// Ejecutamos al cargar
renderProducts();