import { Theme } from '../../app-settings/types/app-settings';
import { CssVariables } from '../types/theme';

const setCssVariablesValues = (themeObj: Theme): CssVariables[] => {
  const { ant, app, layout, filters, widget, appWidgets, dashboard } = themeObj;
  return [
    {
      variable: '--clustrum-table-widget-cell-numbertype-align',
      value: appWidgets?.tableWidget?.cell?.numberType?.align ?? 'left',
    },
    {
      variable: '--clustrum-table-widget-cell-texttype-align',
      value: appWidgets?.tableWidget?.cell?.textType?.align ?? 'right',
    },
    {
      variable: '--clustrum-table-widget-cell-datetype-align',
      value: appWidgets?.tableWidget?.cell?.dateType?.align ?? 'center',
    },
    {
      variable: '--antd-color-primary',
      value: ant.colorPrimary,
    },
    {
      variable: '--antd-final-table-column-total-color',
      value: dashboard?.widget?.pivotTable?.total?.font?.color,
    },
    {
      variable: '--antd-final-table-column-total-weight',
      value: dashboard?.widget?.pivotTable?.total?.font?.weight,
    },
    {
      variable: '--antd-final-table-column-total-size',
      value: dashboard?.widget?.pivotTable?.total?.font?.size,
    },
    {
      variable: '--antd-final-table-column-total-style',
      value: dashboard?.widget?.pivotTable?.total?.font?.style,
    },
    {
      variable: '--antd-final-table-column-total-line-height',
      value: dashboard?.widget?.pivotTable?.total?.font?.lineHeight,
    },
    {
      variable: '--antd-final-table-column-total-font-family',
      value: dashboard?.widget?.pivotTable?.total?.font?.family,
    },
    {
      variable: '--antd-final-table-column-total-background-color',
      value: dashboard?.widget?.pivotTable?.total?.backgroundColor,
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
      variable: '--clustrum-dashboard-widget-pivot-table-th-font-family',
      value: dashboard?.widget?.pivotTable?.th?.font?.family,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-th-font-size',
      value: dashboard?.widget?.pivotTable?.th?.font?.size,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-th-font-weight',
      value: dashboard?.widget?.pivotTable?.th?.font?.weight,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-th-font-style',
      value: dashboard?.widget?.pivotTable?.th?.font?.style,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-th-font-line-height',
      value: dashboard?.widget?.pivotTable?.th?.font?.lineHeight,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-th-font-color',
      value: dashboard?.widget?.pivotTable?.th?.font?.lineHeight,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-td-font-family',
      value: dashboard?.widget?.pivotTable?.td?.font?.family,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-td-font-size',
      value: dashboard?.widget?.pivotTable?.td?.font?.size,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-td-font-weight',
      value: dashboard?.widget?.pivotTable?.td?.font?.weight,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-td-font-style',
      value: dashboard?.widget?.pivotTable?.td?.font?.style,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-td-font-line-height',
      value: dashboard?.widget?.pivotTable?.td?.font?.lineHeight,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-td-font-color',
      value: dashboard?.widget?.pivotTable?.td?.font?.lineHeight,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-total-font-family',
      value: dashboard?.widget?.pivotTable?.total?.font?.family,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-total-font-size',
      value: dashboard?.widget?.pivotTable?.total?.font?.size,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-total-font-weight',
      value: dashboard?.widget?.pivotTable?.total?.font?.weight,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-total-font-style',
      value: dashboard?.widget?.pivotTable?.total?.font?.style,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-total-font-line-height',
      value: dashboard?.widget?.pivotTable?.total?.font?.lineHeight,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-td-font-color',
      value: dashboard?.widget?.pivotTable?.total?.font?.lineHeight,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-layout-table-border-color',
      value: dashboard?.widget?.pivotTable?.layout?.tableBorderColor,
    },
  ];
};

export const setCssVariables = (theme: Theme): void => {
  const rootElem = document.querySelector<HTMLElement>(':root');
  if (rootElem && theme) {
    const cssVariablesDictionary = setCssVariablesValues(theme);
    cssVariablesDictionary.forEach(({ variable, value }) => {
      if (value) {
        rootElem.style.setProperty(variable, value);
      }
    });
  }
};
