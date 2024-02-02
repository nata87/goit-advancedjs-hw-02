import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      if (shouldResolve) {
        resolve({
          position,
          delay,
        });
      } else {
        reject({
          position,
          delay,
        });
      }
    }, delay);
  });
}

function bindEvents() {
  const form = document.querySelector('.form');

  if (!form) {
    return;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);

    const { delay, step, amount } = Object.fromEntries(formData);

    createPromises(+delay, +step, +amount);

    form.reset();
  });
}

async function createPromises(firstDelay, stepDelay, amount) {
  const promises = Array.from(Array(amount).keys()).map(index =>
    createPromise(index, firstDelay + index * stepDelay)
      .then(({ position, delay }) => {
        iziToast.show({
          message: `✅ Fulfilled promise ${position + 1} in ${delay}ms`,
          color: 'green',
          position: 'topRight',
        });
      })
      .catch(({ position, delay }) => {
        iziToast.show({
          message: `❌ Rejected promise ${position + 1} in ${delay}ms`,
          color: 'red',
          position: 'topRight',
        });
      })
  );
  await Promise.all(promises);
}

bindEvents();
