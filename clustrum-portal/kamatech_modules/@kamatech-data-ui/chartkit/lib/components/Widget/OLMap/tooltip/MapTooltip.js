import * as ol from 'ol';
import MapTooltipTemplate from './MapTooltipTemplate';
import MapUtils from './../MapUtils';

export default class MapTooltip {
  static updateTooltip(olmap, mapId) {
    const tooltip = document.getElementById(`tooltip-${mapId}`);

    if (tooltip == null) {
      return;
    }

    MapTooltipTemplate.tooltip = tooltip;

    if (MapTooltipTemplate.overlay) {
      olmap.removeOverlay(MapTooltipTemplate.overlay);
    }

    MapTooltipTemplate.overlay = new ol.Overlay({
      element: MapTooltipTemplate.tooltip,
      offset: MapTooltip.mapTooltipOffset(),
      positioning: 'top-left',
    });

    olmap.addOverlay(MapTooltipTemplate.overlay);
  }

  /**
   * Должен быть подобран такой отступ для всплывающей подсказки,
   * чтобы он не мешал клику на фичу,
   * но и чтобы можно было успеть навести курсор на всплывающую подсказу для
   * дальнейшего перехода по гиперссылке
   * @return {number[]}
   */
  static mapTooltipOffset() {
    return [5, 5];
  }

  static displayTooltip(evt) {
    let pixel = evt.pixel;
    let feature = evt.map.forEachFeatureAtPixel(pixel, function(feat) {
      return feat;
    });

    if (feature) {
      const customProperties = feature.values_.customProperties;
      const { tooltips, cluster_size: clusterSize } = customProperties;

      if (tooltips && tooltips.length > 0) {
        MapTooltipTemplate.tooltip.style.display = '';
        MapTooltipTemplate.overlay.setPosition(evt.coordinate);

        const tooltipsValues = this._tooltipsValues(clusterSize, tooltips);
        MapTooltipTemplate.tooltip.innerHTML = MapTooltipTemplate.tooltipsTemplate(tooltipsValues);
      }
    } else {
      if (MapTooltipTemplate.tooltip) {
        MapTooltipTemplate.tooltip.style.display = 'none';
      }
    }
  }

  static _tooltipsValues(clusterSize, tooltips) {
    if (clusterSize > 1) {
      return [
        MapTooltip._tooltipValue({
          tooltip_placeholder_title: 'Количество объектов',
          tooltip_value: clusterSize,
        }),
      ];
    }

    return tooltips.map(tooltip => MapTooltip._tooltipValue(tooltip));
  }

  static _tooltipValue(tooltip) {
    return {
      title: tooltip.tooltip_placeholder_title,
      value: MapUtils.splitStringBySouthands(tooltip.tooltip_value),
    };
  }
}
