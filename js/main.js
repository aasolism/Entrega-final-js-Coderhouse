cargarPartidos();
cargarCarritoDeLocalStorage();  // Cargar el carrito guardado al cargar la página

let cart = [];

// Cargar el carrito desde localStorage cuando se carga la página
function cargarCarritoDeLocalStorage() {
  const storedCart = JSON.parse(localStorage.getItem('cart'));
  if (storedCart && storedCart.length > 0) {
      cart = storedCart; // Si el carrito existe en localStorage, se carga en la variable cart
  }
}

// Función para cargar los partidos usando fetch
async function cargarPartidos() {
  try {
    const response = await fetch('./data/partidos.json');
    if (!response.ok) {
      throw new Error('Error al cargar los partidos');
    }
    const partidos = await response.json();

    const eventCardsContainer = document.getElementById('event-cards');
    if (!eventCardsContainer) {
      throw new Error("No se encontró el contenedor con ID 'event-cards'.");
    }

    eventCardsContainer.innerHTML = partidos.map((partido, index) => `
        <div class="event-card">
            <img src="${partido.imagen}" alt="${partido.nombre}" class="event-img">
            <h3>${partido.nombre}</h3>
            <p>${partido.fecha} - ${partido.hora}</p>
            <p>Estadio: ${partido.lugar}</p>
            <p>Precio General: $${partido.precioGeneral} | VIP: $${partido.precioVIP}</p>
            
            <label for="cantidad-${index}">Cantidad de entradas:</label>
            <input type="number" id="cantidad-${index}" min="1" value="1">

            <label for="tipo-${index}">Tipo de entrada:</label>
            <select id="tipo-${index}">
                <option value="general">General</option>
                <option value="vip">VIP</option>
            </select>

            <button class="btn-agregar" data-index="${index}">Agregar al Carrito</button>
        </div>
    `).join('');

    // Agregar eventos de clic a los botones de "Agregar al Carrito"
    document.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', function() {
            agregarAlCarrito(parseInt(this.dataset.index), partidos);
        });
    });

  } catch (error) {
    console.error('Error al cargar los partidos: ', error);
    Swal.fire('Error', 'Hubo un problema al cargar los partidos', 'error');
  }
}

// Función para agregar productos al carrito
function agregarAlCarrito(index, partidos) {
  const partidoSeleccionado = partidos[index];
  const cantidad = parseInt(document.getElementById(`cantidad-${index}`).value);
  const tipoEntrada = document.getElementById(`tipo-${index}`).value;
  const precio = tipoEntrada === 'vip' ? partidoSeleccionado.precioVIP : partidoSeleccionado.precioGeneral;
  const total = precio * cantidad;

  if (isNaN(cantidad) || cantidad <= 0) {
    Swal.fire('Error', 'Por favor ingresa una cantidad válida de entradas', 'error');
    return;
  }

  // Verificar si el producto ya está en el carrito
  const productoExistente = cart.find(item => item.partido === partidoSeleccionado.nombre && item.tipo === tipoEntrada);

  if (productoExistente) {
    // Si el producto ya existe, actualizar la cantidad y el total
    productoExistente.cantidad += cantidad;
    productoExistente.total += total;
  } else {
    // Si el producto no existe, agregarlo como nuevo producto
    cart.push({
      partido: partidoSeleccionado.nombre,
      tipo: tipoEntrada,
      cantidad,
      total,
      precioVIP: partidoSeleccionado.precioVIP,
      precioGeneral: partidoSeleccionado.precioGeneral
    });
  }

  guardarCarrito();  // Guardar el carrito actualizado en localStorage
  Swal.fire('Éxito', 'Entradas agregadas al carrito', 'success');
}

// Guardar el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
