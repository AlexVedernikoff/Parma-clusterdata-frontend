import {Circle, Fill, Icon, RegularShape, Stroke, Style} from "ol/style";
import MapLegend from "./MapLegend";
import NumberValue from "../../../helpers/number-value";
import {MapConstant} from './map-constant';
import FeatureColor from './feature-color';

const POINT_ICON_PNG = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAjdQTFRFAAAACpPiCZTjCpPhCZLiC5PjC5LidV2sCpLiFLDsCZLjCpPiCpPiC5TjCpPiCpPiCpPiCZPiCJLiCpPiCpPiCpPiCpPiCZLiCZLiCpPiG5rkYLnsk8/yq9r1ks/yXbfsCpPiCpPiCpPiK6LmldDzweP4weT4lNDyKqHmCpPiCpPiCZLitt/3csHuQ6zpRK3pc8Hvt9/3lNDyCpPiCpPiX7jsuuD3TbDqCJLiUbLqWrbsCpPiCpPiCZPikc7yhcnxC5TiK6HkntDtnNDtKqDkDJTih8rxkM7yCpPiCZLiqtr1W7fshMbr+/f1+vf0dL/qBJHhbr/uCpPiCZLipNf0ar3tXbXo6O/z5+/zVLLoBZHidsLvCZLiCpPigcfwo9b0IJ3lRaznIZ3lfcbwCpPiCpPiSq/qv+P4iMvxKaHmCpPijMzyR67pCpPiCpPiCZPim9Pzi8zxjMzyrtv2mtPzC5LiCpPiXLfsCpPiCpTiCpPiCZLio9f0CpPiCpPiXrjsCpPiCZLiodb0oNX0WrbsVrTrCpPiCpPiCZPimdLzmNLzCpPiCpPhS7DqCpPiCpPjCpPiCZPikM7yj87yCpPiCpPiOKfoN6fnCpPiCpPiCpPiCpPiCpPiCpPiCpPiCpPiCJLiEZbjHpzkGprkxOX4x+b5G5rkxub5CZPiCZLiw+X4EJbjyOb5xeX4BJDhBZHiGZrkC5TiC5PiB5Liw+T4F5nkrtv2wuT4HZvkGJnkEpfjCpPi////FnKMXAAAAKB0Uk5TAAAAAAAAAAAAAAEOHgEFQpTH4JVDBhrv8LH+/f3+/f4ZBJP+/f7+/v6RQO79/f38/v38PpL9/vz++v2MDMP9/f78+/z8/v78Hd/+/fz+/vn++RjX/fz+/v79/vvWrP39/vv+/Klw/P79/v7+/Gkn4P76+/79AZb+jwE77P46ov6f7fz8/PucOej9/DgC+44CLN/9/CuA/Px70dBu/fwTD2ZUOG4AAAABYktHRLxK0uLvAAAACXBIWXMAAAuJAAALiQE3ycutAAABp0lEQVQ4y2NgoC9g5OLm4eHmZcQlzccvICgkJCgsIopVCaOYgPiChYsWLVwgISzGiE1ecoGUtIysrJz84gWSChgqGBWVFiirLFmqqrZ0ibrGAk1FdBWMWtrLVJbr6OrpGxguN1qsbYymgJHJZIHpEjNzixUrLSzNVlktsGZGVcFoY7vabo29g6OTs4ur2xr31bY2aAo8PBd5rfVe5+Pr5x8QuNRrkacHmoKg4MUhy0PXh4VHREZFLw3ZEBOEpkAxdmPc0viETYmJG5PilyZvTEH3BmPq5rT0LRmZWVka2VvSczbnYngzL39rwZJV2wqLilctKdman4ehoLRsQfn27avWrl21fbvVgopKzKCsql5Us2Q7ECypWVRdixkZjHx1C+q3g0H9ggZFbLGl1bijCWjEkuYdjcbY4puRr2FBi9r27WqtC9oUsSeI9o6dnUuWdO3s6Maephh7TDabp6f3bu7rx5HoGCdM3DVp8q6JU3AmSpapC6ZNXzCDEZcCBkaembt3z+LBKc/Ayjh7ztxcRjacChgY58XGzsNtAAMDO+N8bg5OBjoDAAYIhen988AOAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTAyLTAxVDEyOjMwOjM3KzAxOjAwUlma2wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wMi0wMVQxMjozMDozNyswMTowMCMEImcAAABGdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuNy44LTkgMjAxNi0wNi0xNiBRMTYgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfmvzS2AAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OmhlaWdodAA1MTLA0FBRAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUxMhx8A9wAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQ4NTk0ODYzNwvbBsIAAAATdEVYdFRodW1iOjpTaXplADIwLjJLQkIJjBivAAAAVXRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8uL3VwbG9hZHMvY2FybG9zcHJldmkvenU3SHpMdC8xMTAyLzE0ODU5Njk5MjgtMTctbG9jYXRpb25fNzg4OTYucG5nDYjrbwAAAABJRU5ErkJggg==';

const Rainbow = require('rainbowvis.js');

class MapUtils {

    /**
     *
     * @param data
     * @param radius
     * @param {Map} iconCache
     * @returns {Style[]}
     */
   static calculateSectors(data,radius, iconCache) {

        let sectors = [];
        let l = data.size / 2;
        let a = 0; // Angle
        let aRad = 0; // Angle in Rad
        let z = 0; // Size z
        let x = 0; // Side x
        let y = 0; // Side y
        let X = 0; // SVG X coordinate
        let Y = 0; // SVG Y coordinate
        let R = 0; // Rotation

        let colors='';
        data.sectors.map((item) => {
            a = 360 * item.percentage;
            let aCalc = (a > 180) ? 360 - a : a;
            aRad = aCalc * Math.PI / 180;
            z = Math.sqrt(2 * l * l - (2 * l * l * Math.cos(aRad)));
            if (aCalc <= 90) {
                x = l * Math.sin(aRad);
            } else {
                x = l * Math.sin((180 - aCalc) * Math.PI / 180);
            }

            y = Math.sqrt(z * z - x * x);
            Y = y;

            let arcSweep = 0;
            if (a <= 180) {
                X = l + x;
            } else {
                X = l - x;
                arcSweep = 1;
            }

            sectors.push({
                percentage: item.percentage,
                color: item.color,
                arcSweep: arcSweep,
                L: l,
                X: X,
                Y: Y,
                R: R
            });
            colors+=item.color;
            R = R + a;
        });


        let newSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        newSVG.setAttributeNS(null, 'style', "width: 40px; height: 40px");

        sectors.forEach((sector) => {
            let newSector = document.createElementNS("http://www.w3.org/2000/svg", "path");
            newSector.setAttributeNS(null, 'fill', sector.color);
            newSector.setAttributeNS(null, 'd', 'M' + sector.L + ',' + sector.L + ' L' + sector.L + ',0 A' + sector.L + ',' + sector.L + ' 1 0,1 ' + sector.X + ', ' + sector.Y + ' z');
            newSector.setAttributeNS(null, 'transform', 'rotate(' + sector.R + ', ' + sector.L + ', ' + sector.L + ')');
            newSVG.appendChild(newSector);
        });
        let style=iconCache.get(colors+'_'+radius);

        if (style) {
            return style
        }

        let svg = new Image();
        svg.src = 'data:image/svg+xml,<svg style="width: 40px; height: 40px" xmlns="http://www.w3.org/2000/svg">' + escape(newSVG.innerHTML) + "</svg>";

        style= [
           new Style({
               image:  new Icon({
                   img: svg,
                   anchor: [0.52, 0.52],
                   anchorXUnits: 'fraction',
                   anchorYUnits: 'fraction',
                   imgSize: [radius, radius]
               })
           }),
           new Style({
               image: new RegularShape({
                   stroke: new Stroke({ color: [0, 0, 0, 0] }),
                   points: 4,
                   fill:new Fill({color: [0, 0, 0, 0]}),
                   radius: radius,
                   angle: Math.PI / 4
               })
           })
       ];
        iconCache.set(colors+'_'+radius, style);
        return  style;
    }



    static getClusterDistanceByZoom(zoom){
        let number = Math.round(zoom);
        if (number === 1) {
            return 20000;
        } else if (number === 2) {
            return 20000;
        } else if (number === 3) {
            return 20000;
        } else if (number === 4) {
            return 20000;
        } else if (number === 5) {
            return 20000;
        } else if (number === 6) {
            return 10000;
        } else if (number === 7) {
            return 10000;
        } else if (number === 8) {
            return 5000;
        } else if (number === 9) {
            return 5000;
        } else if (number === 10) {
            return 3000;
        } else if (number === 11) {
            return 1800;
        } else if (number === 12) {
            return 1000;
        } else if (number === 13) {
            return 500;
        } else if (number === 14) {
            return 350;
        } else if (number === 15) {
            return 200;
        } else {
            return 500;
        }
    }

    /**
     *Расчитывает стили отображение иконки с секторами
     * @param feature
     * @param zoom
     * @param colorMap
     * @param {Map} iconCache Map
     * @returns {[Style, Style]|Style[]}
     */
    static getFeatureCircleStyle(feature, zoom, colorMap, iconCache) {
        let radius = 5;
        let color = '#156BB1';
        if (!feature.values_['customProperties']) {
            radius = 5;
        }

        if (feature.values_['customProperties']['_size'] !== undefined) {
            let minRadius = 10 - (20 - zoom) / 2 + 1;
            let maxRadius = 50 - (20 - zoom);
            radius = this.getRadius(minRadius, maxRadius, Number(feature.values_['customProperties']['_size']))
        }

        if (feature.values_['customProperties']['_color']) {
            if (feature.values_['customProperties']['_size'] === undefined) {
                radius = 30;
            }
            let colorsData = feature.values_['customProperties']['_color'];
            if (colorsData.length === 1) {
                colorsData.push(colorsData[0])
            }
            let data = {size: radius, sectors: []};
            colorsData.forEach((c) => {
                data.sectors.push({percentage: (100 / colorsData.length) / 100, color: this.getSectorColor(c,colorMap)})
            });
            return MapUtils.calculateSectors(data,radius, iconCache);
        }

        if (feature.values_['customProperties']['_size'] || feature.values_['customProperties']['_color']) {
            let style=iconCache.get(color+'_'+radius);
            if (style){
                return  style
            }
            style= [
                new Style({
                    image: new Circle({
                        radius: radius,
                        fill: new Fill({
                            color: color
                        })
                    })
                }),
                new Style({
                    image: new RegularShape({
                        stroke: new Stroke({ color: [0, 0, 0, 0] }),
                        points: 4,
                        fill:new Fill({color: [0, 0, 0, 0]}),
                        radius: radius,
                        angle: Math.PI / 4
                    })
                })
            ];
            iconCache.set(color+'_'+radius, style);
            return style
        }
    }

    static getRadius(rMin, rMax, position) {
        let diff = rMax - rMin;
        return Math.floor(rMin + (diff * (position / 100)));
    }

    static getSectorColor(colorItem, colorMap) {
        let defaultColors = ['#2f7ed8', '#8bbc21', '#910000', '#1aadce',
            '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'];
        if (colorMap.get(colorItem)) {
            return colorMap.get(colorItem)
        } else {
            let nextColor = defaultColors.find(c => !Array.from(colorMap.values()).includes(c));
            if (!nextColor) {
                nextColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
            }
            colorMap.set(colorItem, nextColor);
            return nextColor;
        }
    }

    /**
     * Разделяет число по тысячным
     *
     * @param value значение (число может прийтий в виде строки, выполняем только для числа)
     * @returns {string|*}
     */
    static splitStringBySouthands(value) {
        return isFinite(value)
            ? NumberValue.toLocaleString(value)
            : value;
    }

    static defaultPointStyle() {
        let svg = new Image();
        svg.src = 'data:image/png;base64,' + POINT_ICON_PNG;
        return new Style({
            image: new Icon({
                img: svg,
                anchor: [0.1, 0.1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                imgSize: [30, 30],
            }),
        });
    }

    static clusterPointStyle() {
        return  new Style({
            image: new Circle({
                radius: 12,
                stroke: new Stroke({
                    color: 'rgb(63, 170, 232)'
                }),
                fill: new Fill({
                    color: 'rgb(194, 228, 248)'
                })
            })
        });
    }

    static polygonStyle({ feature, color, isFeatureDeselected, colorMap, opacity = MapConstant.defaultMapLayerOpacity}) {
        if (
            ![null, undefined].includes(feature.values_.customProperties) &&
            ![null, undefined].includes(feature.values_.customProperties.color) &&
            !color
        ) {
            color = MapLegend.pickColor(
                colorMap, 
                feature.values_.customProperties.color, 
                feature.values_.customProperties.color_name
            );
        }

        if (isFeatureDeselected) {
            color = `rgba(80,80,80,${opacity})`;
        }

        return new Style({
            stroke: new Stroke({
                color,
                width: 1,
            }),
            fill: new Fill({
                color,
            }),
        });
    }

    static featuresGradient(features) {
        const rainbow = new Rainbow();

        if (features.length > 1) {
          rainbow.setNumberRange(0, features.length - 1);
        }

        rainbow.setSpectrum(...MapUtils.spectrum(features.length));

        const gradient = {};

        features
            .sort((a, b) => {
                return b.properties.customProperties.color - a.properties.customProperties.color; 
            })
            .forEach((feature, index) => {
                gradient[new FeatureColor(feature).featureColorKey()] =
                    (features.length > 0)
                        ? MapUtils.hexToRgb(rainbow.colourAt(index))
                        : '#FF445D';
            })
        
        return gradient;
    }

    static spectrum(rangeSize) {
        if (rangeSize <= 4) {
            return ['#EF4444', '#F87171', '#4FA730', '#EDF6EA'];
        }

        return ['#EF4444', '#F87171', '#FEE2E2', '#CFFAFE', '#4FA730', '#EDF6EA'];
    }

    static hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
    }

    static isRangeLegend(colorName) {
        return colorName === undefined || colorName === null || typeof colorName === 'number';
    }
}
export  default MapUtils
