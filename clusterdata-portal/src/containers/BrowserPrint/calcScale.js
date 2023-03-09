

const FORMAT_SCALES = {
    1366: 0.9,
    1440: 0.855,
    1536: 0.8,
    1600: 0.765,
    1920: 0.63,
    2048: 0.59,
    2560: 0.47,
    2880: 0.415,
    3200: 0.372,
    4096: 0.29,
    4800: 0.245,
};

/**
 * Подсчет масштаба дашборда в зависимости от ширины браузера
 * Есть зафиксированные форматы с уже подсчитанными популярными масштабами (FORMAT_SCALES).
 * 1) Если ширина браузера равна одному из масштабу, то считать ничего не надо - просто отдаем соответствующий масштаб
 * 2) Если ширина браузера не равна ни одному масштабу, то:
 *   - находим диапазон в которой лежит ширина
 *   - строим прямую между ними
 *   - высчитываем масштаб используя Уравнение прямой, проходящей через две различные точки на плоскости (x - x1) / (x2 - x1) = (y - y1) / (y2 - y1) 
 */
const calcScale = () => {
    const width = window.innerWidth;
    const formats = Object.keys(FORMAT_SCALES).map(format => Number(format));
    
    // если ширина браузера совпала с подчитанным форматом
    let formatEqualWidth = formats.find(format => format === width);
    if (formatEqualWidth) {
        return FORMAT_SCALES[formatEqualWidth];
    }

    // если нет, то высчитываем масштаб используя Уравнение прямой, проходящей через две различные точки на плоскости

    // находими ближайший формат
    const diffs = formats.map(format => Math.abs(format - width));
    const leastDiff = diffs.sort((a, b) => a - b)[0];
    const nearestFormat = formats.find(format => Math.abs(format - width) === leastDiff);
    const nearestFormatIndex = formats.findIndex(format => format === nearestFormat);

    // определяем левую и правую точки прямой
    let leftFormat;
    let rightFormat;
    if (nearestFormat < width) {
        leftFormat = nearestFormat;
        rightFormat = formats[nearestFormatIndex + 1]
    } else {
        rightFormat = nearestFormat;
        leftFormat = formats[nearestFormatIndex - 1]
    }

    const leftScale = FORMAT_SCALES[leftFormat];
    const rightScale = FORMAT_SCALES[rightFormat];

    const x1 = leftScale;
    const x2 = rightScale;
    const y = width;
    const y1 = leftFormat;
    const y2 = rightFormat;

    const scale = ( ((y - y1) * (x2 - x1)) / (y2 - y1) ) + x1;

    return scale;
}

export default calcScale;
