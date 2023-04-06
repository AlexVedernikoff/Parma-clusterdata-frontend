import block from 'bem-cn-lite';
import merge from 'lodash/merge';

import settings from '../settings/settings';
import { fetchScript, numberFormat } from '../../helpers/helpers';
import ErrorDispatcher, { ERROR_TYPE } from '../error-dispatcher/error-dispatcher';
import defineModules from './modules/modules';
import defaultMapper from './polygonmap/defaultMapper';

const ONLOAD = '__chartkit_ymaps_onload';
const ONERROR = '__chartkit_ymaps_onerror';

const API_URL =
  'https://api-maps.yandex.ru/2.1' +
  `?lang=${settings.lang}_RU` +
  `&mode=${settings.isProd ? 'release' : 'debug'}` +
  '&ns=' + // пустое значение, чтобы API не попадало в глобальную область видимости
  `&onload=${ONLOAD}` +
  `&onerror=${ONERROR}`;

function mapper(feature) {
  const mappedFeature = defaultMapper.call(this, feature);
  const nameProperty = this.options.get('nameProperty');
  const name = nameProperty ? mappedFeature.properties[nameProperty] : undefined;
  return merge({}, mappedFeature, {
    properties: {
      name,
      text: this.options.get('valuesText'),
      value:
        mappedFeature.properties.pointsWeight === undefined
          ? mappedFeature.properties.pointsCount
          : mappedFeature.properties.pointsWeight,
    },
  });
}

function arrayOfArraysToPointsCollection(points) {
  return {
    type: 'FeatureCollection',
    features: points.map(([coordA, coordB, weight]) => {
      return {
        geometry: {
          coordinates: [coordA, coordB],
          type: 'Point',
        },
        properties: { weight },
        type: 'Feature',
      };
    }),
  };
}

const b = block('chartkit-tooltip');

export default class YandexMap {
  static _ymaps;
  static _promise;
  static _shared = {};

  static _loadApi() {
    return new Promise((resolve, reject) => {
      window[ONLOAD] = api => {
        YandexMap._ymaps = api;
        resolve(api);
        delete window[ONLOAD];
      };

      window[ONERROR] = error => {
        reject(ErrorDispatcher.wrap({ type: ERROR_TYPE.INCLUDES_LOADING_ERROR, error }));
        delete window[ONERROR];
      };

      fetchScript(API_URL).catch(error => {
        throw ErrorDispatcher.wrap({ type: ERROR_TYPE.INCLUDES_LOADING_ERROR, error });
      });
    });
  }

  static _initModules() {
    try {
      defineModules(YandexMap._ymaps);

      YandexMap._ymaps.template.filtersStorage.add('number', (dataLogger, value) => numberFormat(value));

      // https://tech.yandex.ru/maps/jsbox/2.1/placemark_hint_layout
      YandexMap._shared.hintLayout = YandexMap._ymaps.templateLayoutFactory.createClass(
        // без `display: none` с условием на существование блока тултит выходит за границы экрана
        // <wbr> для "разбивания" на 2 условные таблицы: properties.data и properties.value + properties.text
        `<div 
                    class="${b({ 'yandex-map': true })}"
                    {% if (!(properties.name || properties.value !== undefined || properties.text || properties.data)) %}
                        style="display: none"
                    {% endif %} 
                >
                    {% if (properties.name) %}
                        <div class="${b('header')}">
                            {{properties.name}}
                        </div>
                    {% endif %}
                    
                    {% if (properties.value !== undefined || properties.text) %}
                        <div class="${b('row')}">
                            {% if (properties.value !== undefined) %}
                                <div class="${b('cell', { 'yandex-map': true })}">{{properties.value|number}}</div>
                            {% endif %}
                            {% if (properties.text) %}
                                <div class="${b('cell', { 'yandex-map': true })}">
                                    {% if (properties.rawText) %}
                                        {{properties.text|raw}}
                                    {% else %}
                                        {{properties.text}}
                                    {% endif %}
                                </div>
                            {% endif %}
                        </div>
                    {% endif %}
                   
                    {% if (properties.data) %}
                        <wbr>    
                        {% for part in properties.data %}
                            <div class="${b('row')}">
                                <div class="${b('cell')}">
                                    <span class="${b('color')}" style="background-color: {{part.color}};"></span>
                                </div>
                                <div class="${b('cell', { 'yandex-map': true })}">{{part.weight|number}}</div>
                                <div class="${b('cell', { 'yandex-map': true })}">
                                    {% if (properties.rawText) %}
                                        {{part.text|raw}}
                                    {% else %}
                                        {{part.text}}
                                    {% endif %}
                                </div>
                            </div>
                        {% endfor %}
                    {% endif %}           
                </div>`,
        {
          // Определяем метод getShape, который будет возвращать размеры макета хинта.
          // Это необходимо для того, чтобы хинт автоматически сдвигал позицию при выходе за пределы карты.
          getShape: function() {
            const element = this.getElement();
            let result = null;
            if (element) {
              const firstChild = element.firstChild;
              result = new YandexMap._ymaps.shape.Rectangle(
                new YandexMap._ymaps.geometry.pixel.Rectangle([
                  [0, 0],
                  [firstChild.offsetWidth, firstChild.offsetHeight],
                ]),
              );
            }
            return result;
          },
        },
      );

      // https://tech.yandex.ru/maps/jsbox/2.1/balloon_autopan
      // TODO: balloonLayout не завелся - неправильно позиционировался и не закрывался
      YandexMap._shared.balloonContentLayout = YandexMap._ymaps.templateLayoutFactory.createClass(
        `{% if (properties.balloonContentHeader || properties.balloonContentBody || properties.balloonContentFooter) %}
                    <div class="${b()}">
                        <div class="${b('header')}">
                            $[properties.balloonContentHeader]
                        </div>
                        <div class="${b('row')}">
                            $[properties.balloonContentBody]
                        </div>
                        <div class="${b('footer')}">
                            $[properties.balloonContentFooter]
                        </div>
                    </div>
                {% endif %}`,
      );
    } catch (error) {
      throw ErrorDispatcher.wrap({ type: ERROR_TYPE.INCLUDES_LOADING_ERROR, error });
    }
  }

  // TODO: вызов YandexMap._initModules и YandexMap._promise = null выглядят как-то небрежно
  static async _initYmaps() {
    try {
      if (window.ymaps) {
        YandexMap._ymaps = window.ymaps;
      } else if (!YandexMap._promise) {
        YandexMap._promise = YandexMap._loadApi().then(YandexMap._initModules);
      }
      await YandexMap._promise;
    } catch (error) {
      // в частности для "Повторить еще раз"
      YandexMap._promise = null;
      throw ErrorDispatcher.wrap({ type: ERROR_TYPE.INCLUDES_LOADING_ERROR, error });
    }
  }

  static async draw({ node, data, config: { ymap: { state, options: configOptions } = {} } }) {
    if (!YandexMap._ymaps) {
      await YandexMap._initYmaps();
    }

    const map = new YandexMap._ymaps.Map(
      node,
      {
        controls: [],
        behaviors: [],
        ...state,
      },
      {
        suppressMapOpenBlock: true,
        hintCloseTimeout: 100,
        hintOpenTimeout: 100,
        hintPane: 'hint',
        hintLayout: YandexMap._shared.hintLayout,
        balloonPanelMaxMapArea: 0,
        ...configOptions,
      },
    );

    // если передавать balloonContentLayout при создании map, то не работает
    const extendOptions = options => ({
      balloonContentLayout: YandexMap._shared.balloonContentLayout,
      ...options,
    });

    data.forEach(item => {
      if (item.collection) {
        const {
          collection: { geometry, properties, children },
          options,
        } = item;

        const geoObjectChildren = children.reduce((result, { feature, options: childOptions }) => {
          result.push(new YandexMap._ymaps.GeoObject(feature, childOptions));
          return result;
        }, []);

        const geoCollection = new YandexMap._ymaps.GeoObjectCollection(
          { geometry, properties, children: geoObjectChildren },
          extendOptions(options),
        );

        map.geoObjects.add(geoCollection);
      } else if (item.clusterer) {
        const { clusterer, options } = item;

        const geoClusterer = new YandexMap._ymaps.Clusterer(options);

        clusterer.forEach(({ feature, options: innerOptions }) => {
          const geoObject = new YandexMap._ymaps.GeoObject(feature, extendOptions(innerOptions));
          geoClusterer.add(geoObject);
        });

        map.geoObjects.add(geoClusterer);
      } else if (item.polygonmap) {
        const {
          polygonmap: { polygons, points = { type: 'FeatureCollection', features: [] }, values },
          options,
        } = item;

        const featurePointsCollection =
          points.type === 'FeatureCollection' ? points : arrayOfArraysToPointsCollection(points);

        const useValues = options.joinByProperty && values;

        let pointsCountMinimum = Number.MAX_SAFE_INTEGER;
        let pointsCountMaximum = Number.MIN_SAFE_INTEGER;
        const valuesDict = useValues
          ? values.reduce((result, value) => {
              const key = value[options.joinByProperty];
              result[key] = value.value;
              pointsCountMinimum = Math.min(pointsCountMinimum, value.value);
              pointsCountMaximum = Math.max(pointsCountMaximum, value.value);
              return result;
            }, {})
          : null;

        YandexMap._ymaps.modules.require(['Polygonmap'], Polygonmap => {
          const polygonmap = new Polygonmap(
            { polygons, points: featurePointsCollection },
            Object.assign(
              {
                onClick: function() {},
                mapper,
              },
              extendOptions(options),
            ),
          );

          if (useValues) {
            polygonmap._data.polygons.features = polygonmap._data.polygons.features.map(feature => {
              const key = feature.properties[options.joinByProperty];
              return merge({}, feature, { properties: { pointsCount: valuesDict[key] } });
            });

            polygonmap.pointsCountMinimum = pointsCountMinimum;
            polygonmap.pointsCountMaximum = pointsCountMaximum;

            polygonmap._initObjectManager();
          }

          polygonmap.setMap(map);
        });
      }
      if (item.gridmap) {
        const featurePointsCollection =
          item.gridmap.type === 'FeatureCollection' ? item.gridmap : arrayOfArraysToPointsCollection(item.gridmap);

        YandexMap._ymaps.modules.require(['Gridmap'], Gridmap => {
          const gridmap = new Gridmap(
            featurePointsCollection,
            merge(
              {
                grid: { bounds: { leftBottom: map.getBounds()[0], rightTop: map.getBounds()[1] } },
                filterEmptyPolygons: true,
                onClick: function() {},
                mapper,
              },
              extendOptions(item.options),
            ),
          );
          gridmap.setMap(map);
        });
      }
      if (item.heatmap) {
        YandexMap._ymaps.modules.require(['Heatmap'], Heatmap => {
          const heatmap = new Heatmap(item.heatmap, extendOptions(item.options));
          heatmap.setMap(map);
        });
      } else {
        const { feature, options } = item;
        const geoObject = new YandexMap._ymaps.GeoObject(feature, extendOptions(options));
        map.geoObjects.add(geoObject);
      }
    });

    return map;
  }
}
