import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const btn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let targetDate = null;
let intervalId = null;

btn.disabled = true;

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose([date]) {
    targetDate = date;
    const isFuture = targetDate > Date.now();
    btn.disabled = !isFuture;
    if (!isFuture) {
      iziToast.error({ 
        message: "Please choose a date in the future", 
        position: "topRight" 
      });
    }
  }
});

const pad = v => String(v).padStart(2, "0");

function updateInterface({ days, hours, minutes, seconds }) {
  daysSpan.textContent = pad(days);
  hoursSpan.textContent = pad(hours);
  minutesSpan.textContent = pad(minutes);
  secondsSpan.textContent = pad(seconds);
}

btn.onclick = () => {
  btn.disabled = true;
  input.disabled = true;

  intervalId = setInterval(() => {
    const diff = targetDate - Date.now();

    if (diff <= 0) {
      clearInterval(intervalId);
      updateInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 }); // Явно ставимо нулі
      input.disabled = false;
      return;
    }

    const timeValues = convertMs(diff);
    updateInterface(timeValues);
  }, 1000);
};

function convertMs(ms) {
  const s = 1000, m = s * 60, h = m * 60, d = h * 24;
  return {
    days: Math.floor(ms / d),
    hours: Math.floor((ms % d) / h),
    minutes: Math.floor(((ms % d) % h) / m),
    seconds: Math.floor((((ms % d) % h) % m) / s)
  };
}