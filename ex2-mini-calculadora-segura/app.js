const CLAVE_HISTORIAL = "ex2-historial-calculadora";

// Historial en memoria (se sincroniza con localStorage)
let historial = [];

// Símbolo legible por operación, usado en logs e historial
const SIMBOLOS_OPERACION = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

// Valida que el string represente un número real (no vacío, no NaN)
const esNumeroValido = (texto) => texto.trim() !== "" && !Number.isNaN(Number(texto));

// Ejecuta la operación matemática. Lanza error en división por cero.
const calcular = (a, operador, b) => {
  switch (operador) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        throw new Error("No se puede dividir entre cero");
      }
      return a / b;
    default:
      throw new Error(`Operador desconocido: ${operador}`);
  }
};

// Carga el historial guardado en localStorage (si existe)
const cargarHistorial = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_HISTORIAL);
    historial = guardado ? JSON.parse(guardado) : [];
  } catch (error) {
    console.warn("[EX2] No se pudo leer el historial guardado:", error);
    historial = [];
  }
};

// Persiste el historial actual en localStorage
const guardarHistorial = () => {
  localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
};

// Construye un <li> de historial a partir de una entrada (template string)
const construirEntradaHtml = ({ a, operador, b, resultado }) => `
  <li>
    <span class="historial-op">${a} ${SIMBOLOS_OPERACION[operador]} ${b}</span>
    <span class="historial-resultado">= ${resultado}</span>
  </li>
`;

// Renderiza el historial completo en la lista
const renderizarHistorial = () => {
  const $lista = $("#lista-historial");
  $lista.empty();

  if (historial.length === 0) {
    $lista.append('<li class="historial-vacio">Todavía no hay operaciones.</li>');
    return;
  }

  const filasHtml = historial.map(construirEntradaHtml).join("");
  $lista.append(filasHtml);
};

// Agrega una operación al inicio del historial
const agregarAlHistorial = (entrada) => {
  historial = [entrada, ...historial];
  guardarHistorial();
  renderizarHistorial();

  console.log(`[EX2] Estado del historial (${historial.length} operación/es):`, historial);
};

// Muestra el resultado en pantalla y limpia cualquier error previo
const mostrarResultado = (valor) => {
  $("#resultado-valor").text(valor);
  $("#error-msg").prop("hidden", true).text("");
};

// Muestra un mensaje de error y limpia el resultado anterior
const mostrarError = (mensaje) => {
  $("#resultado-valor").text("—");
  $("#error-msg").prop("hidden", false).text(mensaje);
};

// Maneja el envío del formulario
const manejarSubmit = (evento) => {
  evento.preventDefault();

  const textoA = $("#num-a").val();
  const textoB = $("#num-b").val();
  const operador = $("#operacion").val();

  console.log("[EX2] Operación solicitada:", { textoA, operador, textoB });

  if (!esNumeroValido(textoA) || !esNumeroValido(textoB)) {
    const mensaje = "Ingresa dos números válidos en A y B";
    mostrarError(mensaje);
    console.error("[EX2] Error de validación:", mensaje);
    return;
  }

  // Destructuring: extraemos y renombramos los valores numéricos convertidos
  const datos = { a: Number(textoA), b: Number(textoB) };
  const { a, b } = datos;

  try {
    const resultado = calcular(a, operador, b);
    mostrarResultado(resultado);

    console.log(`[EX2] Resultado: ${a} ${SIMBOLOS_OPERACION[operador]} ${b} = ${resultado}`);

    agregarAlHistorial({ a, operador, b, resultado });
  } catch (error) {
    mostrarError(error.message);
    console.error("[EX2] Error al calcular:", error.message);
  }
};

// Limpia todo el historial
const manejarLimpiarHistorial = () => {
  historial = [];
  guardarHistorial();
  renderizarHistorial();
  console.log("[EX2] Historial limpiado. Estado del historial (0 operaciones):", historial);
};

// Inicialización
$(() => {
  cargarHistorial();
  renderizarHistorial();

  $("#form-calculadora").on("submit", manejarSubmit);
  $("#limpiar-historial").on("click", manejarLimpiarHistorial);
});
