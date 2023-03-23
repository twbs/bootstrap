// get references to the DOM elements
const hour = document.querySelector('.hour');
const minute = document.querySelector('.minute');
const ampm = document.querySelector('.ampm');
const btnCancel = document.querySelector('.btn-cancel');
const btnOk = document.querySelector('.btn-ok');

// set default values
let selectedHour = '01';
let selectedMinute = '00';
let selectedAmPm = 'am';

// update selected values when user selects an option
hour.addEventListener('change', (event) => {
  selectedHour = event.target.value;
});

minute.addEventListener('change', (event) => {
  selectedMinute = event.target.value;
});

ampm.addEventListener('change', (event) => {
  selectedAmPm = event.target.value;
});

// handle cancel and ok button clicks
btnCancel.addEventListener('click', () => {
  // reset selected values to defaults
  hour.value = '01';
  minute.value = '00';
  ampm.value = 'am';
});

btnOk.addEventListener('click', () => {
  // build the selected time string
  const selectedTime = `${selectedHour}:${selectedMinute} ${selectedAmPm}`;

  // do something with the selected time, e.g. display it on the page
  console.log(selectedTime);
});
