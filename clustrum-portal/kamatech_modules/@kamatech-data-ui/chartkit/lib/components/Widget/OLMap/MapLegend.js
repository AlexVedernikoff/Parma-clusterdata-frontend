import styles from './style/legendStyles.css';
import NumberValue from '../../../helpers/number-value';
import MapUtils from './MapUtils';
import { MapConstant } from './map-constant';

class MapLegend {
  static getLegend(mapColor, colorField, mapColorFieldName, clickCallBack, legendElement) {
    if (!mapColor || mapColor.size === 0) {
      return '';
    }
    let items = '';
    mapColor.forEach((value, key) => (items += this.getLegendItem(key, value, colorField, clickCallBack)));
    legendElement.innerHTML = `<div  class="legend" >
                    <div  class="legend__header header">
                        <div  class="header__icon"></div>
                        <div  class="header__title">${mapColorFieldName || 'Легенда'}</div>
                    </div>
                    <div  class="legend__body">
                        <div  class="legend__body-column">
                            <div  class="legend__body-column-list">
                                    <div  class="legend">
                                        ${items}
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    if (clickCallBack) {
      this.addLegendClick(clickCallBack, colorField);
    }
  }

  static addLegendClick(clickCallBack, colorField) {
    Array.from(document.getElementsByClassName('legend__item')).forEach(item => {
      item.addEventListener('click', () => {
        this.unSelectLegendItems();
        clickCallBack({ params: { [colorField[0]]: [item.title] } });
        item.classList.add('selected');
      });
    });
  }

  static unSelectLegendItems() {
    Array.from(document.getElementsByClassName('legend__item')).forEach(i => {
      i.classList.remove('selected');
    });
  }

  static splitStringBySouthands(value) {
    const isFiniteNumber = value && isFinite(value);
    if (isFiniteNumber) {
      return NumberValue.toLocaleString(value);
    }

    const isRangeNumbers = value && value.toString().split(MapConstant.defaultMapLegendDash).length === 2;
    if (isRangeNumbers) {
      const [start, end] = value.split(MapConstant.defaultMapLegendDash);
      return `${NumberValue.toLocaleString(start)} - ${NumberValue.toLocaleString(end)}`;
    }

    return value;
  }

  static getLegendItem(title, color) {
    const splitTitle = MapLegend.splitStringBySouthands(title);
    return `<div  title="${splitTitle}" class="legend__item ng-star-inserted" style="">
                <div  class="legend__item-icon" style="background-color: ${color};"></div>
                <div  class="legend__item-name">${splitTitle}</div>
                <div  class="legend__item-counter ng-star-inserted"></div>
            </div>`;
  }

  static calcHeatmapLegend(features, originalFeatures, opacity = MapConstant.defaultMapLayerOpacity) {
    let colorMap = new Map();

    let maxValue = Math.max.apply(
      Math,
      features.map(feature => {
        return this.color(feature);
      }),
    );

    let minValue = Math.min.apply(
      Math,
      features.map(feature => {
        return this.color(feature);
      }),
    );

    let diff = maxValue - minValue;
    features.forEach((feature, index) => {
      let colorValue = diff > 0 ? ((this.color(feature) + 1 - minValue) / diff) * 100 : 0;
      feature.values_.customProperties.colorValue = colorValue;
    });

    const isRangeLegend =
      MapUtils.isRangeLegend(features[0].values_.customProperties.color_name) &&
      features.length > MapConstant.defaultMapLegendRangesLimit;

    if (isRangeLegend) {
      const colors = [
        [239, 68, 68], // #EF4444
        [248, 113, 113], // #F87171
        [254, 226, 226], // #FEE2E2
        [207, 250, 254], // #CFFAFE
        [79, 167, 48], // #4FA730
        [237, 246, 234], // #EDF6EA
      ];

      colors.forEach(color => {
        color.push(opacity);
      });

      if (diff > 0) {
        let step = Math.ceil(diff / MapConstant.defaultMapLegendRangesLimit);
        colorMap.set(minValue + step * 5 + MapConstant.defaultMapLegendDash + maxValue, 'rgba(' + colors[0] + ')');
        colorMap.set(
          minValue + step * 4 + MapConstant.defaultMapLegendDash + (minValue + step * 5),
          'rgba(' + colors[1] + ')',
        );
        colorMap.set(
          minValue + step * 3 + MapConstant.defaultMapLegendDash + (minValue + step * 4),
          'rgba(' + colors[2] + ')',
        );
        colorMap.set(
          minValue + step * 2 + MapConstant.defaultMapLegendDash + (minValue + step * 3),
          'rgba(' + colors[3] + ')',
        );
        colorMap.set(
          minValue + step + MapConstant.defaultMapLegendDash + (minValue + step * 2),
          'rgba(' + colors[4] + ')',
        );
        colorMap.set(minValue + MapConstant.defaultMapLegendDash + (minValue + step), 'rgba(' + colors[5] + ')');
      } else {
        colorMap.set(minValue, 'rgba(' + colors[0] + ')');
      }
    } else {
      const gradient = MapUtils.featuresGradient(originalFeatures);
      Object.keys(gradient)
        .reverse()
        .forEach(gradientKey => {
          const gradientColor = [...gradient[gradientKey], ...[opacity]];
          colorMap.set(gradientKey, `rgba(${gradientColor})`);
        });
    }

    return colorMap;
  }

  static color(feature) {
    if (feature.values_.customProperties === undefined) {
      feature.values_.customProperties = {
        color: 0,
      };
    }

    return feature.values_.customProperties.color;
  }

  static pickColor(colorMap, colorValue, colorName) {
    if (colorName && typeof colorName === 'string') {
      return colorMap.get(colorName);
    }

    const colorKey = Array.from(colorMap.keys()).find(color => {
      const isRange = color.split && color.split(MapConstant.defaultMapLegendDash).length === 2;
      if (isRange) {
        const [start, end] = color.split(MapConstant.defaultMapLegendDash);
        return colorValue >= Number(start) && colorValue <= Number(end);
      } else {
        return colorValue === Number(color);
      }
    });

    return colorMap.get(colorKey);
  }
}

export default MapLegend;
