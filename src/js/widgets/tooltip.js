export class Tooltip {
  constructor() {
    this.tooltip = null;
  }

  show(targetElement, title, content, options = {}) {
    this.hide();

    const placement = options.placement || "top";
    const type = options.type || "default";
    const adaptiveWidth = options.adaptiveWidth !== false;

    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip fade";
    this.tooltip.setAttribute("data-placement", placement);

    // Заголовок
    if (title) {
      const header = document.createElement("div");
      header.className = `tooltip-header ${type}`;
      header.textContent = title;
      this.tooltip.appendChild(header);
    }

    // Контент
    if (content) {
      const contentDiv = document.createElement("div");
      contentDiv.className = "tooltip-content";
      contentDiv.textContent = content;
      this.tooltip.appendChild(contentDiv);
    }

    // Стрелка
    const arrow = document.createElement("div");
    arrow.className = "tooltip-arrow";
    this.tooltip.appendChild(arrow);

    document.body.appendChild(this.tooltip);
    this.positionTooltip(targetElement, placement, adaptiveWidth);

    setTimeout(() => {
      this.tooltip.classList.add("show");
    }, 10);
  }

  positionTooltip(targetElement, placement, adaptiveWidth) {
    const rect = targetElement.getBoundingClientRect();
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;

    // Адаптивная ширина для top/bottom
    if (adaptiveWidth && (placement === "top" || placement === "bottom")) {
      this.tooltip.style.minWidth = `${rect.width}px`;
      this.tooltip.classList.add("adaptive-width");
    }

    // Принудительное применение стилей
    this.tooltip.style.left = "-1000px";
    this.tooltip.style.top = "-1000px";

    const tooltipRect = this.tooltip.getBoundingClientRect();

    let top, left;

    switch (placement) {
      case "top":
        top = rect.top + scrollY - tooltipRect.height - 8;
        left = rect.left + scrollX + (rect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = rect.top + scrollY + rect.height + 8;
        left = rect.left + scrollX + (rect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = rect.top + scrollY + (rect.height - tooltipRect.height) / 2;
        left = rect.left + scrollX - tooltipRect.width - 8;
        break;
      case "right":
        top = rect.top + scrollY + (rect.height - tooltipRect.height) / 2;
        left = rect.left + scrollX + rect.width + 8;
        break;
    }

    this.adjustToViewport(top, left, tooltipRect);
  }

  adjustToViewport(top, left, tooltipRect) {
    const viewport = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };

    // Корректировка по горизонтали
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewport.width - 8) {
      left = viewport.width - tooltipRect.width - 8;
    }

    // Корректировка по вертикали
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewport.height - 8) {
      top = viewport.height - tooltipRect.height - 8;
    }

    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  }

  hide() {
    if (this.tooltip) {
      const tooltip = this.tooltip;
      tooltip.classList.remove("show");

      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.remove();
        }
      }, 150);

      this.tooltip = null;
    }
  }

  isVisible() {
    return this.tooltip !== null;
  }
}
