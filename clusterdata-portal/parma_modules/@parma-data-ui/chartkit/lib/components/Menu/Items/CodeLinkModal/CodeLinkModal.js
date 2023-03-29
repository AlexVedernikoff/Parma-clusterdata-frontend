import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button } from 'lego-on-react';
import i18nFactory from '../../../../modules/i18n/i18n';

import ChartsModal from '../ChartsModal/ChartsModal';
import ChartsModalMenu from '../ChartsModalMenu/ChartsModalMenu';
import createBody from './createBody';

// import './CodeLinkModal.scss';

const i18n = i18nFactory('CodeLinkModal');

const SERVICES = {
  CHARTS: 'charts',
  STATISTICS: 'stat',
  STARTREK: 'st',
  WIKI: 'wiki',
  AT: 'at',
  GOALS: 'goals',
};

const CONFIG_TYPES = {
  GRAPH: 'graph',
  GRAPH_NODE: 'graph_node',
  GRAPH_WIZARD: 'graph_wizard',
  GRAPH_WIZARD_NODE: 'graph_wizard_node',
  NATIVE: 'native',
  TABLE: 'table',
  TABLE_NODE: 'table_node',
  TABLE_WIZARD_NODE: 'table_wizard_node',
  MAP: 'map',
  MAP_NODE: 'map_node',
};

const GRAPH_MAP_CONFIG_TYPES = [
  CONFIG_TYPES.GRAPH,
  CONFIG_TYPES.GRAPH_NODE,
  CONFIG_TYPES.GRAPH_WIZARD,
  CONFIG_TYPES.GRAPH_WIZARD_NODE,
  CONFIG_TYPES.NATIVE,
  CONFIG_TYPES.MAP,
  CONFIG_TYPES.MAP_NODE,
];

// TODO@translations: в этот момент язык еще на задан
const MENU_ITEMS = [
  {
    val: SERVICES.CHARTS,
    title: i18n('service-charts'),
    icon: 'favicon.png',
  },
  {
    val: SERVICES.STATISTICS,
    title: i18n('service-stat'),
    icon: 'favicon.ico',
  },
  {
    val: SERVICES.STARTREK,
    title: i18n('service-st'),
    icon: 'favicon.ico',
    configTypes: GRAPH_MAP_CONFIG_TYPES,
  },
  {
    val: SERVICES.WIKI,
    title: i18n('service-wiki'),
    icon: 'favicon-16.png',
    configTypes: GRAPH_MAP_CONFIG_TYPES.concat([
      CONFIG_TYPES.TABLE,
      CONFIG_TYPES.TABLE_NODE,
      CONFIG_TYPES.TABLE_WIZARD_NODE,
    ]),
  },
  {
    val: SERVICES.AT,
    title: i18n('service-at'),
    icon: 'atushka_normal.png',
    configTypes: GRAPH_MAP_CONFIG_TYPES,
  },
  {
    val: SERVICES.GOALS,
    title: i18n('service-goals'),
    icon: 'favicon.png',
    configTypes: GRAPH_MAP_CONFIG_TYPES,
  },
];

const CHECKBOXES = {
  NO_HEADER: {
    key: '_no_header',
    text: i18n('no-header'),
    checked: false,
    queryParam: true,
  },
  NO_COMMENTS: {
    key: '_graph_no_comments',
    text: i18n('no-comments'),
    checked: false,
    queryParam: true,
  },
  NO_MARK: {
    key: 'nomark',
    text: i18n('no-mark'),
    checked: true,
    queryParam: false,
  },
};

const Charts = createBody({
  header: i18n('charts-header'),
  text: i18n('charts-text'),
  shortLinkItem: true,
  checkboxes: [CHECKBOXES.NO_HEADER, CHECKBOXES.NO_COMMENTS],
});

const Statistics = createBody({
  header: i18n('stat-header'),
  text: i18n('stat-text'),
  checkboxes: [CHECKBOXES.NO_COMMENTS],
});

const Startrek = createBody({
  header: i18n('st-header'),
  text: i18n('st-text'),
  checkboxes: [CHECKBOXES.NO_COMMENTS],
  radiobox: [
    {
      width: '100%',
      height: '400px',
    },
    {
      width: '320px',
      height: '410px',
    },
  ],
  format: (config, state, pathURI) => {
    pathURI.setParam('_embedded', '1');
    const src = pathURI.toString();
    const { width, height } = { ...config.radiobox[state.radiobox] };

    return `{{iframe frameborder="0" width="${width}" height="${height}" src="${src}"}}`;
  },
});

const Wiki = createBody({
  header: i18n('wiki-header'),
  text: i18n('wiki-text'),
  checkboxes: [CHECKBOXES.NO_COMMENTS, CHECKBOXES.NO_MARK],
  radiobox: [
    {
      width: '200px',
      height: '200px',
    },
    {
      width: '350px',
      height: '420px',
    },
  ],
  format: (config, state, pathURI) => {
    const src = pathURI.toString().replace(/https?:\/\/(?:(?!\/).)*/g, '');
    const noMark = state[CHECKBOXES.NO_MARK.key] ? ' nomark' : '';
    let { width, height } = { ...config.radiobox[state.radiobox] };
    width = width.replace('px', '');
    height = height.replace('px', '');

    return `{{statface${noMark} width="${width}" height="${height}" src="${src}"}}`;
  },
});

const At = createBody({
  header: i18n('at-header'),
  text: i18n('at-text'),
  radiobox: [
    {
      width: '100%',
      height: '400px',
    },
    {
      width: '380px',
      height: '380px',
    },
  ],
  format: (config, state, pathURI) => {
    pathURI.setParam('_embedded', '1');
    const src = pathURI.toString();
    const { width, height } = { ...config.radiobox[state.radiobox] };

    return `{{iframe frameborder="0" width="${width}" height="${height}" src="${src}"}}`;
  },
});

const Goals = createBody({
  header: i18n('goals-header'),
  text: i18n('goals-text'),
});

const b = block('code-link-modal');

export default class CodeLinkModal extends React.PureComponent {
  static propTypes = {
    element: PropTypes.object.isRequired, // DOM-элемент, на который был mountComponent
    url: PropTypes.string.isRequired, // ссылка на charts-конфиг для преобразования
    configType: PropTypes.string.isRequired, // тип charts-конфига
  };

  state = { selected: SERVICES.CHARTS };

  render() {
    const menuItems = MENU_ITEMS.filter(
      item => !item.configTypes || item.configTypes.includes(this.props.configType),
    ).map(item => {
      return { val: item.val, title: item.title, icon: item.icon };
    });

    const body =
      (this.state.selected === SERVICES.CHARTS && <Charts url={this.props.url} />) ||
      (this.state.selected === SERVICES.STATISTICS && <Statistics url={this.props.url} />) ||
      (this.state.selected === SERVICES.STARTREK && <Startrek url={this.props.url} />) ||
      (this.state.selected === SERVICES.WIKI && <Wiki url={this.props.url} />) ||
      (this.state.selected === SERVICES.AT && <At url={this.props.url} />) ||
      (this.state.selected === SERVICES.GOALS && <Goals url={this.props.url} />);

    return (
      <ChartsModal element={this.props.element}>
        <ChartsModalMenu
          items={menuItems}
          selected={this.state.selected}
          onClick={item => this.setState({ selected: item })}
        />
        <ChartsModal.Section>
          <div className={b({ [this.props.configType]: true })}>{body}</div>
          <ChartsModal.Footer>
            <Button
              theme="pseudo"
              view="default"
              tone="default"
              size="m"
              onClick={proxy => ChartsModal.onClickClose(proxy, this.props.element)}
            >
              {i18n('close')}
            </Button>
          </ChartsModal.Footer>
        </ChartsModal.Section>
      </ChartsModal>
    );
  }
}
