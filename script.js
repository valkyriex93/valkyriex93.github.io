const form = document.querySelector('form')
const elemCurrentEarnings = document.getElementById('current-earnings')
const elemCalculationsDisplay = document.getElementById('calculations')

const STATE = {
  hourlyWage: new Decimal(0),
  clockedTime: 0,
  startTime: 0,
  pageTitle: document.title
}

// form.querySelector('#input-toggle-clock').value = STATE.running ? 'Stop Clock' : 'Start Clock'

form.addEventListener('submit', (event) => {
  event.preventDefault()
  STATE.hourlyWage = new Decimal(event.target.querySelector('#input-hourly-wage').value)
  elemCalculationsDisplay.querySelector('.rate').textContent = `$${Number(STATE.hourlyWage.toDecimalPlaces(2))}`
  if (!main.isRunning()) {
    elemCurrentEarnings.textContent = `$${calculateEarnings(STATE.hourlyWage, STATE.clockedTime)}`
  }
})

const calculateEarnings = (rate, duration) => {
  return Number(rate.times(duration / 1000 / 60 / 60).toDecimalPlaces(2))
}

const update = (delta) => {
  // STATE.clockedTime += delta
}

const draw = () => {
  const earnedTime = STATE.clockedTime + (Date.now() - STATE.startTime)
  const earnings = calculateEarnings(STATE.hourlyWage, earnedTime)

  elemCalculationsDisplay.querySelector('.duration').textContent = `${Math.floor(earnedTime / 1000 / 60 / 60)}h ${Math.floor(earnedTime / 1000 / 60 % 60)}m ${Math.floor(earnedTime / 1000 % 60 % 60)}s`
  elemCalculationsDisplay.querySelector('.rate').textContent = `$${Number(STATE.hourlyWage.toDecimalPlaces(2))}`
  elemCurrentEarnings.textContent = `$${earnings}`
  // document.title = `[$${earnings}] ${STATE.pageTitle}`
}

const main = MainLoop.setUpdate(update).setDraw(draw);

form.querySelector('#input-toggle-clock').addEventListener('click', (event) => {
  if (main.isRunning()) {
    STATE.clockedTime += Date.now() - STATE.startTime
    main.stop()
    event.target.value = 'Start Clock'
  } else {
    if (STATE.hourlyWage.equals(0)) {
      alert('Enter your hourly wage and click "Update Wage"')
      return
    }
    STATE.startTime = Date.now()
    main.start()
    event.target.value = 'Stop Clock'
  }
})

form.querySelector('#input-reset-clock').addEventListener('click', (event) => {
  STATE.clockedTime = 0
  STATE.startTime = Date.now()
  draw()
})
