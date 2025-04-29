const N8N_WEBHOOK_URL =
  "https://bethichurig.beget.app/webhook/fd84ea85-fa6e-4b76-bbaa-8b8241d839c4";

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

function sendToGoogleSheet() {
  const name = document.getElementById("userName").value.trim();
  const task = document.getElementById("userTask").value.trim();
  const dims = document.getElementById("userDims").value.trim();

  if (!name || !task || !dims) {
    alert("Пожалуйста, заполните все поля перед отправкой.");
    return;
  }

  const priceMatch = dims.match(/Стоимость: ([\d.]+)/);
  const price = priceMatch ? priceMatch[1] : "";

  fetch(
    "https://script.google.com/macros/s/AKfycbxTiUNSthR2Pv7Nuf5gfvEoA7HnW9wfSRA6PaACD0VLDNXZQiLvlRdWyHzUM2bFSKNuiA/exec",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        phone: "",
        comment: task,
        price: price,
        file: "",
      }),
    }
  )
    .then((res) => {
      alert("Заявка отправлена!");
      document.getElementById("userName").value = "";
      document.getElementById("userTask").value = "";
    })
    .catch((err) => {
      alert("Ошибка при отправке.");
      console.error(err);
    });
}

function populateMaterials() {
  const filter = document.getElementById("materialFilter").value.toLowerCase();
  const materialSelect = document.getElementById("material");
  materialSelect.innerHTML = "";
  for (const key in materials) {
    const [_, price, description] = materials[key];
    if (description.toLowerCase().includes(filter)) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = `${key} (${description})`;
      if (price > 100) {
        option.style.color = "red";
        option.style.fontWeight = "bold";
      }
      materialSelect.appendChild(option);
    }
  }
  updateMaterialInfo();
}

function updateMaterialInfo() {
  const selected = document.getElementById("material").value;
  if (!materials[selected]) return;
  const [density, price, description] = materials[selected];
  document.getElementById(
    "materialInfo"
  ).innerHTML = `Плотность: ${density} г/см³ • Цена за грамм: ${price.toFixed(
    2
  )} ₽<br><i>Описание: ${description}</i>`;
}

function filterCategory(keyword) {
  document.getElementById("materialFilter").value = keyword;
  populateMaterials();
}

function calculate() {
  const selected = document.getElementById("material").value;
  if (!materials[selected]) return;
  const [density, price] = materials[selected];
  const isMass = document
    .getElementById("btnMass")
    .classList.contains("active");
  let mass = 0;
  let extra = "";
  let connectionCost = 0;
  const qty = parseInt(document.getElementById("quantity").value) || 1;

  if (isMass) {
    const massVal = parseFloat(document.getElementById("massValue").value);
    if (!isNaN(massVal)) mass = massVal;
  } else {
    const l = parseFloat(document.getElementById("length").value);
    const w = parseFloat(document.getElementById("width").value);
    const h = parseFloat(document.getElementById("height").value);
    const f = parseFloat(document.getElementById("fill").value);
    if (!isNaN(l) && !isNaN(w) && !isNaN(h) && !isNaN(f)) {
      const volume_cm3 = ((l * w * h) / 1000) * (f / 100);
      mass = volume_cm3 * density;
      const xParts = l > 300 ? Math.ceil(l / 300) : 1;
      const yParts = w > 300 ? Math.ceil(w / 300) : 1;
      const zParts = h > 300 ? Math.ceil(h / 300) : 1;
      const totalParts = xParts * yParts * zParts;
      if (totalParts > 1) {
        const joins = totalParts - 1;
        connectionCost = 2500 + (joins - 1) * 1000;
        extra = `<br><span style='color:red;'>Деталь будет напечатана отдельными частями и соединена между собой.<br>Стоимость соединений: ${connectionCost} ₽</span>`;
      }
    }
  }

  mass *= qty;
  const cost = Math.max(mass * price + connectionCost * qty, 2500);
  const finalText = `Масса модели: ${mass.toFixed(2)} г
Стоимость: ${cost.toFixed(2)} ₽${extra.replace(/<[^>]+>/g, "")}`;
  document.getElementById("result").innerHTML = `Масса модели: ${mass.toFixed(
    2
  )} г<br>Стоимость: ${cost.toFixed(2)} ₽${extra}`;
  document.getElementById("userDims").value = finalText;
}

// Обработчики событий
document
  .getElementById("materialFilter")
  .addEventListener("input", populateMaterials);
document
  .getElementById("material")
  .addEventListener("change", updateMaterialInfo);
document
  .querySelectorAll("input")
  .forEach((el) => el.addEventListener("input", calculate));
document.getElementById("material").addEventListener("change", calculate);
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

// Вкладки
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = button.dataset.tab;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => (content.style.display = "none"));

    button.classList.add("active");
    document.getElementById(tabId).style.display = "block";
  });
});

// Add event listeners for filter buttons
const filterButtons = document.querySelectorAll("#filterButtons button");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.textContent.trim().replace(/[🔍🧱🧘‍♂️🔬]/g, "");
    filterCategory(category);
  });
});

// Add event listener for form submission
const formButton = document.getElementById("sendBtn");
formButton.addEventListener("click", (event) => {
  event.preventDefault();
  sendToN8N();
});

populateMaterials();
calculate();

async function sendToN8N() {
  const name = document.getElementById("userName").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  const task = document.getElementById("userTask").value.trim();
  const dims = document.getElementById("userDims").value.trim();

  if (!name || !phone || !task || !dims) {
    alert("Пожалуйста, заполните все поля перед отправкой.");
    return;
  }

  const payload = { name, phone, task, dims };

  formButton.disabled = true;
  formButton.textContent = "Отправка...";

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    alert("Заявка успешно отправлена в систему!");
    ["userName", "userPhone", "userTask", "userDims"].forEach(
      (id) => (document.getElementById(id).value = "")
    );
  } catch (err) {
    console.error(err);
    alert("Ошибка отправки в N8N. Попробуйте ещё раз.");
  } finally {
    formButton.disabled = false;
    formButton.textContent = "Отправить";
  }
}
