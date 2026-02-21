const productContainer = document.getElementById("productDetail");

// Obtener ID desde la URL
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function formatPrice(price) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(price);
}

function createWhatsAppLink(productName, extraInfo = "") {

  const message = `
Hola 👋

Estoy interesado en el siguiente producto:

📦 Producto: ${productName}
${extraInfo}

¿Está disponible?
Gracias.
  `;

  return `https://wa.me/573007492673?text=${encodeURIComponent(message)}`;
}

function renderProduct(product) {

  productContainer.innerHTML = `
    <a href="index.html" class="back-btn">← Volver al catálogo</a>

    <div class="product-detail-card">
      <img src="${product.image}" alt="${product.name}" class="product-detail-img">
      
      <h2 class="product-detail-name">${product.name}</h2>
      
      ${
        product.type === "simple"
          ? `<p class="product-detail-price">${formatPrice(product.price)}</p>`
          : product.type === "variable"
          ? `<select id="variantSelect">
               ${product.variants.map(v => `
                 <option value="${v.price}">
                   ${v.color} - ${formatPrice(v.price)}
                 </option>
               `).join("")}
             </select>`
          : `<p class="product-detail-price">Cotiza según referencia</p>`
      }

      <p class="product-detail-description">
        Producto disponible en CompuPrinter.
        Escríbenos para confirmar disponibilidad y entrega.
      </p>

      <a id="whatsappBtn" class="whatsapp-btn">
        Comprar por WhatsApp
      </a>
      <button id="shareBtn" class="share-btn">
  Compartir producto
</button>
    </div>
  `;

  activateWhatsApp(product);
  activateShare(product);
}

function activateWhatsApp(product) {
  const button = document.getElementById("whatsappBtn");

  if (product.type === "simple") {
    button.href = createWhatsAppLink(
      product.name,
      "💰 Compra directa"
    );
  }

  if (product.type === "variable") {
    const select = document.getElementById("variantSelect");

    button.addEventListener("click", () => {
      const selectedText = select.options[select.selectedIndex].text;

      button.href = createWhatsAppLink(
        product.name,
        `🎨 Variante: ${selectedText}`
      );
    });
  }

  if (product.type === "quote") {
    button.href = createWhatsAppLink(
      product.name,
      "📝 Solicitud de cotización"
    );
  }

  button.target = "_blank";
}

function activateShare(product) {

  const shareBtn = document.getElementById("shareBtn");

  shareBtn.addEventListener("click", async () => {

    const productUrl = window.location.href;

    if (navigator.share) {
      // Móvil (menú nativo)
      try {
        await navigator.share({
          title: product.name,
          text: `Mira este producto en CompuPrinter: ${product.name}`,
          url: productUrl
        });
      } catch (error) {
        console.log("Error al compartir:", error);
      }
    } else {
      // Escritorio → copiar enlace
      try {
        await navigator.clipboard.writeText(productUrl);
        alert("Enlace copiado al portapapeles");
      } catch (error) {
        alert("No se pudo copiar el enlace");
      }
    }

  });

}
// Cargar producto correctamente
async function loadProduct() {
  const productId = getProductId();

  try {
    const response = await fetch("data/products.json");
    const products = await response.json();

    const product = products.find(p => p.id == productId);

    if (!product) {
      productContainer.innerHTML = "<p>Producto no encontrado.</p>";
      return;
    }

    renderProduct(product);

  } catch (error) {
    console.error("Error cargando producto:", error);
  }
}

loadProduct();