import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const btn = document.querySelector('[data-start]'), input = document.querySelector('#datetime-picker');
const spans = [...document.querySelectorAll('.value')]; // Масив: [дні, години, хвилини, секунди]
let targetDate = null, intervalId = null;

btn.disabled = true;

flatpickr(input, {
  enableTime: true, time_24hr: true, defaultDate: new Date(), minuteIncrement: 1,
  onClose([date]) {
    targetDate = date;
    const isFuture = targetDate > Date.now();
    btn.disabled = !isFuture;
    if (!isFuture) iziToast.error({ message: "Please choose a date in the future", position: "topRight" });
  }
});

const pad = v => String(v).padStart(2, "0");

btn.onclick = () => {
  btn.disabled = input.disabled = true;
  intervalId = setInterval(() => {
    const diff = targetDate - Date.now();
    if (diff <= 0) return clearInterval(intervalId), (input.disabled = false);

    const t = convertMs(diff);
    [t.days, t.hours, t.minutes, t.seconds].forEach((val, i) => spans[i].textContent = pad(val));
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