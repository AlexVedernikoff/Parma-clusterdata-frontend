import { Theme } from '../../app-settings/types/app-settings';
import { CssVariables } from '../types/theme';
import { DEFAULT_FONT_FAMILY } from '@shared/app-settings';

const setCssVariablesValues = (themeObj: Theme): CssVariables[] => {
  const { ant, app, layout, dashboard } = themeObj;
  return [
    {
      variable: '--antd-color-primary',
      value: ant.colorPrimary,
    },
    {
      variable: '--clustrum-dashboard-widget-table-td-numbertype-align',
      value: dashboard?.widget?.table?.td?.numberType?.align,
    },
    {
      variable: '--clustrum-dashboard-widget-table-td-texttype-align',
      value: dashboard?.widget?.table?.td?.textType?.align,
    },
    {
      variable: '--clustrum-dashboard-widget-table-td-datetype-align',
      value: dashboard?.widget?.table?.td?.dateType?.align,
    },
    {
      variable: '--clustrum-dashboard-widget-table-total-font-color',
      value: dashboard?.widget?.table?.total?.font?.color ?? 'rgba(0, 0, 0, 0.88)',
    },
    {
      variable: '--clustrum-dashboard-widget-table-total-font-weight',
      value: dashboard?.widget?.table?.total?.font?.weight ?? '600',
    },
    {
      variable: '--clustrum-dashboard-widget-table-total-font-size',
      value: dashboard?.widget?.table?.total?.font?.size ?? '14px',
    },
    {
      variable: '--clustrum-dashboard-widget-table-total-font-style',
      value: dashboard?.widget?.table?.total?.font?.style ?? 'normal',
    },
    {
      variable: '--clustrum-dashboard-widget-table-total-font-line-height',
      value: dashboard?.widget?.table?.total?.font?.lineHeight ?? '1.5',
    },
    {
      variable: '--clustrum-dashboard-widget-table-total-font-family',
      value:
        dashboard?.widget?.table?.total?.font?.family ??
        "'Inter', 'Open Sans', 'Helvetica Neue', Arial, Helvetica, sans-serif",
    },
    {
      variable: '--clustrum-dashboard-widget-table-total-background-color',
      value: dashboard?.widget?.table?.total?.backgroundColor ?? 'transparent',
    },
    {
      variable: '--clustrum-dashboard-widget-table-total-hover-font-color',
      value: dashboard?.widget?.table?.total?.hover?.fontColor ?? '#000;',
    },
    {
      variable: '--clustrum-dashboard-widget-table-total-hover-background-color',
      value: dashboard?.widget?.table?.total?.hover.backgroundColor ?? '#fafafa',
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
      variable: '--clustrum-dashboard-header-font-family',
      value:
        dashboard?.header?.font?.family ??
        "'Inter', 'Open Sans', 'Helvetica Neue', Arial,Helvetica, sans-serif",
    },
    {
      variable: '--clustrum-dashboard-header-font-size',
      value: dashboard?.header?.font?.size ?? '30px',
    },
    {
      variable: '--clustrum-dashboard-header-font-weight',
      value: dashboard?.header?.font?.weight ?? '400',
    },
    {
      variable: '--clustrum-dashboard-header-font-style',
      value: dashboard?.header?.font?.style ?? 'normal',
    },
    {
      variable: '--clustrum-dashboard-header-font-lineHeight',
      value: dashboard?.header?.font?.lineHeight ?? '30px',
    },
    {
      variable: '--clustrum-dashboard-header-font-color',
      value: dashboard?.header?.font?.color ?? '#111729',
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-total-hover-font-color',
      value: dashboard?.widget?.pivotTable?.total?.hover?.fontColor ?? '#000;',
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-total-hover-background-color',
      value: dashboard?.widget?.pivotTable?.total?.hover.backgroundColor ?? '#fafafa',
    },
    {
      variable: '--clustrum-dashboard-header-padding-left',
      value: dashboard?.header?.padding?.left ?? '24px',
    },
    {
      variable: '--clustrum-dashboard-header-padding-right',
      value: dashboard?.header?.padding?.right ?? '24px',
    },
    {
      variable: '--clustrum-dashboard-header-padding-top',
      value: dashboard?.header?.padding?.top ?? '24px',
    },
    {
      variable: '--clustrum-dashboard-header-padding-bottom',
      value: dashboard?.header?.padding?.bottom ?? '24px',
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-total-background-color',
      value: dashboard?.widget?.pivotTable?.total?.backgroundColor ?? 'transparent',
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
      variable: '--clustrum-dashboard-widget-pivot-table-td-numbertype-align',
      value: dashboard?.widget?.pivotTable?.td?.numberType?.align,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-td-texttype-align',
      value: dashboard?.widget?.pivotTable?.td?.textType?.align,
    },
    {
      variable: '--clustrum-dashboard-widget-pivot-table-td-datetype-align',
      value: dashboard?.widget?.pivotTable?.td?.dateType?.align,
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
      variable: '--clustrum-dashboard-widget-table-pivot-table-layout-table-border-color',
      value: dashboard?.widget?.pivotTable?.layout?.tableBorderColor,
    },
    {
      variable: '--clustrum-dashboard-widget-table-pagination-font-family',
      value: dashboard?.widget?.table?.pagination?.font?.family ?? DEFAULT_FONT_FAMILY,
    },
    {
      variable: '--clustrum-dashboard-widget-table-pagination-font-weight',
      value: dashboard?.widget?.table?.pagination?.font?.weight ?? '400',
    },
    {
      variable: '--clustrum-dashboard-widget-table-pagination-line-height',
      value: dashboard?.widget?.table?.pagination?.font?.lineHeight ?? '22px',
    },
    {
      variable: '--clustrum-dashboard-widget-table-pagination-font-size',
      value: dashboard?.widget?.table?.pagination?.font?.size ?? '14px',
    },
    {
      variable: '--clustrum-dashboard-widget-table-pagination-font-style',
      value: dashboard?.widget?.table?.pagination?.font?.style ?? 'normal',
    },
    {
      variable: '--clustrum-dashboard-widget-table-pagination-font-color',
      value: dashboard?.widget?.table?.pagination?.font?.color ?? 'rgba(0, 0, 0, 0.88)',
    },
    {
      variable: '--clustrum-dashboard-widget-filter-label-font-color',
      value: dashboard?.widget?.filter?.label?.font?.color,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-label-font-weight',
      value: dashboard?.widget?.filter?.label?.font?.weight,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-label-font-family',
      value: dashboard?.widget?.filter?.label?.font?.family,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-label-font-line-height',
      value: dashboard?.widget?.filter?.label?.font?.lineHeight,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-label-font-size',
      value: dashboard?.widget?.filter?.label?.font?.size,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-label-font-style',
      value: dashboard?.widget?.filter?.label?.font?.style,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-label-shading-color',
      value: dashboard?.widget?.filter?.label?.shadingColor,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-control-font-color',
      value: dashboard?.widget?.filter?.control?.font?.color,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-control-font-weight',
      value: dashboard?.widget?.filter?.control?.font?.weight,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-control-font-family',
      value: dashboard?.widget?.filter?.control?.font?.family,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-control-font-style',
      value: dashboard?.widget?.filter?.control?.font?.style,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-control-font-line-height',
      value: dashboard?.widget?.filter?.control?.font?.lineHeight,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-control-font-size',
      value: dashboard?.widget?.filter?.control?.font?.size,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-control-border-size',
      value: dashboard?.widget?.filter?.control?.border?.size,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-control-border-style',
      value: dashboard?.widget?.filter?.control?.border?.style,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-control-border-color',
      value: dashboard?.widget?.filter?.control?.border?.color,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-control-border-radius',
      value: dashboard?.widget?.filter?.control?.border?.radius,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-wrapper-border-color',
      value: dashboard?.widget?.filter?.wrapper?.border?.color,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-wrapper-background-color',
      value: dashboard?.widget?.filter?.wrapper?.background?.color,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-wrapper-box-shadow',
      value: dashboard?.widget?.filter?.wrapper?.boxShadow,
    },
    {
      variable: '--clustrum-dashboard-widget-filter-wrapper-text-align',
      value: dashboard?.widget?.filter?.wrapper?.textAlign,
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
