const buttonIncrementCounter = document.querySelector('[data-js="button-increment-counter"]')
const buttonDecrementCounter = document.querySelector('[data-js="button-decrement-counter"]')
const buttonResetCounter = document.querySelector('[data-js="button-reset-counter"]')
const counter = document.querySelector('[data-js="counter"]')

const handleButtonClick = async e => {
  const clickedButton = e.target.dataset.js
  const isClickedButtonIncrement = clickedButton.includes('increment')
  const isClickedButtonDecrement = clickedButton.includes('decrement')
  
  if(isClickedButtonIncrement) {
    const { incrementCounter } = await import('./incrementCounter.js')
    incrementCounter()
    return
  }
  
  if(isClickedButtonDecrement) {
    const { decrementCounter } = await import('./decrementCounter.js')
    decrementCounter()
    return
  }
  
  const { resetCounter } = await import('./resetCounter.js')
  resetCounter()
}

buttonIncrementCounter.addEventListener('click', handleButtonClick)
buttonDecrementCounter.addEventListener('click', handleButtonClick)
buttonResetCounter.addEventListener('click', handleButtonClick)