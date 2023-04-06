import React from 'react';

import i18nFactory from '../../../../../modules/i18n/i18n';
import SvgLine from './SvgLine';

import { TYPES } from './commentsTypes';
import ButtonIcon from '../../ButtonIcon/ButtonIcon';

const i18n = i18nFactory('CommentsModal');

const COLORS = [
  '#f44336',
  '#e91e63',
  '#3f51b5',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#ffeb3b',
  '#ffcc00',
  '#ff5722',
  '#607d8b',
  '#000000',
];

const COLOR = {
  type: 'picker',
  name: 'color',
  title: i18n('control-color'),
  text: color => {
    return color ? (
      <div style={{ width: '100%', height: '100%', backgroundColor: color }} />
    ) : (
      <div style={{ width: '100%', height: '100%' }}>&mdash;</div>
    );
  },
  items: COLORS.map(color => {
    return {
      value: color,
      text: (
        <svg width="30" height="30">
          <circle cx="15" cy="15" r="15" fill={color} />
        </svg>
      ),
    };
  }),
};

const EMPTY_COLOR_STYLE = {
  width: '30px',
  height: '30px',
  backgroundImage:
    'linear-gradient(45deg, #ececec 25%, transparent 25%, transparent 75%, #ececec 75%), linear-gradient(45deg, #ececec 25%, transparent 25%, transparent 75%, #ececec 75%)',
  backgroundSize: '10px',
  backgroundPosition: '0 0, 5px 5px',
  borderRadius: '100%',
  backgroundColor: '#fff',
};

const COLOR_WITH_DEFAULT = {
  type: 'picker',
  name: 'color',
  title: i18n('control-color'),
  text: color => {
    return color ? (
      <div style={{ width: '100%', height: '100%', backgroundColor: color }} />
    ) : (
      <div style={{ width: '100%', height: '100%' }}>{i18n('control-color-default')}</div>
    );
  },
  items: [undefined].concat(COLORS).map(color => {
    return {
      value: color,
      text: color ? (
        <svg width="30" height="30">
          <circle cx="15" cy="15" r="15" fill={color} />
        </svg>
      ) : (
        <div style={EMPTY_COLOR_STYLE} />
      ),
    };
  }),
};

const PRESETS = [
  { fillColor: '#000000', textColor: '#ffffff' },
  { fillColor: '#f44336', textColor: '#ffffff' },
  { fillColor: '#4caf50', textColor: '#ffffff' },
  { fillColor: '#999999', textColor: '#ffffff' },
  { fillColor: '#2196f3', textColor: '#ffffff' },
  { fillColor: '#ffcc00', textColor: '#000000' },
];

const TOOLTIP = {
  type: 'picker',
  name: ['fillColor', 'textColor'],
  title: i18n('control-tooltip'),
  dependency: 'visible',
  text: ({ fillColor, textColor }) => (
    <div style={{ height: '90%', border: '1px solid #eee', display: 'flex' }}>
      <div style={{ backgroundColor: fillColor, width: '50%' }} />
      <div style={{ backgroundColor: textColor, width: '50%' }} />
    </div>
  ),
  items: PRESETS.map(({ fillColor, textColor }) => {
    return {
      value: { fillColor, textColor },
      text: (
        <svg width="128" height="36" opacity="0.7">
          <path
            fill={fillColor}
            d="M 8 0 L 120 0 C 128 0 128 0 128 8 L 128 20 C 128 28 128 28 120 28 L 8 28 C 0 28 0 28 0 20 L 0 8 C 0 0 0 0 8 0"
          />
          <text x="8" y="18" fontSize="12" fill={textColor}>
            <tspan>{i18n('control-tooltip-text')}</tspan>
          </text>
          <path fill={fillColor} d="M 90 36 L 85 28 95 28 Z" />
        </svg>
      ),
    };
  }),
};

const VISIBILITY = {
  type: 'radio',
  name: 'visible',
  title: i18n('control-visibility'),
  items: [
    {
      value: 1,
      text: i18n('control-visibility-yes'),
    },
    {
      value: 0,
      text: i18n('control-visibility-no'),
    },
  ],
};

const Z_INDEX = {
  type: 'select',
  name: 'zIndex',
  title: i18n('control-z-index'),
  items: [
    {
      value: 0,
      text: i18n('control-z-index-low'),
    },
    {
      value: 10,
      text: i18n('control-z-index-medium'),
    },
    {
      value: 20,
      text: i18n('control-z-index-high'),
    },
  ],
};

const SHAPE = {
  type: 'select',
  name: 'shape',
  title: i18n('control-shape'),
  items: [
    {
      value: 'flag',
      text: i18n('control-shape-flag'),
    },
    {
      value: 'circlepin',
      text: i18n('control-shape-circle'),
    },
    {
      value: 'squarepin',
      text: i18n('control-shape-square'),
    },
  ],
};

const Y_SHIFT = {
  type: 'select',
  name: 'y',
  title: i18n('control-y-shift'),
  items: [
    {
      value: -30,
      text: i18n('control-y-shift-low'),
    },
    {
      value: -65,
      text: i18n('control-y-shift-medium'),
    },
    {
      value: -100,
      text: i18n('control-y-shift-high'),
    },
  ],
};

const GRAPH_ID = {
  type: 'select',
  name: 'graphId',
  title: i18n('control-graph-id'),
  props: 'graphs',
};

const DASH_STYLES = [
  {
    value: 'Solid',
    strokeDashArray: 'none',
  },
  {
    value: 'ShortDash',
    strokeDashArray: '6,2',
  },
  {
    value: 'ShortDot',
    strokeDashArray: '2,2',
  },
  {
    value: 'ShortDashDot',
    strokeDashArray: '6,2,2,2',
  },
  {
    value: 'ShortDashDotDot',
    strokeDashArray: '6,2,2,2,2,2',
  },
  {
    value: 'Dot',
    strokeDashArray: '2,6',
  },
  {
    value: 'Dash',
    strokeDashArray: '8,6',
  },
  {
    value: 'LongDash',
    strokeDashArray: '16,6',
  },
  {
    value: 'DashDot',
    strokeDashArray: '8,6,2,6',
  },
  {
    value: 'LongDashDot',
    strokeDashArray: '16,6,2,6',
  },
  {
    value: 'LongDashDotDot',
    strokeDashArray: '16,6,2,6,2,6',
  },
];

const DASH_STYLE = {
  type: 'select',
  name: 'dashStyle',
  title: i18n('control-dash-style'),
  items: DASH_STYLES.map(({ value, strokeDashArray }) => {
    return {
      value,
      icon: (
        <ButtonIcon>
          <SvgLine strokeDashArray={strokeDashArray} />
        </ButtonIcon>
      ),
    };
  }),
};

const DASH_WIDTHS = [
  {
    value: 2,
    strokeWidth: 4,
  },
  {
    value: 4,
    strokeWidth: 8,
  },
  {
    value: 6,
    strokeWidth: 12,
  },
];

const DASH_WIDTH = {
  type: 'select',
  name: 'width',
  title: i18n('control-dash-width'),
  items: DASH_WIDTHS.map(({ value, strokeWidth }) => {
    return {
      value,
      icon: (
        <ButtonIcon>
          <SvgLine strokeWidth={strokeWidth} />
        </ButtonIcon>
      ),
    };
  }),
};

// TODO: не дожидается выставления языка
export default [
  {
    value: TYPES.BAND_X,
    text: i18n('comment-band-x'),
    controls: [COLOR, VISIBILITY, Z_INDEX],
  },
  {
    value: TYPES.DOT_XY,
    text: i18n('comment-dot-x-y'),
    controls: [GRAPH_ID, VISIBILITY, COLOR_WITH_DEFAULT, TOOLTIP],
  },
  {
    value: TYPES.FLAG_X,
    text: i18n('comment-flag-x'),
    controls: [COLOR, SHAPE, Y_SHIFT],
  },
  {
    value: TYPES.LINE_X,
    text: i18n('comment-line-x'),
    controls: [COLOR, DASH_STYLE, DASH_WIDTH],
  },
];
