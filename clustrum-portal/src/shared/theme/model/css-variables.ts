import { Theme } from '../../app-settings/types/app-settings';
import { CssVariables } from '../types/theme';

const setCssVariablesValues = (themeObj: Theme): CssVariables[] => {
  const { ant, app, layout, filters, widget } = themeObj;
  return [
    {
      variable: '--antd-color-primary',
      value: ant.colorPrimary,
    },
    {
      variable: '--clustrum-default-font-family',
      value: app.font,
    },
    {
      variable: '--antd-background-color-base',
      value: layout.backgroundContentColor,
    },
    {
      variable: '--clustrum-default-background-panel-color',
      value: layout.backgroundPanelColor,
    },
    {
      variable: '--clustrum-default-background-filter-color',
      value: filters.backgroundFilterColor,
    },
    {
      variable: '--clustrum-default-label-filter-color',
      value: filters.labelFilterColor,
    },
    {
      variable: '--clustrum-default-control-filter-color',
      value: filters.controlFilterColor,
    },
    {
      variable: '--clustrum-default-widget-shadow',
      value: widget.borderShadow,
    },
    {
      variable: '--clustrum-default-border-filter-color',
      value: filters.borderFilterColor,
    },
    {
      variable: '--clustrum-filter-label-shading-color',
      value: filters.labelShadingColor,
    },
    {
      variable: '--clustrum-filter-label-font-weight',
      value: filters.labelFontWeight,
    },
    {
      variable: '--clustrum-filter-label-font-family',
      value: filters.labelFontFamily,
    },
    {
      variable: '--clustrum-filter-label-line-height',
      value: filters.labelLineHeight,
    },
    {
      variable: '--clustrum-filter-label-font-size',
      value: filters.labelFontSize,
    },
    {
      variable: '--clustrum-filter-control-font-weight',
      value: filters.controlFontWeight,
    },
    {
      variable: '--clustrum-filter-control-font-family',
      value: filters.controlFontFamily,
    },
    {
      variable: '--clustrum-filter-control-line-height',
      value: filters.controlLineHeight,
    },
    {
      variable: '--clustrum-filter-control-font-size',
      value: filters.controlFontSize,
    },
    {
      variable: '--clustrum-filter-control-border-size',
      value: filters.controlBorderSize,
    },
    {
      variable: '--clustrum-filter-control-border-style',
      value: filters.controlBorderStyle,
    },
    {
      variable: '--clustrum-filter-control-border-color',
      value: filters.controlBorderColor,
    },
    {
      variable: '--clustrum-filter-control-border-radius',
      value: filters.controlBorderRadius,
    },
    {
      variable: '--clustrum-filter-text-align',
      value: filters.textAlign,
    },
    {
      variable: '--clustrum-default-widget-background-color',
      value: widget.backgroundColor,
    },
  ];
};

export const setCssVariables = (theme: Theme): void => {
  const rootElem = document.querySelector<HTMLElement>(':root');
  if (rootElem && theme) {
    const cssVariablesDictionary = setCssVariablesValues(theme);
    cssVariablesDictionary.forEach(({ variable, value }) => {
      rootElem.style.setProperty(variable, value);
    });
  }
};
