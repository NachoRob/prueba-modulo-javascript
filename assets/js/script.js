const api = "https://mindicador.cl/api";
let miGrafico = "";

const inputEntrada = document.getElementById("input-entrada");
const monedaSeleccionada = document.getElementById("currency");
const btnBuscarApi = document.getElementById("buscar-api");
const resultado = document.getElementById("resultado");
const errorBox = document.getElementById("mensaje-error");
const graficoBox = document.getElementById("grafico-box");
const mensajeErrorMonto = "Por favor introduzca un valor mayor a 0";
const mensajeErrorMoneda = "Por favor elija una moneda para la conversión";
// Función para obtener un usuario aleatorio desde una API

async function getMoneyConversion(){
    // Definimos nuestras variables
    const monto = inputEntrada.value;
    const moneda = monedaSeleccionada.value;

    // Exponemos los casos para que el usuario interactúe correctamente
    if (!monto || monto <= 0){
        errorBox.textContent = mensajeErrorMonto;
    }
    if (!moneda) {
        errorBox.textContent = mensajeErrorMoneda;
    }

    // Envolvemos en un "try" para atrapar los errores que podamos encontrar
    try {
        const respuesta = await fetch(`${api}/${moneda}`);
        if (!respuesta.ok) {
            throw Error("La Api no está disponible en este momento");
        }

        const datos = await respuesta.json();
        let valorConversion = datos.serie[0].valor;
        let resultadoConversion = (monto / valorConversion).toFixed(2);
        
        // Mostramos el resultado en nuestro DOM junto con el gráfico
        resultado.textContent = `$${resultadoConversion}`;
        mostrarGrafico(datos.serie.slice(0, 10));
    }
    catch (error){
        errorBox.textContent = `Error al procesar la solicitud: ${error.message}`;
        resultado.textContent = "Error";
        graficoBox.style.display = "none";
    }
}

function mostrarGrafico (historial){
    graficoBox.style.display = "block";
    const datosInvertidos = historial.reverse();

    const etiquetas = datosInvertidos.map(item => {
        const fecha = new Date(item.fecha);
        return fecha.toLocaleDateString();
    });
    const valores = datosInvertidos.map(item => item.valor);

    const ctx = document.getElementById('graficoHistorial').getContext('2d');

    // Si ya existe un gráfico, lo borramos para crear el nuevo
    if (miGrafico) {
        miGrafico.destroy();
    }

    miGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Valor moneda en los últimos 10 días',
                data: valores,
                borderColor: '#000000',
                backgroundColor: '#3eb0f9',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#333' }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { color: '#333333' }
                },
                x: {
                    ticks: { color: '#333' }
                }
            }
        }
    });
}

// Event Listeners realizamos la acción
btnBuscarApi.addEventListener('click', getMoneyConversion);