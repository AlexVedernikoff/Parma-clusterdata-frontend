import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import axiosInstance from '../../../../modules/axios/axios';

import { Button, Spin } from 'lego-on-react';
import i18nFactory from '../../../../modules/i18n/i18n';
import settings from '../../../../modules/settings/settings';
import URI from '../../../../modules/uri/uri';

import ChartsModal from '../ChartsModal/ChartsModal';
import CommonSourceView from './ChartSourceViews/CommonSourceView';
import StatSourceView from './ChartSourceViews/StatSourceView';
import MetrikaSourceView from './ChartSourceViews/MetrikaSourceView';
import AppMetrikaSourceView from './ChartSourceViews/AppMetrikaSourceView';

// import './ChartSourceModal.scss';

const i18n = i18nFactory('ChartSourceModal');
const b = block('chart-source-modal');
const API = '/_v3/reportmenus/nav/reports_by_list/?add_fields_info_extras=1';

const STATUSES = {
  LOADING: 'loading',
  DONE: 'done',
  FAIL: 'fail',
};

const SOURCE_TYPE = {
  STAT: 'stat',
  TRAF: 'traf',
  METRIKA: 'metrika',
  APPMETRIKA: 'appmetrika',
};

const REQUEST_TIMEOUT = 100000;

const generateKey = value => `${value}${Date.now()}`;

const orderSources = ['solomon', 'yql', 'metrics', 'appmetrika', 'metrika', 'stat'];

const sortSources = (sourceInitial, sourceNext) => {
  if (orderSources.indexOf(sourceInitial.type) < orderSources.indexOf(sourceNext.type)) {
    return 1;
  } else if (orderSources.indexOf(sourceInitial.type) === orderSources.indexOf(sourceNext.type)) {
    return 0;
  } else {
    return -1;
  }
};

export default class ChartSourceModal extends React.PureComponent {
  static propTypes = {
    element: PropTypes.object.isRequired, // DOM-элемент, на который был mountComponent,
    sources: PropTypes.object,
  };

  state = { status: STATUSES.LOADING };

  componentDidMount() {
    this._sources = Object.keys(this.props.sources).map(key => {
      return { sourceId: key, ...JSON.parse(JSON.stringify(this.props.sources[key])) };
    });

    const sourcesMap = new Map();

    this._sources.forEach(source => {
      const { type } = source;

      if (!source.hasOwnProperty('name')) {
        const config = settings.config[type];
        source.name = config ? config.description.title : type;
      }

      if (sourcesMap.has(type)) {
        sourcesMap.get(type).push(source);
      } else {
        sourcesMap.set(type, [source]);
      }
    });

    this._sources.sort(sortSources);
    this._sourcesSwitcher(sourcesMap);
  }

  _sourcesSwitcher(sourcesMap) {
    return Promise.all(
      Array.from(sourcesMap).map(source => {
        const [sourceType, sourceData] = source;
        return this._sourceSwitcher(sourceType, sourceData);
      }),
    )
      .then(() => {
        this.setState({ status: STATUSES.DONE });
      })
      .catch(error => {
        console.error('CHART_SOURCES_ERROR', error);
        this.setState({ status: STATUSES.FAIL });
      });
  }

  _sourceSwitcher(sourceType, sourceData) {
    switch (sourceType) {
      case SOURCE_TYPE.STAT:
      case SOURCE_TYPE.TRAF:
        return this._statSource(sourceData);
      case SOURCE_TYPE.METRIKA:
        return this._metrikaSource(sourceData);
      case SOURCE_TYPE.APPMETRIKA:
        return this._appmetrikaSource(sourceData);
      default:
        return this._commonSource(sourceData);
    }
  }

  _commonSource(sourceData) {
    const config = settings.config;
    sourceData.forEach(source => {
      const sourceConfig = config[source.type];

      if (sourceConfig) {
        source.config = sourceConfig;
      }
    });
  }

  _statSource(sourceData) {
    return axiosInstance({
      url: `${settings.chartsEndpoint}${API}`,
      method: 'post',
      data: JSON.stringify({ uris: sourceData.map(source => source.url.replace('/_stat/', '/')) }),
      headers: { 'Content-Type': 'application/json' },
      timeout: REQUEST_TIMEOUT,
    })
      .then(response => {
        response.data.results.forEach((data, index) => {
          sourceData[index].data = data;
        });
      })
      .then(() => {
        const config = settings.config;
        sourceData.forEach(source => {
          const sourceConfig = config[source.type];

          if (sourceConfig) {
            source.config = sourceConfig;
          }
        });

        return Promise.resolve();
      });
  }

  _metrikaSource(sourceData) {
    return Promise.all(
      sourceData.map(metrikaData => {
        const url = new URI(metrikaData.url);
        const { ids } = url.getParams();

        metrikaData.id = ids;

        return axiosInstance({
          url: `${settings.chartsEndpoint}/_metrika/management/v1/counter/${ids}`,
          timeout: REQUEST_TIMEOUT,
        });
      }),
    ).then(responses => {
      responses.forEach(response => {
        const { data: { counter: { id: counterId } = {} } = {}, data } = response;

        sourceData.forEach(metrikaData => {
          const { id } = metrikaData;

          if (String(counterId) === String(id)) {
            metrikaData.data = data;
          }
        });
      });

      return Promise.resolve();
    });
  }

  _appmetrikaSource(sourceData) {
    return Promise.all(
      sourceData.map(appMetrikaData => {
        const url = new URI(appMetrikaData.url);
        const { ids } = url.getParams();

        appMetrikaData.id = ids;

        return axiosInstance({
          url: `${settings.chartsEndpoint}/_appmetrika/management/v1/application/${ids}`,
          timeout: REQUEST_TIMEOUT,
        });
      }),
    ).then(responses => {
      responses.forEach(response => {
        const { data: { application: { id: appCounterId } = {} } = {}, data } = response;

        sourceData.forEach(appMetrikaData => {
          const { id } = appMetrikaData;

          if (String(appCounterId) === String(id)) {
            appMetrikaData.data = data;
          }
        });
      });

      return Promise.resolve();
    });
  }

  _spin = () => (
    <div className={b('row', { spin: true })}>
      <Spin progress size="l" mix={{ block: b('spin') }} />
      {i18n('loading')}
    </div>
  );

  _fail = () => <div className={b('row', { fail: true })}>{i18n('error')}</div>;

  _viewSwitcher(index, source) {
    const { type } = source;

    switch (type) {
      case SOURCE_TYPE.STAT:
      case SOURCE_TYPE.TRAF:
        return <StatSourceView key={generateKey(index)} {...{ index, source }} />;
      case SOURCE_TYPE.METRIKA:
        return <MetrikaSourceView key={generateKey(index)} {...{ index, source }} />;
      case SOURCE_TYPE.APPMETRIKA:
        return <AppMetrikaSourceView key={generateKey(index)} {...{ index, source }} />;
      default:
        return <CommonSourceView key={generateKey(index)} {...{ index, source }} />;
    }
  }

  render() {
    let content;

    switch (this.state.status) {
      case STATUSES.LOADING:
        content = this._spin();
        break;
      case STATUSES.DONE:
        content = this._sources.map((source, index) => this._viewSwitcher(index, source));
        break;
      case STATUSES.FAIL:
      default:
        content = this._fail();
        break;
    }

    return (
      <ChartsModal element={this.props.element}>
        <ChartsModal.Section>
          <ChartsModal.Header>{i18n('chart-sources')}</ChartsModal.Header>
          <ChartsModal.Body>
            <div className={b()}>{content}</div>
          </ChartsModal.Body>
          <ChartsModal.Footer>
            <Button theme="normal" size="m" onClick={proxy => ChartsModal.onClickClose(proxy, this.props.element)}>
              {i18n('close')}
            </Button>
          </ChartsModal.Footer>
        </ChartsModal.Section>
      </ChartsModal>
    );
  }
}
