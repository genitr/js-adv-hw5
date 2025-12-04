import { Tooltip } from "./widgets/tooltip";

// Создаем экземпляр Tooltip для основной подсказки
const tooltip = new Tooltip();

// Создаем дополнительный экземпляр для сообщений об ошибках
const errorTooltip = new Tooltip();

// Получаем элементы формы
const submitBtn = document.getElementById("submit-btn");
const titleInput = document.getElementById("tooltip-title");
const contentInput = document.getElementById("tooltip-content");

// Функция для показа сообщения об ошибке
function showError(message) {
  errorTooltip.show(submitBtn, "Ошибка", message, {
    placement: "top",
    type: "warning",
    adaptiveWidth: true,
  });

  // Автоматически скрываем ошибку через 3 секунды
  setTimeout(() => {
    errorTooltip.hide();
  }, 3000);
}

// Обработчик для кнопки submit
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Скрываем предыдущую ошибку, если есть
  if (errorTooltip.isVisible()) {
    errorTooltip.hide();
  }

  // Получаем выбранную позицию
  const placementRadio = document.querySelector(
    'input[name="placement"]:checked',
  );
  const placement = placementRadio ? placementRadio.value : "top";

  // Получаем выбранный тип
  const typeRadio = document.querySelector('input[name="type"]:checked');
  const type = typeRadio ? typeRadio.value : "default";

  // Получаем данные из полей ввода
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  // Проверяем, что есть хотя бы один текст
  if (!title && !content) {
    showError("Пожалуйста, введите заголовок или текст подсказки");
    return;
  }

  // Проверяем максимальную длину
  if (content.length > 500) {
    showError("Текст подсказки не должен превышать 500 символов");
    return;
  }

  // Если уже есть основная подсказка - скрываем ее
  if (tooltip.isVisible()) {
    tooltip.hide();
    return;
  }

  // Показываем подсказку
  tooltip.show(submitBtn, title, content, {
    placement: placement,
    type: type,
    adaptiveWidth: true,
  });
});

// Закрываем подсказки при клике вне их
document.addEventListener("click", (e) => {
  const isTooltip = e.target.closest(".tooltip");
  const isSubmitBtn = e.target === submitBtn;

  if (tooltip.isVisible() && !isTooltip && !isSubmitBtn) {
    tooltip.hide();
  }

  if (errorTooltip.isVisible() && !isTooltip && !isSubmitBtn) {
    errorTooltip.hide();
  }
});

// Закрываем подсказки при нажатии Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (tooltip.isVisible()) {
      tooltip.hide();
    }
    if (errorTooltip.isVisible()) {
      errorTooltip.hide();
    }
  }
});

// Скрываем подсказки при фокусе на поля ввода
titleInput.addEventListener("focus", () => {
  if (tooltip.isVisible()) {
    tooltip.hide();
  }
});

contentInput.addEventListener("focus", () => {
  if (tooltip.isVisible()) {
    tooltip.hide();
  }
});

// Обработчики для радио кнопок (скрываем подсказку при изменении позиции/типа)
document.querySelectorAll('input[name="placement"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    if (tooltip.isVisible()) {
      tooltip.hide();
    }
  });
});

document.querySelectorAll('input[name="type"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    if (tooltip.isVisible()) {
      tooltip.hide();
    }
  });
});

// Дополнительная валидация при вводе текста
contentInput.addEventListener("input", () => {
  if (errorTooltip.isVisible()) {
    errorTooltip.hide();
  }
});

titleInput.addEventListener("input", () => {
  if (errorTooltip.isVisible()) {
    errorTooltip.hide();
  }
});
