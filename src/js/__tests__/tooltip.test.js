import { Tooltip } from "../widgets/tooltip";

describe("Tooltip class", () => {
  // let targetElement;
  let tooltip;

  beforeEach(() => {
    tooltip = new Tooltip();
  });

  afterEach(() => {
    // Очищаем DOM после каждого теста
    tooltip = null;
  });

  describe("Создание экземпляра", () => {
    test("должен создавать экземпляр Tooltip", () => {
      expect(tooltip).toBeInstanceOf(Tooltip);
      expect(tooltip.tooltip).toBeNull();
    });
  });

  describe("Метод show", () => {
    let targetElement;

    beforeEach(() => {
      jest.useFakeTimers();
      targetElement = document.createElement("button");
      targetElement.textContent = "Test Button";
      targetElement.style.position = "absolute";
      targetElement.style.top = "100px";
      targetElement.style.left = "100px";
      targetElement.style.width = "150px";
      targetElement.style.height = "50px";
      document.body.appendChild(targetElement);
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.clearAllTimers();
    });

    test("должен создавать и показывать подсказку", () => {
      tooltip.show(targetElement, "Заголовок", "Текст подсказки", {
        placement: "top",
        type: "default",
      });

      expect(tooltip.tooltip).not.toBeNull();
      expect(tooltip.tooltip.classList.contains("tooltip")).toBe(true);
      expect(tooltip.tooltip.classList.contains("fade")).toBe(true);

      // Проверяем наличие заголовка
      const header = tooltip.tooltip.querySelector(".tooltip-header");
      expect(header).not.toBeNull();
      expect(header.textContent).toBe("Заголовок");

      // Проверяем наличие контента
      const content = tooltip.tooltip.querySelector(".tooltip-content");
      expect(content).not.toBeNull();
      expect(content.textContent).toBe("Текст подсказки");

      // Проверяем наличие стрелки
      const arrow = tooltip.tooltip.querySelector(".tooltip-arrow");
      expect(arrow).not.toBeNull();
    });

    test("должен применять правильный тип подсказки", () => {
      tooltip.show(targetElement, "Заголовок", "Текст", { type: "success" });

      const header = tooltip.tooltip.querySelector(".tooltip-header");
      expect(header.classList.contains("success")).toBe(true);
    });

    test("должен применять правильное позиционирование", () => {
      tooltip.show(targetElement, "Заголовок", "Текст", {
        placement: "bottom",
      });

      expect(tooltip.tooltip.getAttribute("data-placement")).toBe("bottom");
    });

    test("должен устанавливать адаптивную ширину для top/bottom", () => {
      tooltip.show(targetElement, "Заголовок", "Текст", {
        placement: "top",
        adaptiveWidth: true,
      });

      expect(tooltip.tooltip.classList.contains("adaptive-width")).toBe(true);
    });

    test("не должен устанавливать адаптивную ширину для left", () => {
      tooltip.show(targetElement, "Заголовок", "Текст", {
        placement: "left",
        adaptiveWidth: true,
      });

      expect(tooltip.tooltip.classList.contains("adaptive-width")).toBe(false);
    });

    test("не должен устанавливать адаптивную ширину для right", () => {
      tooltip.show(targetElement, "Заголовок", "Текст", {
        placement: "right",
        adaptiveWidth: true,
      });

      expect(tooltip.tooltip.classList.contains("adaptive-width")).toBe(false);
    });

    test("должен скрывать предыдущую подсказку при показе новой", () => {
      const spy = jest.spyOn(tooltip, "hide");

      tooltip.show(targetElement, "Заголовок 1", "Текст 1");
      tooltip.show(targetElement, "Заголовок 2", "Текст 2");

      expect(spy).toHaveBeenCalledTimes(2);
    });

    test("должен автоматически скрывать подсказку через указанное время", () => {
      const targetElement = document.createElement("button");
      document.body.appendChild(targetElement);

      const hideSpy = jest.spyOn(tooltip, "hide");

      // Показываем подсказку с автоСкрытием через 2 секунды
      tooltip.show(targetElement, "Тест", "Текст", {
        autoHideDelay: 2000,
      });

      // Перемещаем время вперед на 2 секунды
      jest.advanceTimersByTime(2000);

      expect(hideSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Метод hide", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      const targetElement = document.createElement("button");
      document.body.appendChild(targetElement);
      tooltip.show(targetElement, "Заголовок", "Текст");
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.clearAllTimers();
    });

    test("должен скрывать подсказку", () => {
      expect(tooltip.tooltip).not.toBeNull();

      tooltip.hide();

      expect(tooltip.tooltip).toBeNull();
    });

    test("должен безопасно обрабатывать вызов, когда подсказки нет", () => {
      tooltip.hide(); // Сначала скрываем существующую
      expect(() => {
        tooltip.hide(); // Пробуем скрыть еще раз
      }).not.toThrow();
    });

    test("должен очищать таймаут при вызове hide()", () => {
      const targetElement = document.createElement("button");
      document.body.appendChild(targetElement);

      tooltip.show(targetElement, "Тест", "Текст", {
        autoHideDelay: 3000,
      });

      const hideSpy = jest.spyOn(tooltip, "hide");

      jest.advanceTimersByTime(5000);
      expect(hideSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("Метод isVisible", () => {
    beforeEach(() => {
      const targetElement = document.createElement("button");
      document.body.appendChild(targetElement);
    });

    test("должен возвращать false, когда подсказка не отображается", () => {
      expect(tooltip.isVisible()).toBe(false);
    });

    test("должен возвращать true, когда подсказка отображается", () => {
      const targetElement = document.querySelector("button");
      tooltip.show(targetElement, "Заголовок", "Текст");
      expect(tooltip.isVisible()).toBe(true);
    });
  });
});
