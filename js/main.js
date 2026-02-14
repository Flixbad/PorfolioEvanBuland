/**
 * Portfolio Evan Buland - JavaScript
 * Démos interactives et comportements du site
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initI18n === 'function') initI18n();
  initTheme();
  initNav();
  initCalculator();
  initTodo();
  initCounter();
  initConverter();
  initWeather();
  initContactForm();
  initCodeTests();
  initScrollEffects();
});

// ===== Thème clair / sombre =====
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
}

// ===== Navigation mobile =====
function initNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });
}

// ===== Calculatrice =====
function initCalculator() {
  const display = document.getElementById('calcDisplay');
  const keys = document.querySelectorAll('.calc-btn');

  let current = '0';
  let previous = null;
  let operator = null;

  function updateDisplay() {
    const maxLen = 12;
    let str = String(current);
    if (str.length > maxLen) str = str.slice(0, maxLen);
    display.value = str;
  }

  keys.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;

      if (action === 'number') {
        if (value === '.' && current.includes('.')) return;
        if (value === '.' && current === '0') {
          current = '0.';
        } else if (value !== '.' && current === '0' && !current.includes('.')) {
          current = value;
        } else {
          current += value;
        }
      } else if (action === 'operator') {
        if (previous !== null && operator) {
          const result = calculate(Number(previous), Number(current), operator);
          current = String(Number.isInteger(result) ? result : Math.round(result * 1e10) / 1e10);
        }
        previous = current;
        operator = value;
        current = '0';
      } else if (action === 'equals') {
        if (previous !== null && operator) {
          current = String(calculate(Number(previous), Number(current), operator));
          if (!Number.isInteger(Number(current))) {
            current = String(Math.round(Number(current) * 1e10) / 1e10);
          }
          previous = null;
          operator = null;
        }
      } else if (action === 'clear') {
        current = '0';
        previous = null;
        operator = null;
      }

      updateDisplay();
    });
  });

  function calculate(a, b, op) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? 0 : a / b;
      case '%': return a % b;
      default: return b;
    }
  }

  updateDisplay();
}

// ===== Liste de tâches =====
function initTodo() {
  const form = document.getElementById('todoForm');
  const input = document.getElementById('todoInput');
  const list = document.getElementById('todoList');
  const stats = document.getElementById('todoStats');

  let tasks = JSON.parse(localStorage.getItem('portfolio-todos') || '[]');

  function save() {
    localStorage.setItem('portfolio-todos', JSON.stringify(tasks));
    render();
  }

  function render() {
    list.innerHTML = '';
    tasks.forEach((task, i) => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (task.done ? ' done' : '');
      li.innerHTML = `
        <span class="todo-text">${escapeHtml(task.text)}</span>
        <button type="button" class="todo-delete" data-index="${i}" aria-label="Supprimer">×</button>
      `;
      li.querySelector('.todo-text').addEventListener('click', () => {
        tasks[i].done = !tasks[i].done;
        save();
      });
      li.querySelector('.todo-delete').addEventListener('click', () => {
        tasks.splice(i, 1);
        save();
      });
      list.appendChild(li);
    });
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    stats.textContent = `${done}/${total} tâche(s)`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ text, done: false });
    input.value = '';
    save();
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  render();
}

// ===== Compteur =====
function initCounter() {
  const valueEl = document.getElementById('counterValue');
  const minusBtn = document.getElementById('counterMinus');
  const plusBtn = document.getElementById('counterPlus');
  const resetBtn = document.getElementById('counterReset');

  let count = parseInt(localStorage.getItem('portfolio-counter') || '0', 10);
  valueEl.textContent = count;

  function update() {
    valueEl.textContent = count;
    localStorage.setItem('portfolio-counter', String(count));
  }

  minusBtn.addEventListener('click', () => {
    count--;
    update();
  });

  plusBtn.addEventListener('click', () => {
    count++;
    update();
  });

  resetBtn.addEventListener('click', () => {
    count = 0;
    update();
  });
}

// ===== Convertisseur °C / °F =====
function initConverter() {
  const celsiusInput = document.getElementById('celsiusInput');
  const fahrenheitInput = document.getElementById('fahrenheitInput');

  function cToF(c) {
    return (c * 9) / 5 + 32;
  }

  function fToC(f) {
    return ((f - 32) * 5) / 9;
  }

  celsiusInput.addEventListener('input', () => {
    const c = parseFloat(celsiusInput.value);
    if (!isNaN(c)) {
      fahrenheitInput.value = Math.round(cToF(c) * 10) / 10;
    } else {
      fahrenheitInput.value = '';
    }
  });

  fahrenheitInput.addEventListener('input', () => {
    const f = parseFloat(fahrenheitInput.value);
    if (!isNaN(f)) {
      celsiusInput.value = Math.round(fToC(f) * 10) / 10;
    } else {
      celsiusInput.value = '';
    }
  });
}

// ===== Météo (API Open-Meteo) =====
const WEATHER_CODE_KEYS = {
  0: 'weather_clear',
  1: 'weather_mainly_clear',
  2: 'weather_partly_cloudy',
  3: 'weather_overcast',
  45: 'weather_fog',
  48: 'weather_fog',
  51: 'weather_drizzle',
  53: 'weather_drizzle',
  55: 'weather_drizzle',
  61: 'weather_rain',
  63: 'weather_rain',
  65: 'weather_rain',
  71: 'weather_snow',
  73: 'weather_snow',
  75: 'weather_snow',
  80: 'weather_showers',
  81: 'weather_showers',
  82: 'weather_showers',
  85: 'weather_snow_showers',
  86: 'weather_snow_showers',
  95: 'weather_thunderstorm',
  96: 'weather_thunderstorm',
  99: 'weather_thunderstorm'
};

function getWeatherConditionKey(code) {
  return WEATHER_CODE_KEYS[code] || 'weather_overcast';
}

function initWeather() {
  const form = document.getElementById('weatherForm');
  const cityInput = document.getElementById('weatherCity');
  const btn = document.getElementById('weatherBtn');
  const loadingEl = document.getElementById('weatherLoading');
  const errorEl = document.getElementById('weatherError');
  const dataEl = document.getElementById('weatherData');
  const cityNameEl = document.getElementById('weatherCityName');
  const tempEl = document.getElementById('weatherTempValue');
  const conditionEl = document.getElementById('weatherCondition');
  const humidityEl = document.getElementById('weatherHumidity');
  const windEl = document.getElementById('weatherWind');

  if (!form || !cityInput || !dataEl) return;

  function getT(key) {
    const lang = document.documentElement.lang || 'fr';
    return (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || key;
  }

  function setLoading(loading) {
    loadingEl.hidden = !loading;
    errorEl.hidden = true;
    dataEl.hidden = loading;
    if (btn) btn.disabled = loading;
  }

  function setError() {
    loadingEl.hidden = true;
    errorEl.hidden = false;
    dataEl.hidden = true;
    if (btn) btn.disabled = false;
  }

  function showWeather(name, temp, code, humidity, wind) {
    loadingEl.hidden = true;
    errorEl.hidden = true;
    dataEl.hidden = false;
    if (btn) btn.disabled = false;
    cityNameEl.textContent = name;
    tempEl.textContent = Math.round(temp);
    conditionEl.textContent = getT(getWeatherConditionKey(code));
    humidityEl.textContent = humidity;
    windEl.textContent = wind;
  }

  async function fetchWeather(cityName) {
    const name = (cityName || 'Paris').trim() || 'Paris';
    setLoading(true);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        setError();
        return;
      }
      const { latitude, longitude, name: foundName } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
      );
      const weatherData = await weatherRes.json();
      if (!weatherData.current) {
        setError();
        return;
      }

      const c = weatherData.current;
      showWeather(
        foundName,
        c.temperature_2m,
        c.weather_code,
        c.relative_humidity_2m,
        Math.round(c.wind_speed_10m)
      );
    } catch {
      setError();
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchWeather(cityInput.value);
  });
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      fetchWeather(cityInput.value);
    });
  }
}

// ===== Formulaire de contact =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('contactFormStatus');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form || form.action.includes('VOTRE_ID')) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!statusEl || !submitBtn) return;
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    if (!name || !email || !message) return;
    // Formspree submit
    statusEl.textContent = '';
    statusEl.className = 'form-status';
    submitBtn.disabled = true;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = await res.json().catch(() => ({}));
      if (res.ok && !data.error) {
        statusEl.textContent = 'Message envoyé ! Merci.';
        statusEl.className = 'form-status form-status--success';
        form.reset();
      } else {
        statusEl.textContent = 'Erreur. Réessayez ou contactez-moi par email.';
        statusEl.className = 'form-status form-status--error';
      }
    } catch {
      statusEl.textContent = 'Erreur réseau. Réessayez plus tard.';
      statusEl.className = 'form-status form-status--error';
    }
    submitBtn.disabled = false;
  });
}


// ===== Tests de code (Symfony & Angular) =====
const QUIZ_SYMFONY_ANSWERS = { s1: 'a', s2: 'a', s3: 'b', s4: 'a' };
const QUIZ_ANGULAR_ANSWERS = { a1: 'b', a2: 'a', a3: 'c', a4: 'a' };

function initCodeTests() {
  const tabs = document.querySelectorAll('.tests-tab');
  const panels = document.querySelectorAll('.tests-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => {
        t.classList.remove('tests-tab--active');
        t.setAttribute('aria-pressed', t.dataset.tab === target ? 'true' : 'false');
      });
      tab.classList.add('tests-tab--active');
      panels.forEach((panel) => {
        panel.classList.toggle('tests-panel--active', panel.id === 'panel-' + target);
      });
    });
  });

  const formSymfony = document.getElementById('quizSymfony');
  const resultSymfony = document.getElementById('resultSymfony');
  formSymfony.addEventListener('submit', (e) => {
    e.preventDefault();
    const score = getQuizScore(formSymfony, QUIZ_SYMFONY_ANSWERS);
    showQuizResult(resultSymfony, score, 4, 'Symfony');
  });

  const formAngular = document.getElementById('quizAngular');
  const resultAngular = document.getElementById('resultAngular');
  formAngular.addEventListener('submit', (e) => {
    e.preventDefault();
    const score = getQuizScore(formAngular, QUIZ_ANGULAR_ANSWERS);
    showQuizResult(resultAngular, score, 4, 'Angular');
  });
}

function getQuizScore(form, answers) {
  let correct = 0;
  Object.keys(answers).forEach((name) => {
    const input = form.querySelector(`input[name="${name}"]:checked`);
    if (input && input.value === answers[name]) correct++;
  });
  return correct;
}

function showQuizResult(el, score, total, tech) {
  el.textContent = '';
  el.className = 'quiz-result';
  if (score === total) {
    el.classList.add('quiz-result--success');
    el.textContent = `Bravo ! ${score}/${total} bonnes réponses en ${tech}.`;
  } else if (score > 0) {
    el.classList.add('quiz-result--partial');
    el.textContent = `${score}/${total} bonnes réponses en ${tech}. Réessaie pour tout avoir !`;
  } else {
    el.classList.add('quiz-result--fail');
    el.textContent = `0/${total}. Relis tes cours ${tech} et réessaie.`;
  }
}

// ===== Effets au scroll (nav + animations au scroll) =====
function initScrollEffects() {
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Animation au scroll : ajouter .in-view quand une section entre dans le viewport
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }
  );

  sections.forEach((section) => observer.observe(section));
}
