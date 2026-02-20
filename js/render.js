// Seleccionamos el contenedor principal
const productsContainer = document.querySelector(".products");

// Función para formatear precio
function formatPrice(price) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(price);
}

// Función para crear tarjeta HTML
function createProductCard(product) {
  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">${formatPrice(product.price)}</p>
      <a 
        href="https://wa.me/57TU_NUMERO?text=Hola%20me%20interesa%20${encodeURIComponent(product.name)}" 
        target="_blank"
        class="whatsapp-btn"
      >
        Consultar por WhatsApp
      </a>
    </div>
  `;
}

// Función principal que renderiza productos
async function renderProducts() {
  try {
    const response = await fetch("data/products.json");
    const products = await response.json();

    productsContainer.innerHTML = products
      .map(product => createProductCard(product))
      .join("");

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

// Ejecutamos al cargar
renderProducts();