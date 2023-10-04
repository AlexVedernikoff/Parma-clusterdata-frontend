import { Theme } from '../../app-settings/types/app-settings';
import { CssVariables } from '../types/theme';

const setCssVariablesValues = (themeObj: Theme): CssVariables[] => {
  const { ant, app, layout, filters, widget, dashboard } = themeObj;
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
      variable: '--clustrum-default-widget-shadow',
      value: widget.borderShadow,
    },
    {
      variable: '--clustrum-default-border-filter-color',
      value: filters.borderFilterColor,
    },
    {
      variable: '--clustrum-dashboard-header-font-family',
      value: dashboard.header.font.family,
    },
    {
      variable: '--clustrum-dashboard-header-font-size',
      value: dashboard.header.font.size,
    },
    {
      variable: '--clustrum-dashboard-header-font-weight',
      value: dashboard.header.font.weight,
    },
    {
      variable: '--clustrum-dashboard-header-font-style',
      value: dashboard.header.font.style,
    },
    {
      variable: '--clustrum-dashboard-header-font-lineHeight',
      value: dashboard.header.font.lineHeight,
    },
    {
      variable: '--clustrum-dashboard-header-font-color',
      value: dashboard.header.font.color,
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
