const chatId = "-1002281140737";
const bot_token = "7823044722:AAFDABugUQumkCrUSMMUqxpWIWF5zTPd9BI";
const uri_api_tg = `https://api.telegram.org/bot${bot_token}/sendMessage`;

window.addEventListener("load", function () {
  function resize() {
    let text = document.getElementsByClassName("width-text");
    if (!text) return;

    for (let i = 0; i < text.length; i++) {
      let string = text[i].innerHTML.replace(/<[^>]+>/g, ""); // Удаляем теги
      let fontSize =
        ((text[i].offsetWidth / string.length) * 1.31).toFixed() + "px";
      text[i].style.fontSize = fontSize;
      text[i].style.lineHeight = fontSize;

      let textAfter = document.getElementsByClassName("width-text-after")[0];
      if (textAfter) {
        textAfter.style.fontSize = fontSize;
        textAfter.style.lineHeight = fontSize;
      }
    }
  }
  window.addEventListener("resize", resize);
  resize();

  function validateForm(name, phone, errorEl) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/; // Только буквы и пробелы
    const phoneRegex = /^\d{8,}$/; // Только цифры, минимум 8

    if (!nameRegex.test(name)) {
      errorEl.innerHTML = "Имя должно содержать только буквы";
      errorEl.style.display = "block";
      return false;
    }

    if (!phoneRegex.test(phone)) {
      errorEl.innerHTML =
        "Телефон должен содержать минимум 8 цифр и не содержать букв";
      errorEl.style.display = "block";
      return false;
    }

    errorEl.style.display = "none";
    errorEl.innerHTML = "";
    return true;
  }

  function setupFormValidation(form) {
    form.addEventListener("submit", function (event) {
      event.stopPropagation();
      event.preventDefault();

      let name = form.inputName.value.trim();
      let phone = form.inputPhone.value.trim();
      let errorEl = form.querySelector(".error-text");
      let sendBtn = form.querySelector("#send-btn-id");

      if (!validateForm(name, phone, errorEl)) return;

      let message = `Клиентская заявка с сайта\n\nОтправитель: ${name}\nТелефон: ${phone}\n`;

      sendBtn.disabled = true;
      axios
        .post(uri_api_tg, {
          chat_id: chatId,
          parse_mode: "html",
          text: message,
        })
        .then(() => {
          requestModal.hide();
          form.reset();
          var toastLive = document.getElementById("liveToast");
          new bootstrap.Toast(toastLive).show();
        })
        .catch(() => {
          errorEl.innerHTML = "Ошибка при отправке формы";
          errorEl.style.display = "block";
        })
        .finally(() => {
          sendBtn.disabled = false;
        });
    });
  }

  var requestModal =
    document.getElementById("requestModal") &&
    new bootstrap.Modal(document.getElementById("requestModal"), {
      keyboard: false,
    });

  const requestForm = document.getElementById("request-form");
  requestForm && setupFormValidation(requestForm);

  document.querySelectorAll("input[name='phone']").forEach((input) => {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, ""); // Удаляет все нечисловые символы
    });
  });

  const vacancyForms = {
    driversForm: "водитель",
    logistsForm: "логист",
    accountantsForm: "бухгалтер",
  };

  Object.keys(vacancyForms).forEach((formId) => {
    let form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.stopPropagation();
      event.preventDefault();

      let formData = new FormData(event.target);
      let name = formData.get("name").trim();
      let phone = formData.get("phone").trim();
      let vacancy = vacancyForms[formId];
      let errorEl = form.querySelector(".error-text");
      let sendBtn = form.querySelector(".send-contact");

      if (!validateForm(name, phone, errorEl)) return;

      let message = `Заявка с сайта по вакансии\n\nПозиция: ${vacancy}\n\nОтправитель: ${name}\nТелефон: ${phone}\n`;

      sendBtn.disabled = true;
      axios
        .post(uri_api_tg, {
          chat_id: chatId,
          parse_mode: "html",
          text: message,
        })
        .then(() => {
          form.reset();
          var toastLive = document.getElementById("liveToast");
          new bootstrap.Toast(toastLive).show();
        })
        .catch(() => {
          errorEl.innerHTML = "Ошибка при отправке формы";
          errorEl.style.display = "block";
        })
        .finally(() => {
          sendBtn.disabled = false;
        });
    });
  });
});
