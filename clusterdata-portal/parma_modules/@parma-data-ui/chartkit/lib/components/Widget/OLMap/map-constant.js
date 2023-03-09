export class MapConstant {
    static DEFAULT_MAP_LAYER_OPACITY = 1;
    static MAP_LEGEND_RANGES_LIMIT = 6;
    static MAP_LEGEND_DASH = ' - ';

    static get defaultMapLayerOpacity() {
        return MapConstant.DEFAULT_MAP_LAYER_OPACITY;
    }

    static get defaultRangePickerValue() {
        return MapConstant.DEFAULT_MAP_LAYER_OPACITY * 100;
    }

    static convertRangePickerValueToOpacity(rangePickerValue) {
        return rangePickerValue / 100;
    }

    static get defaultMapLegendRangesLimit() {
        return MapConstant.MAP_LEGEND_RANGES_LIMIT;
    }

    static get defaultMapLegendDash() {
        return MapConstant.MAP_LEGEND_DASH;
    }
}