/* eslint-disable indent, max-len */

// import './tooltip.scss';

function formatTooltip(data) {
  return `
<div class="_tooltip">
${
  data.onlyDate
    ? `<div class="_tooltip-date">
            ${data.onlyDate}
            ${
              data.dayOfWeek
                ? `<span class="_tooltip-date-dayofweek${
                    data.holiday || data.weekend ? ' _tooltip-date-dayofweek_weekend' : ''
                  }">
                        ${data.dayOfWeek}
                    </span>`
                : ''
            }
        </div>`
    : ''
}
    <table class="_tooltip-table">
        <tr>
            <td class="_tooltip-left__td">
                <table class="_tooltip-rows__table">
                    ${data.lines
                      .map(
                        line =>
                          `<tr>
                            <td class="_tooltip-rows__buble-td">
                                <div class="_tooltip-rows__buble-div" style="background-color:${
                                  line.seriesColor
                                };"></div>
                            </td>
                            
                            <td class="_tooltip-rows__percent-td">
                                ${line.percentValue ? line.percentValue + '%' : ''}
                            </td>
                            
                            <td class="_tooltip-rows__value-td">
                                ${line.valuePrefix ? line.valuePrefix : ''}
                                ${line.value}
                                ${line.valueSuffix ? line.valueSuffix : ''}
                            </td>
                            
                            ${
                              data.useCompareFrom
                                ? `<td class="_tooltip-rows__diff-td">
                                        ${line.diff ? ` (${line.diff})` : ''}
                                    </td>`
                                : ''
                            }
                            
                            ${
                              data.shared
                                ? `<td class="_tooltip-rows__name-td">
                                        ${line.hideSeriesName ? '' : line.seriesName}
                                    </td>`
                                : ''
                            }
                        </tr>

                        ${
                          line.commentText || line.xyCommentText
                            ? `<tr>
                                    <td class="_tooltip-rows__comment-left-td">
                                        <div class="_tooltip-rows__comment-left-div" style="background:${
                                          line.seriesColor
                                        };"/>
                                    </td>
                                    <td colspan="10">
                                        ${
                                          line.commentText
                                            ? `<div class="_tooltip-rows__comment-div">${line.commentText}</div>`
                                            : ''
                                        }
                                        ${
                                          line.xyCommentText
                                            ? `<div class="_tooltip-rows__comment-div">${line.xyCommentText}</div>`
                                            : ''
                                        }
                                    </td>
                                </tr>`
                            : ''
                        }`,
                      )
                      .join('')}
    
                    ${
                      data.sum
                        ? `<tr>
                                <td class="_tooltip-rows__summ-td">&sum;</td>
                                <td class="_tooltip-rows__summ-td" colspan="3">
                                    ${data.sum}
                                </td>
                            </tr>`
                        : ''
                    }
                </table>
            </td>
    
            ${
              data.holiday || data.commentDateText || (data.xComments && data.xComments.length)
                ? `<td class="_tooltip-betw-line"></td>
                    <td class="_tooltip-right__td">
                        ${
                          data.holiday
                            ? `<div class="_tooltip-right__holiday-div">
                                    <img class="_tooltip-right__holiday-img" src="/img/holiday.png"/>
                                    ${data.holidayText}
                                    ${
                                      data.region
                                        ? `<span class="_tooltip-right__holiday-region">[${data.region}]</span>`
                                        : ''
                                    }
                                </div>`
                            : ''
                        }
        
                        ${
                          data.commentDateText
                            ? `<div class="${data.xComments ? '_tooltip-right__margin-bot' : ''}">${
                                data.commentDateText
                              }</div>`
                            : ''
                        }
        
                        ${
                          data.xComments
                            ? data.xComments
                                .map(
                                  comment =>
                                    `<div class="_tooltip-right__traf-div" style="border-color: ${comment.color};">${comment.text}</div>`,
                                )
                                .join('')
                            : ''
                        }
                    </td>`
                : ''
            }
        </tr>
    </table>
</div>`;
}

export default formatTooltip;
