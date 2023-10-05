import { Theme } from '../../app-settings/types/app-settings';
import { CssVariables } from '../types/theme';
import { DEFAULT_FONT_FAMILY } from '@shared/app-settings/lib/constants';

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
    {
      variable: '--clustrum-dashboard-pagination-font-family',
      value:
        dashboard?.widget?.table?.pagination?.fontStyle?.family ?? DEFAULT_FONT_FAMILY,
    },
    {
      variable: '--clustrum-dashboard-pagination-font-weight',
      value: dashboard?.widget?.table?.pagination?.fontStyle?.weight ?? '400',
    },
    {
      variable: '--clustrum-dashboard-pagination-line-height',
      value: dashboard?.widget?.table?.pagination?.fontStyle?.lineHeight ?? '22px',
    },
    {
      variable: '--clustrum-dashboard-pagination-font-size',
      value: dashboard?.widget?.table?.pagination?.fontStyle?.size ?? '14px',
    },
    {
      variable: '--clustrum-dashboard-pagination-font-style',
      value: dashboard?.widget?.table?.pagination?.fontStyle?.style ?? 'normal',
    },
    {
      variable: '--clustrum-dashboard-pagination-font-color',
      value:
        dashboard?.widget?.table?.pagination?.fontStyle?.color ?? 'rgba(0, 0, 0, 0.88)',
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
