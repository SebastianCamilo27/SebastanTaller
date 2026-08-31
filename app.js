const API_USUARIOS = "https://jsonplaceholder.typicode.com/users";

let usuariosCargados = [];

const construirFila = ({ id, name, email, company }) => `
  <tr data-id="${id}">
    <td>${name}</td>
    <td>${email}</td>
    <td class="empresa-nombre">${company?.name ?? "—"}</td>
  </tr>`;

const renderizarTabla = (usuarios) => {
  const $tbody = $("#tabla-usuarios-body");
  $tbody.empty();

  if (usuarios.length === 0) {
    $("#sin-resultados").prop("hidden", false);
    return;
  }
  $("#sin-resultados").prop("hidden", true);

  const filasHtml = usuarios.map(construirFila).join("");
  $tbody.append(filasHtml);
};

const cargarUsuarios = async () => {
  try {
    const { data } = await axios.get(API_USUARIOS);
    usuariosCargados = data;

    renderizarTabla(usuariosCargados);
    $("#contador-resultados").text(`${usuariosCargados.length} usuarios cargados`);

    console.log(
      `[EX1] Usuarios cargados: ${usuariosCargados.length}`,
      "\nPrimera fila:",
      usuariosCargados[0]
    );
  } catch (error) {
    $("#contador-resultados").text("Error al cargar usuarios");
    console.error("[EX1] Error al cargar usuarios desde la API:", error);
  }
};

const filtrarPorNombre = (termino) => {
  const terminoNormalizado = termino.trim().toLowerCase();

  const coincidencias = terminoNormalizado
    ? usuariosCargados.filter(({ name }) =>
        name.toLowerCase().includes(terminoNormalizado)
      )
    : usuariosCargados;

  renderizarTabla(coincidencias);
  $("#contador-resultados").text(`${coincidencias.length} de ${usuariosCargados.length} usuarios`);

  console.log(
    `[EX1] Filtro aplicado: "${terminoNormalizado || "(vacío)"}" → ${coincidencias.length} coincidencia(s)`
  );
};


const mostrarDetalle = (id) => {
  const usuario = usuariosCargados.find((u) => u.id === id);
  if (!usuario) return;

  const { name, username, phone, website, address } = usuario;
  const { street, suite, city, zipcode } = address;
  const direccionCompleta = `${street}, ${suite}, ${city} (${zipcode})`;

  $("#detalle-nombre").text(name);
  $("#detalle-username").text(`@${username}`);
  $("#detalle-telefono").text(phone);
  $("#detalle-direccion").text(direccionCompleta);
  $("#detalle-web").text(website);

  $("#panel-detalle, #overlay-detalle").prop("hidden", false);

  console.log(`[EX1] Detalle mostrado para usuario #${id}:`, {
    name,
    phone,
    direccion: direccionCompleta,
  });
};

const cerrarDetalle = () => {
  $("#panel-detalle, #overlay-detalle").prop("hidden", true);
  console.log("[EX1] Panel de detalle cerrado");
};

$(async () => {
  await cargarUsuarios();

  $("#filtro-nombre").on("input", (evento) => {
    filtrarPorNombre(evento.target.value);
  });

  $("#tabla-usuarios-body").on("click", "tr", function () {
    const id = Number($(this).data("id"));
    mostrarDetalle(id);
  });

  $("#cerrar-detalle, #overlay-detalle").on("click", cerrarDetalle);
});
