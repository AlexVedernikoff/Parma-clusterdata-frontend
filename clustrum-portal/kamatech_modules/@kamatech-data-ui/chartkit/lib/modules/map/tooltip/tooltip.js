/* eslint-disable indent, max-len */

// import './tooltip.scss';

function formatTooltip(data) {
  return `
<div class="chart-tooltip">
    <div class="chart-tooltip__header">
        ${data.header}
    </div>
    ${data.datetime ? `<div class="chart-tooltip__region">${data.name_local}</div>` : ''}
    <table class="chart-tooltip__point-series">
        <tbody>
            ${data.tooltipValues
              .map(
                value =>
                  `<tr>
                    <td class="chart-tooltip__bubble-cell">
                        <span class="chart-tooltip__bubble" ${
                          value.colorBubble
                            ? `style="background-color: ${data.color};"`
                            : ''
                        }></span>
                    </td>
                    <td class="chart-tooltip__value-cell">
                        ${value.formatted}
                    </td>
                    <td class="chart-tooltip__series-cell">
                        <span class="chart-tooltip__series">
                            ${value.title}
                        </span>
                    </td>
                </tr>`,
              )
              .join('')}
        </tbody>
    </table>
</div>`;
}

export default formatTooltip;
