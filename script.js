const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// store in localStorage
function store(key, value) {
  localStorage.setItem(key, value);
}

// retrieve from localStorage
function retrieve(key) {
  return localStorage.getItem(key);
}

// random 3-digit number
function getRandomArbitrary(min, max) {
  let cached = Math.random() * (max - min) + min;
  return Math.floor(cached);
}

// clear localStorage
function clear() {
  localStorage.clear();
}

// generate SHA256 hash
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// fetch or generate hash
async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (cached) return cached;

  const randomPin = getRandomArbitrary(MIN, MAX).toString();
  const hash = await sha256(randomPin);
  store('sha256', hash);
  return hash;
}

// initialize
async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// verify pin
async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 not 3 digits';
    resultView.classList.remove('hidden');
    resultView.classList.remove('success');
    return;
  }

  const hashedPin = await sha256(pin);
  const storedHash = document.getElementById('sha256-hash').innerHTML;

  if (hashedPin === storedHash) {
    resultView.innerHTML = '🎉 success';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ failed';
    resultView.classList.remove('success');
  }
  resultView.classList.remove('hidden');
}

// restrict input
pinInput.addEventListener('input', (e) => {
  const { value } = e.target;
  pinInput.value = value.replace(/\D/g, '').slice(0, 3);
});

// check button
document.getElementById('check').addEventListener('click', test);

// run on load
main();
