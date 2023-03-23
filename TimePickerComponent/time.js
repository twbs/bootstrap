// Get the time input element
const timeInput = document.getElementById('time-input')

// Add an event listener for when the time input value changes
timeInput.addEventListener('change', event => {
  // Get the selected time value from the event object
  const selectedTime = event.target.value

  // Log the selected time value to the console
  console.log(`Selected time: ${selectedTime}`)
})
