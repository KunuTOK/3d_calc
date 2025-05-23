document.addEventListener("DOMContentLoaded", () => {
  // Hide consent checkbox and set it to checked
  const consentCheckbox = document.getElementById("consentCheckbox");
  if (consentCheckbox) {
    consentCheckbox.style.display = "none";
    consentCheckbox.checked = true;
  }

  // Hide consent text and operator info
  const checkboxGroup = document.querySelector(".checkbox-group");
  const operatorInfo = document.querySelector(".operator-info");
  if (checkboxGroup) {
    checkboxGroup.style.display = "none";
  }
  if (operatorInfo) {
    operatorInfo.style.display = "none";
  }

  // Enable send button by default
  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) {
    sendBtn.disabled = false;
  }

  // Данные материалов
  const materials = {
    PLA: [1.24, 2.42 * 5, "базовый, низкая химостойкость, неустойчив к УФ"],
    PETG: [1.27, 1.35 * 5, "жесткий, прочный, умеренная химостойкость"],
    "PETG GF": [
      1.3,
      2.71 * 5,
      "инженерный, армирован стеклом, усто к УФ и химии",
    ],
    "PETG CF": [1.3, 3.0 * 5, "инженерный, армирован углем, усто к УФ и химии"],
    "TPU 60A": [1.2, 1.8 * 5, "гибкий, эластичный"],
    "TPU 75A": [1.2, 2.0 * 5, "гибкий средней жёсткости"],
    "TPU 95A": [1.2, 2.2 * 5, "жесткий, прочный"],
    "EASY FLEX": [1.18, 1.5 * 5, "упрощённая печать"],
    "SOFT FLEX": [1.18, 1.6 * 5, "особо мягкий"],
    "TPU HT": [1.2, 4.0 * 5, "высокотемпературный до 100°C"],
    "TPU CR": [1.2, 4.5 * 5, "химически стойкий"],
    PA6: [
      1.14,
      4.05 * 5,
      "инженерный, высокая химостойкость, устойчив к бензинам; неустойчив к УФ",
    ],
    PA12: [
      1.01,
      10.41 * 5,
      "нейлон, усто к спиртам, умеренная УФ-устойчивость",
    ],
    ABS: [
      1.05,
      1.79 * 5,
      "жесткий, устойчив к бензинам и лакокрасочным покрытиям; неустойчив к УФ",
    ],
    HIPS: [
      1.04,
      2.12 * 5,
      "жесткий, растворим в лимонене, низкая химостойкость",
    ],
    PC: [1.2, 4.25 * 5, "жаропрочный, высокая УФ-устойчивость"],
    PP: [
      0.9,
      5.38 * 5,
      "полипропилен, химически стойкий, устойчив к бензинам; неустойчив к УФ",
    ],
    PVA: [1.22, 5.39 * 5, "водорастворимый, вспомогательный"],
    PA1284: [1.13, 9.56 * 5, "инженерный, устойчив к УФ и химии"],
    SBS: [1.04, 2.02 * 5, "ударопрочный, прозрачный; средняя химостойкость"],
    ULTRAX: [1.4, 8.03 * 5, "POM, высокая износостойкость, усто к УФ и химии"],
    "PC GF": [1.3, 4.25 * 5, "армирован стеклом, усто к УФ"],
    "PP GF": [1.1, 4.46 * 5, "армирован стеклом, высокая химостойкость"],
    BIOCIDE: [1.27, 2.86 * 5, "антибактериальный, средняя химостойкость"],
  };
  // Элементы формы
  const el = {
    filterButtons: document.getElementById("filterButtons"),
    material: document.getElementById("material"),
    materialInfo: document.getElementById("materialInfo"),
    massBtn: document.getElementById("massTabBtn"),
    volBtn: document.getElementById("volumeTabBtn"),
    massTab: document.getElementById("massTab"),
    volTab: document.getElementById("volumeTab"),
    shapeBtns: document.getElementById("shapeButtons"),
    shapeInputs: document.querySelectorAll(".shape-inputs > [data-shape]"),
    massVal: document.getElementById("massValue"),
    length: document.getElementById("length"),
    width: document.getElementById("width"),
    height: document.getElementById("height"),
    diam: document.getElementById("diameter"),
    cylH: document.getElementById("cylHeight"),
    coneD: document.getElementById("coneDia"),
    coneH: document.getElementById("coneHeight"),
    sphereD: document.getElementById("sphereDia"),
    oD: document.getElementById("outerDia"),
    iD: document.getElementById("innerDia"),
    rH: document.getElementById("ringHeight"),
    qty: document.getElementById("quantity"),
    fill: document.getElementById("fill"),
    qualBtns: document.getElementById("qualityButtons"),
    result: document.getElementById("result"),
    total: document.getElementById("total"),
    toggleDetails: document.getElementById("toggleDetails"),
    details: document.getElementById("details"),
    userPlastic: document.getElementById("userPlastic"),
    userMass: document.getElementById("userMass"),
    userVolume: document.getElementById("userVolume"),
    userQuantity: document.getElementById("userQuantity"),
    userFill: document.getElementById("userFill"),
    userQuality: document.getElementById("userQuality"),
    userName: document.getElementById("userName"),
    userPhone: document.getElementById("userPhone"),
    userEmail: document.getElementById("userEmail"),
    userMedia: document.getElementById("userMedia"),
    userTemp: document.getElementById("userTemp"),
    deadline: document.getElementById("deadline"),
    statusMsg: document.getElementById("statusMsg"),
    sendBtn: document.getElementById("sendBtn"),
    detailName: document.getElementById("detailName"),
    workDesc: document.getElementById("workDesc"),
  };
  // Функция наполнения списка материалов с фильтрацией
  function populateMaterials(type = "all") {
    el.material.innerHTML = "";
    Object.entries(materials).forEach(([name, [density, price, desc]]) => {
      if (type === "all" || desc.toLowerCase().includes(type)) {
        el.material.add(
          new Option(`${name} (${price.toFixed(2)} ₽/г) — ${desc}`, name)
        );
      }
    });
  }
  // Инициализация списка материалов
  populateMaterials();
  // Обработчик кнопок фильтрации
  el.filterButtons.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      el.filterButtons
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      populateMaterials(e.target.dataset.type);
      calc();
    }
  });
  // Переключение Масса/Габариты
  el.massBtn.addEventListener("click", () => {
    el.massBtn.classList.add("active");
    el.volBtn.classList.remove("active");
    el.massTab.classList.remove("hidden");
    el.volTab.classList.add("hidden");
    calc();
  });
  el.volBtn.addEventListener("click", () => {
    el.volBtn.classList.add("active");
    el.massBtn.classList.remove("active");
    el.volTab.classList.remove("hidden");
    el.massTab.classList.add("hidden");
    calc();
  });
  // Обработчики форм
  el.material.addEventListener("change", calc);
  el.shapeBtns.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      el.shapeBtns
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      el.shapeInputs.forEach((div) =>
        div.classList.toggle(
          "hidden",
          div.dataset.shape !== e.target.dataset.shape
        )
      );
      calc();
    }
  });
  el.qualBtns.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      el.qualBtns
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      calc();
    }
  });
  ["input", "change"].forEach((evt) => {
    [
      el.massVal,
      el.length,
      el.width,
      el.height,
      el.diam,
      el.cylH,
      el.coneD,
      el.coneH,
      el.sphereD,
      el.oD,
      el.iD,
      el.rH,
      el.qty,
      el.fill,
      el.deadline,
    ].forEach((inp) => inp && inp.addEventListener(evt, calc));
  });
  // Функция расчёта
  function calc() {
    const sel = el.material.value;
    if (!materials[sel]) {
      el.result.textContent = "Выберите материал.";
      return;
    }
    const [dens, price] = materials[sel];
    let mass = 0;
    let hasError = false;
    let errorMessage = "";

    if (el.massBtn.classList.contains("active")) {
      mass = parseFloat(el.massVal.value) || 0;
      if (mass < 0) {
        hasError = true;
        errorMessage = "Масса не может быть отрицательной";
      }
    } else {
      const shape = el.shapeBtns.querySelector("button.active").dataset.shape;
      switch (shape) {
        case "box":
          if (
            el.length.value < 0 ||
            el.width.value < 0 ||
            el.height.value < 0
          ) {
            hasError = true;
            errorMessage = "Размеры не могут быть отрицательными";
          } else if (
            el.length.value === 0 ||
            el.width.value === 0 ||
            el.height.value === 0
          ) {
            hasError = true;
            errorMessage = "Все размеры должны быть больше нуля";
          } else {
            mass =
              (((el.length.value || 0) *
                (el.width.value || 0) *
                (el.height.value || 0)) /
                1000) *
              dens;
          }
          break;
        case "cylinder":
          if (el.diam.value < 0 || el.cylH.value < 0) {
            hasError = true;
            errorMessage = "Размеры не могут быть отрицательными";
          } else if (el.diam.value === 0 || el.cylH.value === 0) {
            hasError = true;
            errorMessage = "Диаметр и высота должны быть больше нуля";
          } else {
            mass =
              ((Math.PI * (el.diam.value / 2) ** 2 * (el.cylH.value || 0)) /
                1000) *
              dens;
          }
          break;
        case "cone":
          if (el.coneD.value < 0 || el.coneH.value < 0) {
            hasError = true;
            errorMessage = "Размеры не могут быть отрицательными";
          } else if (el.coneD.value === 0 || el.coneH.value === 0) {
            hasError = true;
            errorMessage = "Диаметр и высота должны быть больше нуля";
          } else {
            mass =
              ((Math.PI * (el.coneD.value / 2) ** 2 * (el.coneH.value || 0)) /
                3000) *
              dens;
          }
          break;
        case "sphere":
          if (el.sphereD.value < 0) {
            hasError = true;
            errorMessage = "Диаметр не может быть отрицательным";
          } else if (el.sphereD.value === 0) {
            hasError = true;
            errorMessage = "Диаметр должен быть больше нуля";
          } else {
            mass =
              (((4 / 3) * Math.PI * (el.sphereD.value / 2) ** 3) / 1000) * dens;
          }
          break;
        case "ring":
          if (el.oD.value < 0 || el.iD.value < 0 || el.rH.value < 0) {
            hasError = true;
            errorMessage = "Размеры не могут быть отрицательными";
          } else if (
            el.oD.value === 0 ||
            el.iD.value === 0 ||
            el.rH.value === 0
          ) {
            hasError = true;
            errorMessage = "Все размеры должны быть больше нуля";
          } else if (parseFloat(el.oD.value) <= parseFloat(el.iD.value)) {
            hasError = true;
            errorMessage = "Внешний диаметр должен быть больше внутреннего";
          } else {
            mass =
              ((Math.PI *
                ((el.oD.value / 2) ** 2 - (el.iD.value / 2) ** 2) *
                (el.rH.value || 0)) /
                1000) *
              dens;
          }
          break;
      }
    }

    if (hasError) {
      el.result.innerHTML = `<span style="color: #f44336;">${errorMessage}</span>`;
      el.total.classList.add("hidden");
      if (el.userMass) el.userMass.value = "0 г";
      if (el.userVolume) el.userVolume.innerHTML = "Размеры: -<br>Объем: - см³";
      return;
    }

    const fillFactor = Math.min(Math.max(el.fill.value, 1), 100) / 100;
    const qualityMap = { 0.4: 0.77, 0.2: 1, 0.1: 1.64 };
    const qFactor =
      qualityMap[el.qualBtns.querySelector("button.active").dataset.quality];
    const totalMass = mass * fillFactor;
    const qty = Math.max(parseInt(el.qty.value) || 1, 1);
    const cost = totalMass * price * qty * qFactor;
    el.result.innerHTML = `Ориентировочная стоимость: ${cost.toFixed(
      2
    )} ₽<br>Минимальный заказ 2500 рублей<br><small>Расчет примерный. Менеджер позвонит для подтверждения заказа</small>`;
    const factor = parseFloat(el.deadline.value) || 1;
    const final = cost * factor;
    el.total.classList.remove("hidden");
    el.total.innerHTML = `Итого: ${final.toFixed(2)} ₽`;
    // Заполнение полей заявки
    if (el.userPlastic) el.userPlastic.value = sel;
    if (el.userMass) el.userMass.value = `${totalMass.toFixed(2)} г`;
    if (el.userVolume) {
      const shape = el.shapeBtns.querySelector("button.active").dataset.shape;
      let dimensions = "-";
      let volume = "-";

      if (!el.volTab.classList.contains("hidden")) {
        switch (shape) {
          case "box":
            dimensions = `${el.length.value || 0}х${el.width.value || 0}х${
              el.height.value || 0
            } мм`;
            volume = `${(
              ((el.length.value || 0) *
                (el.width.value || 0) *
                (el.height.value || 0)) /
              1000
            ).toFixed(1)}`;
            break;
          case "cylinder":
            dimensions = `Ø${el.diam.value || 0}х${el.cylH.value || 0} мм`;
            volume = `${(
              (Math.PI * (el.diam.value / 2) ** 2 * (el.cylH.value || 0)) /
              1000
            ).toFixed(1)}`;
            break;
          case "cone":
            dimensions = `Ø${el.coneD.value || 0}х${el.coneH.value || 0} мм`;
            volume = `${(
              (Math.PI * (el.coneD.value / 2) ** 2 * (el.coneH.value || 0)) /
              3000
            ).toFixed(1)}`;
            break;
          case "sphere":
            dimensions = `Ø${el.sphereD.value || 0} мм`;
            volume = `${(
              ((4 / 3) * Math.PI * (el.sphereD.value / 2) ** 3) /
              1000
            ).toFixed(1)}`;
            break;
          case "ring":
            dimensions = `Ø${el.oD.value || 0}х${el.iD.value || 0}х${
              el.rH.value || 0
            } мм`;
            volume = `${(
              (Math.PI *
                ((el.oD.value / 2) ** 2 - (el.iD.value / 2) ** 2) *
                (el.rH.value || 0)) /
              1000
            ).toFixed(1)}`;
            break;
        }
      }
      el.userVolume.innerHTML = `Размеры: ${dimensions}<br>Объем: ${volume} см³`;
    }
    if (el.userQuantity) el.userQuantity.value = qty;
    if (el.userFill)
      el.userFill.value = `${Math.min(Math.max(el.fill.value, 1), 100)}%`;
    if (el.userQuality)
      el.userQuality.value =
        el.qualBtns.querySelector("button.active").textContent;
  }
  calc();
  // Телефон и email валидация при вводе
  const phone = document.getElementById("userPhone");
  phone.addEventListener("input", () => {
    let v = phone.value.replace(/[^0-9+]/g, "");
    if (v.startsWith("8")) v = "7" + v.slice(1);
    phone.value = v;
  });
  document.getElementById("sendBtn").addEventListener("click", (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = {
      userName: "имя",
      userPhone: "телефон",
      userEmail: "email",
      detailName: "название детали",
    };

    let hasError = false;
    let errorMessage = "";

    for (const [fieldId, fieldName] of Object.entries(requiredFields)) {
      const field = document.getElementById(fieldId);
      if (!field || !field.value.trim()) {
        hasError = true;
        errorMessage = `Пожалуйста, заполните поле "${fieldName}"`;
        break;
      }
    }

    // Validate phone number format
    if (phone && !/^\+7\d{10}$/.test(phone.value)) {
      hasError = true;
      errorMessage = "Телефон введён неверно";
    }

    // Validate email format
    const email = document.getElementById("userEmail");
    if (email && !email.checkValidity()) {
      hasError = true;
      errorMessage = "Email введён неверно";
    }

    if (hasError) {
      alert(errorMessage);
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("name", el.userName.value);
    formData.append("phone", el.userPhone.value);
    formData.append("email", el.userEmail.value);
    formData.append("media", el.userMedia.value);
    formData.append("temp", el.userTemp.value);
    formData.append(
      "deadline",
      el.deadline.options[el.deadline.selectedIndex].text
    );
    formData.append("plastic", el.userPlastic.value);
    formData.append("mass", el.userMass.value);
    formData.append(
      "volume",
      el.volTab.classList.contains("hidden")
        ? "-"
        : `${
            ((el.length.value || 0) *
              (el.width.value || 0) *
              (el.height.value || 0)) /
            1000
          } см³`
    );
    formData.append(
      "dimensions",
      el.volTab.classList.contains("hidden")
        ? "-"
        : `${el.length.value || 0}х${el.width.value || 0}х${
            el.height.value || 0
          } мм`
    );
    formData.append("quantity", el.userQuantity.value);
    formData.append("fill", el.userFill.value);
    formData.append("quality", el.userQuality.value);
    formData.append("total", el.total.textContent);
    formData.append("detailName", el.detailName.value);
    formData.append("workDesc", el.workDesc.value);

    // Add file if selected
    const fileInput = document.getElementById("workFile");
    if (fileInput.files.length > 0) {
      formData.append("workFile", fileInput.files[0]);
    }

    // Disable the button and show loading state
    el.sendBtn.disabled = true;
    el.statusMsg.textContent = "Отправка...";

    fetch(
      "https://bethichurig.beget.app/webhook/fd84ea85-fa6e-4b76-bbaa-8b8241d839c4",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        el.statusMsg.textContent = "Заявка успешно отправлена";
        el.statusMsg.style.color = "#4caf50";
        // Reset form
        el.userName.value = "";
        el.userPhone.value = "";
        el.userEmail.value = "";
        el.userMedia.value = "Пищевка";
        el.userTemp.value = "комнатная";
        el.deadline.value = "0.95";
        el.detailName.value = "";
        el.workDesc.value = "";
        fileInput.value = ""; // Reset file input
      })
      .catch((error) => {
        console.error("Error details:", error);
        el.statusMsg.textContent = `Ошибка при отправке заявки: ${error.message}`;
        el.statusMsg.style.color = "#f44336";
      })
      .finally(() => {
        // Re-enable the button
        el.sendBtn.disabled = false;
      });
  });
  el.toggleDetails.addEventListener("click", () => {
    el.toggleDetails.classList.toggle("active");
    el.details.classList.toggle("hidden");
  });
});
