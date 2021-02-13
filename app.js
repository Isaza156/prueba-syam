fecha = new Date();
año = fecha.getFullYear();
mes = fecha.getMonth();
dia = fecha.getDate();
hora = fecha.getHours();
minutos = fecha.getMinutes();

document.getElementById("fecha").innerHTML =
  año + "-" + (mes + 1) + "-" + dia + "  " + hora + ":" + minutos;

var ordenCompra = document.getElementById("orden");
var sendOrdenCompra = 0;
var sendSubtotal = 0;
var sendIva = 0;
var sendTotal = 0;

const fetchDataList = () => {
  fetch("http://localhost:3307")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        ordenCompra.value = element.orden + 1;
        sendOrdenCompra = parseInt(ordenCompra.value);
      });
    });
};

fetchDataList();

const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");

const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;

const fragment = document.createDocumentFragment();

let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

cards.addEventListener("click", (e) => {
  addCarrito(e);
});

items.addEventListener("click", (e) => {
  btnAcción(e);
});

const fetchData = async () => {
  try {
    const res = await fetch("info_prueba.json");
    const data = await res.json();
    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCards = (data) => {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key];
      templateCard.querySelector("h5").textContent = element.descripcion;
      templateCard.querySelector("span").textContent = element.precio;
      templateCard.querySelector("h6").textContent = element.existencia;
      templateCard.querySelector(".btn-dark").dataset.id = key;
      const clone = templateCard.cloneNode(true);
      fragment.appendChild(clone);
    }
  }
  cards.appendChild(fragment);
};

const addCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    descripcion: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("span").textContent,
    existencia: objeto.querySelector("h6").textContent,
    cantidad: 1,
  };
  if (carrito.hasOwnProperty(producto.id)) {
    if (producto.cantidad === 1) {
      producto.cantidad = carrito[producto.id].cantidad;
    } else {
      producto.cantidad = carrito[producto.id].cantidad + 1;
    }
  }
  carrito[producto.id] = { ...producto };
  pintarCarrito();
};

const pintarCarrito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.descripcion;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-dark").dataset.id = producto.id;
    templateCarrito.querySelectorAll("span")[0].textContent =
      producto.cantidad * producto.precio;
    templateCarrito.querySelectorAll("span")[1].textContent =
      producto.cantidad * producto.precio * 0.19;
    templateCarrito.querySelectorAll("span")[2].textContent =
      producto.cantidad * producto.precio * 0.19 +
      producto.cantidad * producto.precio;
    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  pintarFooter();
};

const pintarFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - agregue productos!</th>
        `;
    return;
  }

  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );

  const nSubTotal = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  sendSubtotal = nSubTotal;

  const nIva = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio * 0.19,
    0
  );

  sendIva = nIva;

  const nTotal = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) =>
      acc + (cantidad * precio * 0.19 + cantidad * precio),
    0
  );

  sendTotal = nTotal;

  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelectorAll("span")[0].textContent = nSubTotal;
  templateFooter.querySelectorAll("span")[1].textContent = nIva;
  templateFooter.querySelectorAll("span")[2].textContent = nTotal;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnVaciar = document.getElementById("vaciar-carrito");
  btnVaciar.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

const btnAcción = (e) => {
  if (e.target.classList.contains("btn-info")) {
    const producto = carrito[e.target.dataset.id];
    if (producto.cantidad === parseInt(producto.existencia)) {
      producto.cantidad = producto.cantidad;
    } else {
      producto.cantidad++;
    }
    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }
  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito();
  }
  if (e.target.classList.contains("btn-dark")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad = 0;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito();
  }
  e.stopPropagation();
};

const sendCompras = () => {
  let sendItems = {
    orden: sendOrdenCompra,
    subtotal: sendSubtotal,
    iva: sendIva,
    total: sendTotal,
  };
  console.log(JSON.stringify(sendItems));

  fetch("http://localhost:3307", {
    method: "POST",
    body: JSON.stringify(sendItems),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => (
      document.querySelector('#volver').click()
    ))   
};
