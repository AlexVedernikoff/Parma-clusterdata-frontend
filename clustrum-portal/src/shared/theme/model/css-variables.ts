import { Theme } from '../../app-settings/types/app-settings';
import { CssVariables } from '../types/theme';
import { DEFAULT_FONT_FAMILY } from '@shared/app-settings/lib/constants';

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
      variable: '--clustrum-filter-label-shading-color',
      value: filters.labelShadingColor,
    },
    {
      variable: '--clustrum-dashboard-pagination-font-family',
      value: dashboard?.table?.pagination?.fontStyle?.family ?? DEFAULT_FONT_FAMILY,
    },
    {
      variable: '--clustrum-dashboard-pagination-font-weight',
      value: dashboard?.table?.pagination?.fontStyle?.weight ?? '400',
    },
    {
      variable: '--clustrum-dashboard-pagination-line-height',
      value: dashboard?.table?.pagination?.fontStyle?.lineHeight ?? '22px',
    },
    {
      variable: '--clustrum-dashboard-pagination-font-size',
      value: dashboard?.table?.pagination?.fontStyle?.size ?? '14px',
    },
    {
      variable: '--clustrum-dashboard-pagination-font-style',
      value: dashboard?.table?.pagination?.fontStyle?.style ?? 'normal',
    },
    {
      variable: '--clustrum-dashboard-pagination-font-color',
      value: dashboard?.table?.pagination?.fontStyle?.color ?? 'rgba(0, 0, 0, 0.88)',
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
