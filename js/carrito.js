// Obtener referencias a los elementos del DOM una sola vez
const vaciarCarritoBtn = document.getElementById('vaciarCarrito');
const volverInicioBtn = document.getElementById('volverInicio');
const confirmarCompraBtn = document.getElementById('confirmarCompra');

// Renderizar el carrito al cargar la página
renderCarrito();

// Vaciar el carrito al hacer clic en el botón
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
volverInicioBtn.addEventListener('click', function() {
    location.href = '../index.html';
});

// Confirmar la compra
confirmarCompraBtn.addEventListener('click', function() {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (storedCart.length > 0) {
        vaciarCarrito(); // Vaciar el carrito después de confirmar la compra
        
        // Mostrar alerta de confirmación con SweetAlert
        Swal.fire({
            title: 'Compra Confirmada',
            html: `            `,
            icon: 'success',
            confirmButtonText: 'Continuar'
        }).then(() => {
            // Redirigir a la página gracias.html después de cerrar la alerta
            window.location.href = './gracias.html';
        });
        
    } else {
        Swal.fire('Error', 'El carrito está vacío. Agrega productos antes de confirmar la compra.', 'error');
    }
});

// Renderizar el carrito
function renderCarrito() {
  const cartItemsContainer = document.getElementById('cart-items');
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

  cartItemsContainer.innerHTML = '';  // Limpiar contenido previo

  if (storedCart.length > 0) {
      storedCart.forEach((item, index) => {
          const cartItem = document.createElement('div');
          cartItem.innerHTML = `
              <h3>${item.partido}</h3>
              <p>Cantidad: <button class="btn-decrementar" data-index="${index}">-</button> ${item.cantidad} <button class="btn-incrementar" data-index="${index}">+</button> - Tipo: ${item.tipo} - Total: $${item.total}</p>
              <button class="btn-eliminar" data-index="${index}">Eliminar</button>
          `;
          cartItemsContainer.appendChild(cartItem);
      });

      // Botones de incrementar y decrementar cantidad
      document.querySelectorAll('.btn-incrementar').forEach(btn => {
          btn.addEventListener('click', function() {
              modificarCantidad(this.dataset.index, 1);
          });
      });

      document.querySelectorAll('.btn-decrementar').forEach(btn => {
          btn.addEventListener('click', function() {
              modificarCantidad(this.dataset.index, -1);
          });
      });

      // Botones de eliminar producto
      document.querySelectorAll('.btn-eliminar').forEach(btn => {
          btn.addEventListener('click', function() {
              eliminarProducto(this.dataset.index);
          });
      });

      mostrarTotal();  // Actualizar el total
  } else {
      cartItemsContainer.innerHTML = "<p>Tu carrito está vacío</p>";
      document.getElementById('total').textContent = "Total: $0"; 
  }
}

// Modificar la cantidad de productos
function modificarCantidad(index, delta) {
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  const nuevaCantidad = storedCart[index].cantidad + delta;

  // Validar que la cantidad no sea menor a 1
  if (nuevaCantidad > 0) {
      storedCart[index].cantidad = nuevaCantidad;
      storedCart[index].total = storedCart[index].cantidad * (storedCart[index].tipo === 'vip' ? storedCart[index].precioVIP : storedCart[index].precioGeneral);
      localStorage.setItem('cart', JSON.stringify(storedCart));
      renderCarrito(); // Volver a renderizar el carrito con las cantidades actualizadas
  } else {
      Swal.fire('Error', 'La cantidad no puede ser menor a 1.', 'error');
  }
}

// Función para eliminar un producto
function eliminarProducto(index) {
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  storedCart.splice(index, 1); // Elimina el producto seleccionado
  localStorage.setItem('cart', JSON.stringify(storedCart));
  renderCarrito(); // Renderizar nuevamente el carrito después de eliminar
}

// Función para vaciar el carrito
function vaciarCarrito() {
  localStorage.removeItem('cart');
  renderCarrito();
}

// Función para mostrar el total del carrito
function mostrarTotal() {
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = storedCart.reduce((acc, item) => acc + item.total, 0); // Uso de reduce para calcular el total
  document.getElementById('total').textContent = `Total: $${total}`;
}
