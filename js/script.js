// script.js

// 1. Справочник материалов: плотность (г/см³), цена за грамм (₽) и описание
const materials = {
  PLA: [1.24, 2.42 * 5, "жесткий, универсальный"],
  PETG: [1.27, 1.35 * 5, "жесткий, прочный"],
  "TPU D70": [1.2, 3.62 * 5, "гибкий, эластичный"],
  PA6: [1.14, 4.05 * 5, "инженерный, прочный"],
  "rPETG GF": [1.3, 2.71 * 5, "инженерный, армированный стеклом"],
  "TPU GF": [1.25, 4.81 * 5, "гибкий, армированный"],
  ABS: [1.05, 1.79 * 5, "жесткий, ударопрочный"],
  HIPS: [1.04, 2.12 * 5, "жесткий, растворимый в лимонене"],
  ETERNAL: [1.2, 2.09 * 5, "жесткий, устойчивый к УФ"],
  GFMAX: [1.35, 4.87 * 5, "инженерный, армированный стеклом"],
  RELAX: [1.18, 1.72 * 5, "гибкий, мягкий"],
  "EASY FLEX": [1.18, 4.31 * 5, "гибкий, для упрощённой печати"],
  "SOFT FLEX": [1.18, 5.12 * 5, "мягкий, эластичный"],
  FRICTION: [1.4, 8.7 * 5, "инженерный, низкое трение"],
  "PP+": [0.9, 5.38 * 5, "устойчивый к химии"],
  CAST: [1.2, 3.63 * 5, "для литья по выплавляемым моделям"],
  RUBBER: [1.1, 4.07 * 5, "резиноподобный"],
  FORMAX: [1.35, 5.54 * 5, "инженерный, повышенная жёсткость"],
  "BIOCIDE PETG": [1.27, 2.86 * 5, "антибактериальный"],
  "TPU GF (нов)": [1.25, 4.81 * 5, "гибкий, усиленный стеклом"],
  "PA 1284": [1.13, 9.56 * 5, "прочный, инженерный"],
  "PEEK (500г)": [1.32, 50.77 * 5, "высокотемпературный, суперполимер"],
  "PEEK CF (500г)": [1.42, 56.74 * 5, "PEEK армированный углём"],
  "PEEK GF (500г)": [1.5, 59.77 * 5, "PEEK армированный стеклом"],
  SBS: [1.04, 2.02 * 5, "ударопрочный, прозрачный"],
  "PC GF": [1.3, 4.25 * 5, "жаропрочный, армированный стеклом"],
  PVDF: [1.75, 60.36 * 5, "фторопласт, химстойкий"],
  PVA: [1.22, 5.39 * 5, "водорастворимый, для поддержек"],
  ULTRAX: [1.4, 8.03 * 5, "инженерный, износостойкий"],
  "PP GF": [1.1, 4.46 * 5, "полипропилен армированный стеклом"],
  "PEI 9085": [1.27, 65.53 * 5, "авиационный, термостойкий"],
  PA12: [1.01, 10.41 * 5, "нейлон, инженерный"],
  PSU: [1.24, 18.84 * 5, "инженерный, термостойкий"],
};

// 2. Получение chatId: сперва из URL-параметра, иначе из Telegram WebApp
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
let chatId = getParam("chatId") || null;

if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  const data = tg.initDataUnsafe || {};
  chatId = chatId || data.chat?.id || data.user?.id || null;
  console.log("Telegram chatId =", chatId);
}

// 3. URL вашего N8N webhook
const N8N_WEBHOOK_URL =
  "https://bethichurig.beget.app/webhook/fd84ea85-fa6e-4b76-bbaa-8b8241d839c4";

// 4. После загрузки DOM вешаем все обработчики и запускаем первичный расчёт
document.addEventListener("DOMContentLoaded", () => {
  // фильтрация материалов и стартовый расчёт
  populateMaterials();
  calculate();

  // поиск по описанию
  document
    .getElementById("materialFilter")
    .addEventListener("input", populateMaterials);

  // смена материала
  document.getElementById("material").addEventListener("change", () => {
    updateMaterialInfo();
    calculate();
  });

  // ввод числовых значений
  ["massValue", "quantity", "length", "width", "height", "fill"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", calculate);
    }
  );

  // переключатели массы/габаритов
  document.getElementById("btnMass").addEventListener("click", () => {
    document.getElementById("btnMass").classList.add("active");
    document.getElementById("btnVolume").classList.remove("active");
    document.getElementById("massInput").style.display = "flex";
    document.getElementById("volumeInput").style.display = "none";
    calculate();
  });
  document.getElementById("btnVolume").addEventListener("click", () => {
    document.getElementById("btnVolume").classList.add("active");
    document.getElementById("btnMass").classList.remove("active");
    document.getElementById("volumeInput").style.display = "flex";
    document.getElementById("massInput").style.display = "none";
    calculate();
  });

  // кнопки категорий
  document.querySelectorAll("#filterButtons button").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.textContent.replace(/[🔍🧱🧘‍♂️🔬]/g, "").trim();
      document.getElementById("materialFilter").value = category;
      populateMaterials();
    });
  });

  // переключение табов
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => (c.style.display = "none"));
      btn.classList.add("active");
      document.getElementById(tabId).style.display = "block";
    });
  });

  // кнопка отправки
  const formButton = document.getElementById("sendBtn");
  formButton.addEventListener("click", (e) => {
    e.preventDefault();
    sendToN8N();
  });
});

// 5. Функция отправки данных в N8N
async function sendToN8N() {
  const name = document.getElementById("userName").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  const task = document.getElementById("userTask").value.trim();
  const dims = document.getElementById("userDims").value.trim();
  if (!name || !phone || !task || !dims) {
    return alert("Пожалуйста, заполните все поля перед отправкой.");
  }

  const payload = { name, phone, task, dims, chatId };
  const formButton = document.getElementById("sendBtn");
  formButton.disabled = true;
  formButton.textContent = "Отправка...";

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(res.status);
    alert("Заявка успешно отправлена!");
    ["userName", "userPhone", "userTask", "userDims"].forEach(
      (id) => (document.getElementById(id).value = "")
    );
  } catch (err) {
    console.error(err);
    alert("Ошибка отправки. Попробуйте ещё раз.");
  } finally {
    formButton.disabled = false;
    formButton.textContent = "Отправить";
  }
}

// 6. Заполнение списка материалов
function populateMaterials() {
  const filter = document.getElementById("materialFilter").value.toLowerCase();
  const sel = document.getElementById("material");
  sel.innerHTML = "";
  for (const key in materials) {
    const [_, price, desc] = materials[key];
    if (desc.toLowerCase().includes(filter)) {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = `${key} (${desc})`;
      if (price > 100) {
        opt.style.color = "red";
        opt.style.fontWeight = "bold";
      }
      sel.appendChild(opt);
    }
  }
  updateMaterialInfo();
}

// 7. Показ информации о выбранном материале
function updateMaterialInfo() {
  const sel = document.getElementById("material").value;
  if (!materials[sel]) return;
  const [density, price, desc] = materials[sel];
  document.getElementById("materialInfo").innerHTML =
    `Плотность: ${density} г/см³ • Цена за грамм: ${price.toFixed(2)} ₽<br>` +
    `<i>Описание: ${desc}</i>`;
}

// 8. Расчёт стоимости
function calculate() {
  const sel = document.getElementById("material").value;
  if (!materials[sel]) return;
  const [density, price] = materials[sel];
  const isMass = document
    .getElementById("btnMass")
    .classList.contains("active");
  let mass = 0,
    extra = "",
    connCost = 0;
  const qty = parseInt(document.getElementById("quantity").value, 10) || 1;

  if (isMass) {
    const mv = parseFloat(document.getElementById("massValue").value);
    if (!isNaN(mv)) mass = mv;
  } else {
    const l = parseFloat(document.getElementById("length").value);
    const w = parseFloat(document.getElementById("width").value);
    const h = parseFloat(document.getElementById("height").value);
    const f = parseFloat(document.getElementById("fill").value);
    if (!isNaN(l) && !isNaN(w) && !isNaN(h) && !isNaN(f)) {
      const vol = ((l * w * h) / 1000) * (f / 100);
      mass = vol * density;
      const parts = [
        l > 300 ? Math.ceil(l / 300) : 1,
        w > 300 ? Math.ceil(w / 300) : 1,
        h > 300 ? Math.ceil(h / 300) : 1,
      ].reduce((a, b) => a * b, 1);
      if (parts > 1) {
        const joins = parts - 1;
        connCost = 2500 + (joins - 1) * 1000;
        extra =
          `<br><span style="color:red;">Деталь будет частями; ` +
          `Стоимость соединений: ${connCost} ₽</span>`;
      }
    }
  }

  mass *= qty;
  const cost = Math.max(mass * price + connCost * qty, 2500);
  const html =
    `Масса модели: ${mass.toFixed(2)} г<br>` +
    `Стоимость: ${cost.toFixed(2)} ₽${extra}`;
  document.getElementById("result").innerHTML = html;
  // plain text для textarea
  document.getElementById("userDims").value = html
    .replace(/<br>/g, "\n")
    .replace(/<[^>]+>/g, "");
}

// 9. Фильтрация по категории (не используется напрямую, кнопки сами вызывают populateMaterials)
function filterCategory(keyword) {
  document.getElementById("materialFilter").value = keyword;
  populateMaterials();
}
