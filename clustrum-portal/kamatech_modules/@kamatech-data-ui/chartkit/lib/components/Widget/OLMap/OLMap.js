import React from 'react';
import PropTypes from 'prop-types';
import XYZ from 'ol/source/XYZ';
import { Vector as VectorLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import { GeoJSON } from 'ol/format.js';
import ChartsModule from '../../../modules/charts/charts';
import { bbox as bboxStrategy } from 'ol/loadingstrategy.js';
import { defaults as defaultInteractions } from 'ol/interaction';
import { transformExtent } from 'ol/proj';
import * as ol from 'ol';
import uuid from 'uuid/v1';
import TileLayer from 'ol/layer/Tile';
import MapUtils from './MapUtils';
import MapLegend from './MapLegend';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import TileWMS from 'ol/source/TileWMS';
import Url from '../../../helpers/url';
import Select from 'ol/interaction/Select';
import Zoom from 'ol/control/Zoom';
import { MapConstant } from './map-constant';
import MapTooltip from './tooltip/MapTooltip';
import { $appSettingsStore } from '@entities/app-settings';

const EPSG_3857 = 'EPSG:3857';
const EPSG_4326 = 'EPSG:4326';

/**
 * todo выделить в OLMap 2 разные сущности (тепловая карта и карта кластеров)
 * сейчас в коде много проверок isHeatMap
 */
class OLMap extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    chartEditMode: PropTypes.object,
    onError: PropTypes.func.isRequired,
    onStateAndParamsChange: PropTypes.func,
  };

  state = {
    prevData: null,
    options: null,
  };

  #vectorHeatmapSource = null;
  #ownWidgetParamsFeature = null;

  chartComponent = React.createRef();
  geoJson;
  customProperties;
  customData;

  constructor(props) {
    super(props);

    const geoJson = this.props.data.data.geoJson;

    this._projection = geoJson.coordType;
    this.state = { center: this.#defaultCenterInEpsg3857(), zoom: 3 };
    this.colorMap = new Map();
    this.iconCache = new Map();
    this.selectedFeatures = new Map();
    this.mapId = uuid();

    this.currentZoom = null;
    this.currentBbox = null;
    this.hasMoveToDataExtent = true;
    this.loadedData = this.props.data;
    this.isLoadingData = false;

    const titleLayerSourceDelimiter = ';';
    this.titleLayer = geoJson.titleLayerSource
      .split(titleLayerSourceDelimiter)
      .map(url => this.tileLayer(url))
      .filter(layer => layer != null);

    // Если тепловая карта
    if (this.isHeatMap()) {
      this.initVectorHeatmapSource();
      this.initVectorHeatMap();
      this.initHeatMap();
      this.initSelection();

      return;
    }

    // Если карта кластеров
    this.initVectorSource();
    this.initVector();
    this.initPointMap();
    this.initPointMapEvents();
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.data === prevState.prevData) {
      return null;
    }
    return {
      prevData: nextProps.data,
    };
  };

  componentDidMount = () => {
    this.olmap.setTarget(`map-${this.mapId}`);

    this.olmap.on('click', this.#handleMapClick);
    this.olmap.on('pointermove', e => {
      const pixel = this.olmap.getEventPixel(e.originalEvent);
      const hit = this.olmap.hasFeatureAtPixel(pixel);
      this.olmap.getViewport().style.cursor = hit ? 'pointer' : '';
      MapTooltip.displayTooltip(e);
    });

    this.props.onLoad();
  };

  componentDidUpdate = () => {
    this.updateMap();

    if (!this.state.isError) {
      if (this.chartComponent.current) {
        const container = this.chartComponent.current.container.current;
        container.style.flex = '1';
      }
      this.props.onLoad();

      // может вызываться после unmount, поэтому проверям наличие ref
      window.requestAnimationFrame(
        () => this.chartComponent.current && this.chartComponent.current.chart.reflow(),
      );
    }
  };

  componentDidCatch = error => {
    this.props.onError({ error, widgetData: this.state.options });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const { data, chartEditMode } = nextProps;
    const center = this.state.center;
    const zoom = this.state.zoom;

    return !(
      isEqual(data, this.props.data) &&
      isEqual(chartEditMode, this.props.chartEditMode) &&
      center === nextState.center &&
      zoom === nextState.zoom
    );
  };

  #updateLegend = loadedData => {
    const mapColorField =
      loadedData.data.geoJson.customData &&
      loadedData.data.geoJson.customData['mapColor'];
    const mapColorFieldName =
      loadedData.data.geoJson.customData &&
      loadedData.data.geoJson.customData['mapColorFieldName'];

    MapLegend.getLegend(
      this.colorMap,
      mapColorField,
      mapColorFieldName,
      this.props.onStateAndParamsChange,
      document.getElementById(`legend-${this.mapId}`),
    );
  };

  /**
   * если в тултипе есть ссылка, то пытаемся ее открыть на новой вкладке по клику
   * */
  #redirectByTooltipHref = feature => {
    const hrefRegex = /href=['"]([^'"]+?)['"]/;
    const tooltip_value = get(
      feature,
      'values_.customProperties.tooltips[0].tooltip_value',
    );
    const hrefResult =
      typeof tooltip_value === 'string' && tooltip_value.match(hrefRegex);
    const href = hrefResult && hrefResult[1];
    if (href) {
      window.open(href);
    }
  };

  #onFeatureClickEvent = feature => {
    if (this.#isFeatureCluster(feature)) {
      return;
    }

    //todo Внимание хардкор
    if (
      this.id === 'af5585e8-3272-48a8-bf44-008b5c828bec' &&
      feature.values_.customProperties &&
      feature.values_.customProperties.id_group
    ) {
      let url =
        '/card?id=6e15d2f8-8eca-40ab-99f6-d92e4e368fb3&22e71bc3-4ecd-41ba-ba90-89e6ca60f390=' +
        feature.values_.customProperties.id_group[0];
      window.open(url);
    }

    if (
      (this.id === 'cfa33666-d8a3-4ac8-b3f7-8e28e0a62d85' ||
        this.id === '7e781e90-1b69-41ea-a6a8-84c996706539' ||
        this.id === 'a9b35b49-552c-4985-91d6-a3b746552435') &&
      feature.values_.customProperties &&
      feature.values_.customProperties.id_group
    ) {
      let url =
        '/card?id=1d9f4a5e-f1d4-4ce0-8f50-84c6ea22056a&1ad8b5e8-afda-4e64-81b3-f5d460cd90e6=' +
        feature.values_.customProperties.id_group[0];
      window.open(url);
    }

    if (
      (this.id === '150d80a8-b859-4215-bbfa-4cdf53549cb2' ||
        this.id === '181bb224-6a16-4471-9a21-e329d2530d79' ||
        this.id === 'ee00e0e1-aba2-4abd-a140-2f3a90f21415') &&
      feature.values_.customProperties &&
      feature.values_.customProperties.id_group
    ) {
      let url =
        '/card?id=e8e6f771-48e5-4e0a-aba1-91331c666c7c&7e1dcc65-8ceb-468d-8c46-d6cd559a34e9=' +
        feature.values_.customProperties.id_group[0];
      window.open(url);
    }

    this.#redirectByTooltipHref(feature);
  };

  #onCenterChanged = async () => {
    if (this.currentZoom === this.#currentZoom() && this.currentBbox === this.#bbox()) {
      return;
    }

    if (this.currentZoom != null) {
      this.hasMoveToDataExtent = false;
    }

    this.currentZoom = this.#currentZoom();
    this.currentBbox = this.#bbox();

    await this.#loadVectorSource();
  };

  #loadVectorSource = async () => {
    if (this._vectorSource) {
      await this.loadData();
    }
  };

  #currentZoom = () => {
    return Math.round(this.olmap.getView().getZoom());
  };

  #handleSelect = event => {
    const selectedFeatures = event.selected.map(feature => ({
      id: feature.id_,
      value: feature.values_.customProperties.drill_down_filter,
    }));

    const deselectedFeatures = event.deselected.map(feature => ({
      id: feature.id_,
      value: feature.values_.customProperties.drill_down_filter,
    }));

    if (this.#ownWidgetParamsFeature) {
      deselectedFeatures.push(this.#ownWidgetParamsFeature);

      this.#ownWidgetParamsFeature = null;
    }

    this.#updateFeatures(selectedFeatures, deselectedFeatures);
    this.#onChange();
  };

  #updateFeatures = (selectedFeatures, deselectedFeatures) => {
    selectedFeatures?.forEach(feature => {
      this.selectedFeatures.set(feature.id, feature.value);
    });

    deselectedFeatures?.forEach(feature => {
      this.selectedFeatures.delete(feature.id);
    });

    const isAllFeaturesDeselected = this.selectedFeatures.size === 0;

    this.#vectorHeatmapSource.forEachFeature(feature => {
      const isSelected = this.selectedFeatures.has(feature.id_);
      const style = MapUtils.polygonStyle({
        feature,
        isFeatureDeselected: !(isAllFeaturesDeselected || isSelected),
        colorMap: this.colorMap,
        opacity: this.#getMapLayerOpacity(this.loadedData),
      });

      feature.setStyle(style);
    });
  };

  #applyOwnWidgetParams = () => {
    const ownWidgetParams = this.props.ownWidgetParams;

    if (!(ownWidgetParams?.size > 0)) {
      return;
    }

    const features = this.loadedData.data.geoJson.features;
    let selectedFeatureValue;

    for (const param of ownWidgetParams) {
      selectedFeatureValue = param[1][0];

      break;
    }

    const selectedFeature = features.find(
      feature =>
        feature.properties.customProperties.drill_down_filter === selectedFeatureValue,
    );

    if (selectedFeature) {
      this.#updateFeatures(
        [{ id: selectedFeature.id, value: selectedFeatureValue }],
        this.#ownWidgetParamsFeature &&
          this.#ownWidgetParamsFeature.id !== selectedFeature.id
          ? [this.#ownWidgetParamsFeature]
          : [],
      );

      this.#ownWidgetParamsFeature = {
        id: selectedFeature.id,
        value: selectedFeatureValue,
      };
    }
  };

  #onChange = () => {
    const paramId = this.loadedData.data.groupField;
    const onStateAndParamsChange = this.props.onStateAndParamsChange;

    if (paramId === null || paramId === undefined) {
      return;
    }

    if (this.selectedFeatures.size === 0) {
      onStateAndParamsChange({ paramsForRemoving: [paramId] });

      return;
    }

    const paramValue = [...this.selectedFeatures.values()].filter(
      featureValue => featureValue !== null,
    );

    onStateAndParamsChange({ params: { [paramId]: paramValue } });
  };

  #handleMapClick = event => {
    let isFeature = false;

    this.olmap.forEachFeatureAtPixel(event.pixel, feature => {
      isFeature = true;

      this.#onFeatureClickEvent(feature);
    });

    if (this.isHeatMap() && !isFeature && this.#ownWidgetParamsFeature) {
      this.#updateFeatures([], [this.#ownWidgetParamsFeature]);
      this.#onChange();

      this.#ownWidgetParamsFeature = null;
    }
  };

  #vectorSourceLoader = async () => {
    await this.#loadDataIfNotExists();
    this.run();
  };

  #loadDataIfNotExists = async () => {
    if (this.loadedData === null) {
      await this.loadData();
    }
  };

  #refreshVectorSourceForced = () => {
    this._vectorSource.refresh({ force: true });
  };

  #isFeatureCluster = feature => {
    return this.#featureClusterSize(feature) > 1;
  };

  #featureClusterSize = feature => {
    if (
      feature.getProperties() &&
      feature.getProperties().customProperties &&
      feature.getProperties().customProperties['cluster_size']
    ) {
      return feature.getProperties().customProperties['cluster_size'];
    }

    return 0;
  };

  #defaultCenterInEpsg3857 = () => {
    return [4187575.9730472257, 7509957.911867683];
  };

  #extentToProjection = extent => {
    switch (this._projection) {
      case EPSG_3857:
        return extent;
      case EPSG_4326:
        return transformExtent(extent, EPSG_3857, EPSG_4326);
    }
  };

  #bbox = () => {
    return this.#roundedBbox(
      this.#extentToProjection(
        this.olmap.getView().calculateExtent(this.olmap.getSize()),
      ),
    );
  };

  #roundedBbox = bbox => {
    return bbox.map(coordinate => +coordinate.toFixed(6));
  };

  #clusterPrecision = () => {
    console.log('zoom:', this.#currentZoom());
    switch (this.#currentZoom()) {
      case 0:
      case 1:
      case 2:
      case 3:
        return 1;
      case 4:
      case 5:
        return 2;
      case 6:
      case 7:
        return 3;
      case 8:
      case 9:
        return 4;
      case 10:
      case 11:
        return 5;
      case 12:
      case 13:
        return 6;
      case 14:
        return 7;
      case 15:
        return 8;
      case 16:
        return 9;
      case 17:
        return 10;
      case 18:
        return 11;
      default:
        return 12;
    }
  };

  #moveToDataExtent = () => {
    let extent = this.#extent();

    if (extent === null) {
      return;
    }

    if (isFinite(extent[0]) && isFinite(extent[1])) {
      this.olmap.getView().setMaxZoom(20);
      this.olmap.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 500,
        minResolution: 20,
        nearest: true,
      });
    } else {
      this.olmap.getView().setZoom(this.state.zoom - 1);
    }
  };

  #extent = () => {
    if (this._vectorSource) {
      return this._vectorSource.getExtent();
    }

    if (this.#vectorHeatmapSource) {
      return this.#vectorHeatmapSource.getExtent();
    }

    return null;
  };

  #getMapLayerOpacity = loadedData => {
    const mapLayerOpacity = loadedData && loadedData.data.geoJson.mapLayerOpacity;
    return mapLayerOpacity === null
      ? MapConstant.defaultMapLayerOpacity
      : MapConstant.convertRangePickerValueToOpacity(mapLayerOpacity);
  };

  #featureProjection = () => {
    switch (this._projection) {
      case EPSG_3857:
        return {};
      case EPSG_4326:
        return {
          featureProjection: EPSG_3857,
        };
    }
  };

  tileLayer = url => {
    if (url.includes('wms')) {
      return this.tileWMSLayer(url);
    }

    if (url.includes('{z}') && url.includes('{y}') && url.includes('{x}')) {
      return this.tileXYZLayer(url);
    }

    return this.tileXYZLayer($appSettingsStore.getState().dotenv.MAP_LAYER_SOURCE);
  };

  tileXYZLayer = url => {
    return new TileLayer({
      source: new XYZ({
        url: url,
      }),
    });
  };

  tileWMSLayer = url => {
    const urlParams = Url.getAllUrlParameters(url);
    urlParams['TILED'] = true;

    return new TileLayer({
      source: new TileWMS({
        url: url,
        params: urlParams,
        serverType: 'geoserver',
        // Countries have transparency, so do not fade tiles:
        transition: 0,
      }),
    });
  };

  initPointMap = () => {
    this.olmap = new ol.Map({
      controls: [
        new Zoom({
          zoomInTipLabel: 'Увеличить',
          zoomOutTipLabel: 'Уменьшить',
        }),
      ],
      target: null,
      layers: [...this.titleLayer, this.vector],
      interactions: defaultInteractions({ mouseWheelZoom: true }),
      view: new ol.View({
        center: this.state.center,
        zoom: this.state.zoom,
        projection: EPSG_3857,
      }),
    });
  };

  initPointMapEvents = () => {
    this.olmap.on('moveend', async () => {
      await this.#onCenterChanged();
    });
  };

  initHeatMap = () => {
    this.olmap = new ol.Map({
      controls: [
        new Zoom({
          zoomInTipLabel: 'Увеличить',
          zoomOutTipLabel: 'Уменьшить',
        }),
      ],
      target: null,
      layers: [...this.titleLayer, this._vectorHeatmap],
      interactions: defaultInteractions({ mouseWheelZoom: true }),
      view: new ol.View({
        center: this.state.center,
        zoom: this.state.zoom,
        projection: EPSG_3857,
      }),
    });
  };

  initSelection = () => {
    const select = new Select();

    this.olmap.addInteraction(select);
    select.on('select', this.#handleSelect);
  };

  initVectorSource = () => {
    this._vectorSource = new VectorSource({
      format: new GeoJSON(),
      loader: async () => this.#vectorSourceLoader(),
      strategy: bboxStrategy,
      projection: EPSG_3857,
    });
  };

  initVector = () => {
    this.vector = new VectorLayer({
      source: this._vectorSource,
      renderBuffer: 10000,
    });

    this.vector.setStyle(feature => {
      if (['MultiPolygon', 'Polygon'].includes(feature.getGeometry().getType())) {
        return MapUtils.polygonStyle({
          feature,
          color: [2, 123, 120],
          colorMap: this.colorMap,
        });
      }

      let circleStyle = MapUtils.getFeatureCircleStyle(
        feature,
        this.olmap.getView().getZoom(),
        this.colorMap,
        this.iconCache,
      );

      if (circleStyle) {
        return circleStyle;
      }

      if (this.#isFeatureCluster(feature)) {
        return MapUtils.clusterPointStyle();
      }

      let defaultPointStyle = this.iconCache.get('default');

      if (!defaultPointStyle) {
        defaultPointStyle = MapUtils.defaultPointStyle();
        this.iconCache.set('default', defaultPointStyle);
      }

      return [defaultPointStyle];
    });
  };

  initVectorHeatmapSource = () => {
    this.#vectorHeatmapSource = new VectorSource({
      format: new GeoJSON(),
      loader: async () => this.#vectorSourceLoader(),
      strategy: bboxStrategy,
      projection: this._projection,
    });
  };

  initVectorHeatMap = () => {
    this._vectorHeatmap = new VectorLayer({
      source: this.#vectorHeatmapSource,
    });

    this.changeVectorHeatmapStyle();
  };

  changeVectorHeatmapStyle = () => {
    this._vectorHeatmap.setStyle(feature => {
      const colorName = feature.values_.customProperties.color_name;
      const isRangeLegend = colorName === undefined || typeof colorName === 'number';
      const polygonColor = isRangeLegend ? null : this.colorMap.get(colorName);

      return MapUtils.polygonStyle({
        feature,
        color: polygonColor,
        colorMap: this.colorMap,
        opacity: this.#getMapLayerOpacity(this.loadedData),
      });
    });
  };

  updateMap = () => {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);

    this.hasMoveToDataExtent = true;
    this.loadedData = null;

    if (this._vectorSource) {
      this.#refreshVectorSourceForced();
    }

    if (this.#vectorHeatmapSource) {
      this.#vectorHeatmapSource.refresh({ force: true });
    }
  };

  isHeatMap = () => {
    return (
      this.props.data.data.geoJson.widgetType.toLowerCase() === 'heatMap'.toLowerCase()
    );
  };

  /*
   * todo тут не должно быть метода run, этот метод есть в компоненте Charts (должен находиться там)
   * сейчас из-за этого отправляются 2 разных метода run для карт
   */
  run = () => {
    if (this.loadedData === null) {
      return;
    }

    this.iconCache.clear();

    this._projection = this.loadedData.data.geoJson.coordType;
    this.appendFeaturesByWidgetType(this.loadedData);
    this.#updateLegend(this.loadedData);

    MapTooltip.updateTooltip(this.olmap, this.mapId);

    if (this.hasMoveToDataExtent) {
      this.#moveToDataExtent();
    }

    if (this.isHeatMap()) {
      this.#applyOwnWidgetParams();
    }
  };

  loadData = async () => {
    const { params } = this.props.data;
    const id = this.props.data.entryId;

    this.id = this.props.entryId || id;
    const editMode = this.props.chartEditMode;
    const requestCancelToken = this.props.requestCancelToken;

    params.BBOX_IN = this.#bbox();
    params.FOCUS_DISTANCE = MapUtils.getClusterDistanceByZoom(
      this.olmap.getView().getZoom(),
    );
    params.FOCUS_INCLUDES = ['POLYGON', 'POINT'];
    params.UNIQUE_QUALIFICATION = '__gt_5';

    if (this._projection === EPSG_4326) {
      params.CLUSTER_PRECISION = this.#clusterPrecision();
    }

    this.isLoadingData = true;

    try {
      const data = await ChartsModule.getData({
        source: '/',
        id,
        params,
        editMode,
        cancelToken: requestCancelToken,
      });

      if (this.#isBboxNotChangedWhileDataWasPending(data)) {
        this.loadedData = data;
        this.#refreshVectorSourceForced();
      }
    } catch (err) {
      console.error('Ошибка получения данных');
    } finally {
      this.isLoadingData = false;
    }
  };

  #isBboxNotChangedWhileDataWasPending(data) {
    return (
      !data.params.BBOX_IN || data.params.BBOX_IN.toString() === this.#bbox().toString()
    );
  }

  appendFeaturesByWidgetType = loadedData => {
    if (this.isHeatMap()) {
      const mapLayerOpacity = this.#getMapLayerOpacity(loadedData);
      let heatmapFeatures = this.#vectorHeatmapSource
        .getFormat()
        .readFeatures(loadedData.data.geoJson, this.#featureProjection());
      this.colorMap = MapLegend.calcHeatmapLegend(
        heatmapFeatures,
        this.loadedData.data.geoJson.features,
        mapLayerOpacity,
      );
      this.#vectorHeatmapSource.addFeatures(heatmapFeatures);

      return;
    }

    this.getColorValue(loadedData);
    let features = this._vectorSource.getFormat().readFeatures(loadedData.data.geoJson, {
      featureProjection: EPSG_3857,
    });
    this._vectorSource.addFeatures(features);
  };

  getColorValue = loadedData => {
    if (
      loadedData.data.geoJson.features.length > 0 &&
      loadedData.data.geoJson.features[0].properties &&
      loadedData.data.geoJson.features[0].properties.customProperties &&
      loadedData.data.geoJson.features[0].properties.customProperties['_color']
    ) {
      let uniqueColorValues = loadedData.data.geoJson.features
        .map(m => m.properties.customProperties)
        .map(properties => properties['_color'])
        .flat()
        .filter((v, i, a) => a.indexOf(v) === i);
      for (let k of this.colorMap.keys()) {
        if (!uniqueColorValues.includes(k)) {
          this.colorMap.delete(k);
        }
      }
      for (let k of uniqueColorValues) {
        if (!this.colorMap.get(k)) {
          MapUtils.getSectorColor(k, this.colorMap);
        }
      }
    }
  };

  render = () => {
    this.titleLayer.forEach(item => item.getSource());

    return (
      <div
        id={`map-${this.mapId}`}
        className="olmap"
        style={{ width: '100%', height: '100%' }}
      >
        <div
          id={`legend-${this.mapId}`}
          className="olmap__legend"
          style={{ position: 'absolute', zIndex: 99 }}
        ></div>
        <div id={`tooltip-${this.mapId}`} className="olmap__tooltip"></div>
      </div>
    );
  };
}

export default OLMap;
