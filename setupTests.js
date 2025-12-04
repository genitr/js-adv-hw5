import "@testing-library/jest-dom";

// Мокаем методы которые могут отсутствовать в JSDOM
Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => "",
  }),
});
