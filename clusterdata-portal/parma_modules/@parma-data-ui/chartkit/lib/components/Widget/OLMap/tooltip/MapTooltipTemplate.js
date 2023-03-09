import stylesTooltip from './tooltipStyle.css';

class MapTooltipTemplate {
  constructor() {
    this.tooltip;
    this.overlay;
  }

  static tooltipsTemplate(tooltips) {
    return tooltips.map(tooltip => this.tooltipTemplate(tooltip)).join('\n')
  }

  static tooltipTemplate (tooltip) {
    return `<div>${tooltip.title}: ${tooltip.value}</div>`
  }
}

export default MapTooltipTemplate;
