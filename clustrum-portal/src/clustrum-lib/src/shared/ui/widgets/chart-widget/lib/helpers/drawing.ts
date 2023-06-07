import moment from 'moment';

const DOT_RADIUS = 5;
const DOT_MARGIN = DOT_RADIUS * 3;
const DOT_HALF_MARGIN = DOT_MARGIN / 2;

const HIGHCHARTS_COMMENT = 'highcharts-comment';
const HIGHCHARTS_RENDERER_COMMENT = 'highcharts-renderer-comment';

const DEFAULT_COLOR = '#ffcc00';
const DEFAULT_TEXT_COLOR = 'white';
const DEFAULT_FILL_COLOR = 'black';

const Z_INDEX = 10;

const TYPES = {
  FLAG_X: 'flag-x',
  // {
  //     type: 'flag-x',
  //     date: Date.UTC(2017, 0, 1),
  //     title: 'v0.0.1',
  //     text: 'старт',    // необязательный
  //     y: -60,           // необязательный
  //     color: '#6389a1', // необязательный
  //     shape: 'flag',    // необязательный
  // }
  LINE_X: 'line-x',
  // {
  //     type: 'line-x',
  //     date: Date.UTC(2017, 1, 1),
  //     text: '1.0.0',
  //     color: '#6389a1', // необязательный
  //     dashStyle: 'dot', // необязательный
  //     width: 3,         // необязательный
  // }
  BAND_X: 'band-x',
  // {
  //     type: 'band-x',
  //     from: Date.UTC(2017, 2, 1),
  //     to: Date.UTC(2017, 2, 5),
  //     date: Date.UTC(2017, 2, 9), // вместо from/to, если только на один x
  //     text: 'тестирование',
  //     color: '#6389a1',        // необязательный
  //     visible: true,           // необязательный
  //     zIndex: 1,               // необязательный
  // }
  DOT_XY: 'dot-x-y',
  // {
  //     type: 'dot-x-y',
  //     date: Date.UTC(2017, 0, 19),
  //     graphId: 'users',
  //     text: 'для плюсов',
  //     color: '#e28356',     // необязательный
  //     fillColor: '#32426d', // необязательный
  //     textColor: '#ffff7f', // необязательный
  //     visible: true,        // необязательный
  // }
};

// получаем миллисекунды из даты
function convertDateToX(date: string): number {
  return moment(date).valueOf();
}

// добавляем поле x (дата в миллисекундах) к комментариям
function extendComment({ meta, ...rest }: { meta: any; rest: any }): any {
  const extended = Object.assign({}, rest, meta);
  if (extended.dateUntil) {
    extended.from = convertDateToX(extended.date);
    extended.to = convertDateToX(extended.dateUntil);
  } else if (extended.date) {
    extended.x = convertDateToX(extended.date);
  }
  return extended;
}

function isNotFitGrid(x: number, chart: any): boolean {
  const ignoreScale = chart._config.comments?.ignoreScale ?? {};
  const isXonXAxis = chart.xAxis[0].series.some(({ xData }: { xData: number[] }) => xData.indexOf(x) !== -1);
  return !isXonXAxis && !ignoreScale && x % chart.xAxis[0].closestPointRange !== 0;
}

function isGridNotFitBetween(from: number, to: number, chart: any): boolean {
  const ignoreScale = chart._config.comments?.ignoreScale ?? {};
  const isXonXAxisBetween = chart.xAxis[0].series.some(({ xData }: { xData: number[] }) =>
    xData.some((x: number) => x >= from && x <= to),
  );
  return !isXonXAxisBetween && !ignoreScale;
}

// TODO: добавить title и отдельный вывод текста в тултипе по наведению на флаг, как в Highcharts
function drawFlagX(
  chart: any,
  {
    x,
    text,
    y,
    shape,
    color = DEFAULT_COLOR,
  }: { x: number; title: string; text: string; y: number; shape: string; color: string },
): void {
  if (isNotFitGrid(x, chart)) {
    return;
  }
  chart.addSeries(
    {
      className: HIGHCHARTS_COMMENT,
      type: 'flags',
      data: [{ x, text, title: text }],
      y: y || -30,
      shape: shape || 'circlepin',
      color,
      showInLegend: false,
      zIndex: Z_INDEX,
    },
    false,
    false,
  );
}

function drawLineX(
  chart: any,
  {
    x,
    color = DEFAULT_COLOR,
    width,
    dashStyle,
    text,
  }: { x: number; width: number; text: string; dashStyle: string; color: string },
): void {
  if (isNotFitGrid(x, chart)) {
    return;
  }
  const line = chart.xAxis[0].addPlotLine({
    className: HIGHCHARTS_COMMENT,
    value: x,
    color,
    width: width || 2,
    dashStyle,
    label: {
      className: HIGHCHARTS_COMMENT,
      text,
    },
    id: Math.random()
      .toFixed(3)
      .toString(), // TODO: нужно ли это?
    zIndex: Z_INDEX,
  });

  // TODO: className в addPlotLine не работает, поэтому так (6.1.0) (вроде работает в Highcharts версии с CSS стилями)
  line.svgElem.element.classList.add(HIGHCHARTS_COMMENT);
}

function drawBandX(chart: any, options: any, onlyRenderer: boolean): void {
  if (
    (options.x && isNotFitGrid(options.x, chart)) ||
    (options.from && options.to && isGridNotFitBetween(options.from, options.to, chart))
  ) {
    return;
  }

  const xAxis = chart.xAxis[0];
  const yAxis = chart.yAxis[0];
  const xExtremes = xAxis.getExtremes();
  const yExtremes = yAxis.getExtremes();

  let from;
  let to;
  let xFromPx;
  let yFromPx;
  let width = 0;

  let half;

  const closesPointRange =
    options.from && options.to && options.from !== options.to
      ? Math.min(options.to - options.from, xAxis.closestPointRange)
      : xAxis.closestPointRange;

  while (Math.abs(width) < 3) {
    half = half === undefined ? closesPointRange / 2 : half * 1.5;

    from = Math.max(options.from || options.x, xExtremes.dataMin) - half;
    to = Math.min(options.to || options.x, xExtremes.dataMax) + half;

    xFromPx = Math.max(xAxis.toPixels(from), chart.plotLeft);
    yFromPx = yAxis.toPixels(yExtremes.max);
    const xToPx = Math.min(xAxis.toPixels(to), chart.plotLeft + chart.plotWidth);
    width = xToPx - xFromPx;
  }

  if (options.visible && !onlyRenderer) {
    xAxis.addPlotBand({
      from: from,
      to: to,
      color: options.color || DEFAULT_COLOR,
      zIndex: options.zIndex || 0,
      className: ' highcharts-plot-band_comment ' + HIGHCHARTS_COMMENT,
    });
  }

  // yFromPx может быть NaN, если все ряды скрыты
  if (yFromPx) {
    chart.renderer
      .rect(xFromPx, yFromPx, width, 4, 0)
      .attr({
        fill: options.color || DEFAULT_COLOR,
        zIndex: 1,
        opacity: 0.8,
        class: HIGHCHARTS_RENDERER_COMMENT,
      })
      .add();
  }
}

function getDotLabelPositions(options: any): any {
  const width = options.width;
  const height = options.height;
  const pointX = options.pointX;
  const pointY = options.pointY;
  const plotRight = options.plotRight;
  const plotBottom = options.plotBottom;

  const widthPlusMargin = width + DOT_MARGIN;
  const widthMinusMargin = width - DOT_MARGIN;
  const heightPlusMargin = height + DOT_MARGIN;
  const heightMinusMargin = height - DOT_MARGIN;

  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const positions = [];

  let x;
  let y;
  let anchor;

  // top
  if (pointY > heightPlusMargin) {
    y = pointY - heightPlusMargin;
    anchor = [
      'M',
      pointX,
      pointY - DOT_HALF_MARGIN,
      'L',
      pointX - DOT_RADIUS,
      pointY - DOT_MARGIN,
      pointX + DOT_RADIUS,
      pointY - DOT_MARGIN,
      'Z',
    ];

    // top-left
    if (pointX > widthMinusMargin) {
      positions.push({
        x: pointX - widthMinusMargin,
        y: y,
        w: width,
        h: height,
        anchor: anchor,
      });
    }

    // top-right
    if (pointX + widthMinusMargin < plotRight) {
      positions.push({
        x: pointX - DOT_MARGIN,
        y: y,
        w: width,
        h: height,
        anchor: anchor,
      });
    }

    // top-mid
    if (pointX > halfWidth && pointX + halfWidth < plotRight) {
      positions.push({
        x: pointX - halfWidth,
        y: y,
        w: width,
        h: height,
        anchor: anchor,
      });
    }
  }

  // right
  if (pointX + widthPlusMargin < plotRight) {
    x = pointX + DOT_MARGIN;
    anchor = [
      'M',
      pointX + DOT_HALF_MARGIN,
      pointY,
      'L',
      pointX + DOT_MARGIN,
      pointY + DOT_RADIUS,
      pointX + DOT_MARGIN,
      pointY - DOT_RADIUS,
      'Z',
    ];

    // right-top
    if (pointY > heightMinusMargin) {
      positions.push({
        x: x,
        y: pointY - heightMinusMargin,
        w: width,
        h: height,
        anchor: anchor,
      });
    }

    // right-bottom
    if (pointY + heightMinusMargin < plotBottom) {
      positions.push({
        x: x,
        y: pointY - DOT_MARGIN,
        w: width,
        h: height,
        anchor: anchor,
      });
    }

    // right-mid
    if (pointY > halfHeight && pointY + halfHeight < plotBottom) {
      positions.push({
        x: x,
        y: pointY - halfHeight,
        w: width,
        h: height,
        anchor: anchor,
      });
    }
  }

  // bottom
  if (pointY + heightPlusMargin < plotBottom) {
    y = pointY + DOT_MARGIN;
    anchor = [
      'M',
      pointX,
      pointY + DOT_HALF_MARGIN,
      'L',
      pointX - DOT_RADIUS,
      pointY + DOT_MARGIN,
      pointX + DOT_RADIUS,
      pointY + DOT_MARGIN,
      'Z',
    ];

    // bottom-left
    if (pointX > widthMinusMargin) {
      positions.push({
        x: pointX - widthMinusMargin,
        y: y,
        w: width,
        h: height,
        anchor: anchor,
      });
    }

    // bottom-right
    if (pointX + widthMinusMargin < plotRight) {
      positions.push({
        x: pointX - DOT_MARGIN,
        y: y,
        w: width,
        h: height,
        anchor: anchor,
      });
    }

    // bottom-mid
    if (pointX > halfWidth && pointX + halfWidth < plotRight) {
      positions.push({
        x: pointX - halfWidth,
        y: y,
        w: width,
        h: height,
        anchor: anchor,
      });
    }
  }

  // left
  if (pointX > widthPlusMargin) {
    x = pointX - widthPlusMargin;
    anchor = [
      'M',
      pointX - DOT_HALF_MARGIN,
      pointY,
      'L',
      pointX - DOT_MARGIN,
      pointY + DOT_RADIUS,
      pointX - DOT_MARGIN,
      pointY - DOT_RADIUS,
      'Z',
    ];

    // left-top
    if (pointY > heightMinusMargin) {
      positions.push({
        x: x,
        y: pointY - heightMinusMargin,
        w: width,
        h: height,
        anchor: anchor,
      });
    }

    // left-bottom
    if (pointY + heightMinusMargin < plotBottom) {
      positions.push({
        x: x,
        y: pointY - DOT_MARGIN,
        w: width,
        h: height,
        anchor: anchor,
      });
    }

    // left-mid
    if (pointY > halfHeight && pointY + halfHeight < plotBottom) {
      positions.push({
        x: x,
        y: pointY - halfHeight,
        w: width,
        h: height,
        anchor: anchor,
      });
    }
  }

  return positions;
}

function drawDot(chart: any, options: any): void | null {
  if (isNotFitGrid(options.x, chart)) {
    return;
  }

  const seriesIndex = chart.series.findIndex(
    ({ userOptions: { id }, visible }: { userOptions: { id: string | number }; visible: boolean }) =>
      id === options.graphId && visible,
  );

  if (seriesIndex === -1) {
    return null;
  }

  const point = chart.series[seriesIndex].data.find((_point: any) => _point && _point.x === options.x);
  const color = options.color || chart.series[seriesIndex].color;

  if (!point) {
    return null;
  }

  point.update(
    {
      marker: {
        enabled: true,
        radius: DOT_RADIUS,
        fillColor: color,
        states: {
          hover: {
            radius: DOT_RADIUS,
            fillColor: color,
          },
        },
      },
    },
    false,
    false,
  );
}

// TODO: попробовать annotations
function drawDotLabel(chart: any, options: any): any {
  if (!options.visible) {
    return null;
  }

  const seriesIndex = chart.series.findIndex(
    ({ userOptions: { id }, visible }: { userOptions: { id: string | number }; visible: boolean }) =>
      id === options.graphId && visible,
  );

  if (seriesIndex === -1) {
    return null;
  }

  const point = chart.series[seriesIndex].data.find((_point: any) => _point && _point.x === options.x);

  if (!point) {
    return null;
  }

  const pointX = point.plotX + chart.plotLeft;
  const pointY = point.plotY + chart.plotTop;

  // добавляем label, чтобы получить label.width и label.height
  // далее нужно будет сделать label.translate(...)
  const label = chart.renderer
    .label(options.text, pointX, pointY, 'callout')
    .css({
      color: options.textColor || DEFAULT_TEXT_COLOR,
      width: 150,
      fontSize: 10,
    })
    .attr({
      fill: options.fillColor || DEFAULT_FILL_COLOR,
      padding: 8,
      opacity: 0.7,
      r: 8,
      zIndex: 6,
      class: HIGHCHARTS_RENDERER_COMMENT,
    })
    .add();

  const positions = getDotLabelPositions({
    width: label.width,
    height: label.height,
    pointX: pointX,
    pointY: pointY,
    plotRight: chart.plotWidth + chart.plotLeft,
    plotBottom: chart.plotHeight + chart.plotTop,
  });

  if (positions.length === 0) {
    label.destroy();
    return null;
  }

  return { label: label, positions: positions, fillColor: options.fillColor };
}

function isRectsIntersects(
  ax1: number,
  ax2: number,
  ay1: number,
  ay2: number,
  bx1: number,
  bx2: number,
  by1: number,
  by2: number,
): boolean {
  return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
}

function translateDotsLabels(chart: any, notTranslatedDotsLabels: any): void {
  const translatedDotsLabels: any = [];

  notTranslatedDotsLabels
    .sort((a: any, b: any) => {
      return a.label.x - b.label.x;
    })
    .forEach((label: any, index: number) => {
      // массив доступных для размещения label позиций
      const available = label.positions
        .map((position: any) => {
          return {
            // количество пересечений с translated label'ами
            previous: translatedDotsLabels.filter((translated: any) => {
              return isRectsIntersects(
                position.x,
                position.x + position.w,
                position.y,
                position.y + position.h,
                translated.x,
                translated.x + translated.w,
                translated.y,
                translated.y + translated.h,
              );
            }).length,

            // количество пересечений со всеми возможными позициями notTranlated label'ов,
            // чья точка (dot, к которой принадлежит label) находится внутри
            // рассматриваемого label'а
            next: notTranslatedDotsLabels
              // оставшиеся не translated label'ы
              .slice(index + 1, notTranslatedDotsLabels.length)
              // точка (dot) находится внутри рассматриваемого lable'а
              .filter((notTranslated: any) => {
                return (
                  notTranslated.label.x > position.x &&
                  notTranslated.label.x < position.x + position.w &&
                  notTranslated.label.y > position.y &&
                  notTranslated.label.y < position.y + position.h
                );
              })
              .map((notTranslated: any) => {
                // берем позиции, которые пересекаются с текущей
                return notTranslated.positions.filter((notPosition: any) => {
                  return isRectsIntersects(
                    notPosition.x,
                    notPosition.x + notPosition.w,
                    notPosition.y,
                    notPosition.y + notPosition.h,
                    position.x,
                    position.x + position.w,
                    position.y,
                    position.y + position.h,
                  );
                }).length;
              })
              .reduce((sum: number, current: number) => {
                return sum + current;
              }, 0),

            position: position,
          };
        })
        .sort((a: any, b: any) => {
          return a.previous === b.previous ? a.next - b.next : a.previous - b.previous;
        });

      label.label.translate(available[0].position.x, available[0].position.y);

      // добавляем "стрелочку" от label'а к точке (dot)
      chart.renderer
        .path(available[0].position.anchor)
        .attr({
          strokeWidth: 1,
          stroke: label.fillColor || DEFAULT_FILL_COLOR,
          fill: label.fillColor || DEFAULT_FILL_COLOR,
          opacity: 0.7,
          zIndex: 6,
          class: HIGHCHARTS_RENDERER_COMMENT,
        })
        .add();

      translatedDotsLabels.push({
        x: available[0].position.x,
        y: available[0].position.y,
        w: available[0].position.w,
        h: available[0].position.h,
      });
    });
}

// сохраняем нарисованные комментарии,
// чтобы иметь возможность скрыть/удалить именно нарисованные,
// а не измененные/добавленные/удаленные через форму
// let drawnComments;

// function shouldDrawComments(settings) {
//     return this.chart && this.chart.series.some(function (graph) {
//         return graph.visible && graph.name !== 'legend_manage_line';
//     }) && !this.settings.hideComments;
// }

function drawComments(chart: any, comments: any, settings: any, force: any): void {
  if (force) {
    settings.hideComments = false;
  } else if (settings.hideComments) {
    return;
  }

  if (comments) {
    const notTranslatedDotsLabels: any = [];

    comments.forEach((comment: any) => {
      const extendedComment = extendComment(comment);

      switch (comment.type) {
        case TYPES.FLAG_X:
          drawFlagX(chart, extendedComment);
          break;
        case TYPES.LINE_X:
          drawLineX(chart, extendedComment);
          break;
        case TYPES.BAND_X:
          drawBandX(chart, extendedComment, false);
          break;
        case TYPES.DOT_XY:
          drawDot(chart, extendedComment);

          // eslint-disable-next-line no-case-declarations
          const metaDotLabel = drawDotLabel(chart, extendedComment);

          if (metaDotLabel) {
            notTranslatedDotsLabels.push(metaDotLabel);
          }
          break;
      }
    });

    translateDotsLabels(chart, notTranslatedDotsLabels);
  }
}

function drawOnlyRendererComments(chart: any, comments: any = [], settings: any): void {
  if (settings.hideComments) {
    return;
  }

  const notTranslatedDotsLabels: any = [];

  if (comments && comments.length && chart.container) {
    chart.container.querySelectorAll(`.${HIGHCHARTS_RENDERER_COMMENT}`).forEach((elem: any) => elem.remove());

    comments.forEach((comment: any) => {
      const extendedComment = extendComment(comment);

      switch (comment.type) {
        case TYPES.BAND_X:
          drawBandX(chart, extendedComment, true);
          break;
        case TYPES.DOT_XY:
          // eslint-disable-next-line no-case-declarations
          const metaDotLabel = drawDotLabel(chart, extendedComment);
          if (metaDotLabel) {
            notTranslatedDotsLabels.push(metaDotLabel);
          }
          break;
      }
    });

    translateDotsLabels(chart, notTranslatedDotsLabels);
  }
}

function hideComments(chart: any, comments: any, settings: any, force: any): void {
  // TODO: нужен отельный метод для hide|show = redraw
  // тут проверка на chart, т.к. пока форма открыта, график может обновиться и chart-а, что тут, уже не будет
  if (chart && chart.container && comments) {
    chart.container.querySelectorAll(`.${HIGHCHARTS_COMMENT}`).forEach((elem: any) => elem.remove());
    chart.container.querySelectorAll(`.${HIGHCHARTS_RENDERER_COMMENT}`).forEach((elem: any) => elem.remove());

    comments.forEach((comment: any) => {
      const extendedComment = extendComment(comment);

      if (extendedComment.type === TYPES.DOT_XY) {
        const seriesIndex = chart.series.findIndex((graph: any) => graph.userOptions.id === extendedComment.graphId);

        if (seriesIndex !== -1) {
          const point = chart.series[seriesIndex].data.find((_point: any) => _point && _point.x === extendedComment.x);
          if (point) {
            point.update({ marker: {} }, false, false);
          }
        }
      }
    });

    if (force) {
      settings.hideComments = true;
    }

    chart.redraw();
  }
}

export { drawComments, drawOnlyRendererComments, hideComments };
