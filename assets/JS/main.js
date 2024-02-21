const inputMonto = document.querySelector('#inputMonto')
const buscar = document.querySelector('#buscar')
const displayMoneda = document.querySelector('#displayMoneda')
const resultado = document.querySelector('#resultado')
const selectMoneda = document.querySelector('#selectMoneda')
const errorMsg = document.querySelector('#errorMsg')
let currentChart

/* Conexión a API */
const getCoin = async () => {
  try {
    const res = await fetch("https://mindicador.cl/api")
    const coin = await res.json()
    return(coin)
  } catch (e) {
    errorMsg.innerHTML = 'falló la conexión a la API'
  }
  
}

selectMoneda.addEventListener("change", () => {
  renderGrafica()
})

buscar.addEventListener("click", async () => {
  try {
  if (inputMonto.value !== ''){
    const monedas = await getCoin()
    const nuevoMonto = Number(inputMonto.value)
    const selMon = selectMoneda.value
    const newVar = monedas[selMon].valor
    const divisaVal =Number(nuevoMonto/newVar)
    resultado.innerHTML = `
      $ ${divisaVal}
    `
  }} catch (e) {
    errorMsg.innerHTML = 'falló la conexión a la API'
  }
})

async function getAndCreateDataToChart() {
  try {
  const selMonGraph = selectMoneda.value
  const selMonURL = `https://mindicador.cl/api/${selMonGraph}`
  const res = await fetch(selMonURL)
  const coinValues = await res.json()
  const labels = coinValues.serie.slice(0,10).map((coinValue) => {
    return coinValue.fecha
  })
  
  const data = coinValues.serie.slice(0,10).map((coinValue) => {
  const valor = coinValue.valor
  return valor
  });
  const datasets = [
   {
    label: "Día",
    borderColor: "rgb(255, 99, 132)",
    data
    }
  ]
  return { labels, datasets }
  } catch (e) {
    errorMsg.innerHTML = 'falló la conexión a la API'
  }}


async function renderGrafica() {
  try {
    const data = await getAndCreateDataToChart()
    const config = {
    type: "line",
    data
    };
    const myChart = document.getElementById("myChart")
    if (currentChart) currentChart.destroy()
    myChart.style.backgroundColor = "white"
    currentChart = new Chart(myChart, config)
  } catch  (e) {
    errorMsg.innerHTML = 'falló la conexión a la API'
  }}

renderGrafica()
