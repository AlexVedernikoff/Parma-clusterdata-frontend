/* eslint-disable indent, max-len */

import isEmpty from 'lodash/isEmpty';

function formatDiff(data, colorize) {
    let className = '';
    const sign = data && data.sign || '';

    if (colorize === 'more-green') {
        if (sign === '+') {
            className += ' chart-metric__diff_positive';
        }
        if (sign === '-') {
            className += ' chart-metric__diff_negative';
        }
    }

    if (colorize === 'less-green') {
        if (sign === '+') {
            className += ' chart-metric__diff_negative';
        }
        if (sign === '-') {
            className += ' chart-metric__diff_positive';
        }
    }

    return data && data.value ?
`<div class="chart-metric__diff-abs${className}" ${data.color ? `style="color: ${data.color};"` : ''}>
    ${sign}
    ${data.value}
    <span class="chart-metric__diff_unit">
        ${data.unit || ''}
    </span>
</div>
` : '';
}

function formatMetric(data) {
    const current = data.content.current;
    const last = data.content.last;
    return `
<div class="chart-metric" ${data.background ? `style="background: ${data.background}";` : ''}>
    <div class="chart-metric__content">
        <div class="chart-metric__title" title="${data.title}">
            ${data.title || ''}
        </div>
    
        <div class="chart-metric__current">
            ${current.text || ''}
        </div>
    
        <div class="chart-metric__metric">
            <span class="chart-metric__value" ${current.color ? `style="color: ${current.color};"` : ''}>
                ${current.sign === '-' ? current.sign : ''}
                ${current.value}
            </span>
            <div class="chart-metric__aside">
                <div class="chart-metric__diff-container">
                    ${formatDiff(data.content.diff, data.colorize)}
                    ${formatDiff(data.content.diffPercent, data.colorize)}
                </div>
                
                <span class="chart-metric__unit">
                    ${current.unit || ''}
                </span>
            </div>
        </div>
    
        ${
        last ?
            `<div class="chart-metric__last">
                    ${last.text || ''}
                </div>
                
                <div class="chart-metric__last-value" ${last.color ? `style="color: ${last.color};"` : ''}>
                    ${last.sign === '-' ? last.sign : ''}
                    ${last.value || ''}
                    <span class="chart-metric__last_unit">
                        ${last.unit || ''}
                    </span>
                </div>`
            : ''
        }
    
        <div class="chart-metric__chart"/>
    </div>
</div>`;
}

export default formatMetric;
