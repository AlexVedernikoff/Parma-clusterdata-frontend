import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { Loader } from '@kamatech-data-ui/common/src';
import ChartKitControl from '@kamatech-data-ui/chartkit/lib/components/Widget/Control/Control';
import {
  ControlDatepicker,
  ControlRangeDatepicker,
} from '@kamatech-data-ui/chartkit/lib/components/Widget/Control/Items/Items';
import { prerenderMiddleware } from './prerenderMiddleware';
import { LOAD_STATUS, CONTROL_SOURCE_TYPE, DATE_FORMAT_DAY } from '../../../../constants/constants';
import { ITEM_TYPE } from '../../../../modules/constants/constants';
import { SDK } from '../../../../modules/sdk';
import { getParamsValue } from '@kamatech-data-ui/utils/param-utils';
import { InputFilterControl, SelectFilterControl } from '@clustrum-lib';

const TYPE = {
  SELECT: 'select',
  INPUT: 'input',
  DATEPICKER: 'datepicker',
  RANGE_DATEPICKER: 'range-datepicker',
};
const partialMatchPostfix = '%__ilike_';
const b = block('dashkit-plugin-control');

class Control extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    defaults: PropTypes.object,
    data: PropTypes.shape({
      title: PropTypes.string,
      showTitle: PropTypes.bool,
      sourceType: PropTypes.oneOf(Object.values(CONTROL_SOURCE_TYPE)).isRequired,
      dataset: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fieldId: PropTypes.string.isRequired,
      }),
      external: PropTypes.shape({
        entryId: PropTypes.string.isRequired,
      }),
      control: PropTypes.object.isRequired,
    }).isRequired,
    params: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    onStateAndParamsChange: PropTypes.func.isRequired,
  };

  state = {
    status: LOAD_STATUS.PENDING,
    scheme: null,
    loadedData: null,
    usedParams: null,
  };

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.data, prevProps.data)) {
      this.init();
    }
  }

  componentWillUnmount() {
    this._isUnmounted = true;
    this.cancelCurrentRequests();
  }

  _isUnmounted = false;
  _cancelSource = null;

  get actualParams() {
    return pick(getParamsValue(this.props.params), Object.keys(this.props.defaults));
  }

  reload() {
    this.setState({ status: LOAD_STATUS.PENDING });
    this.init();
  }

  getCancelToken() {
    this._cancelSource = SDK.createCancelSource();
    return this._cancelSource.token;
  }

  cancelCurrentRequests() {
    if (this._cancelSource) {
      this._cancelSource.cancel('DASHKIT_CONTROL_CANCEL_CURRENT_REQUESTS');
    }
  }

  // public
  getMeta() {
    return new Promise(resolve => {
      this.resolve = resolve;
      this.resolveMeta(this.state.loadedData);
    });
  }

  resolveMeta(loadedData) {
    if (this.resolve) {
      this.resolve(
        loadedData
          ? {
              id: this.props.id,
              usedParams: loadedData.usedParams
                ? Object.keys(pick(loadedData.usedParams, Object.keys(this.props.defaults)))
                : null,
              datasetId: loadedData.extra.datasetId,
              datasetFields: loadedData.extra.datasetFields,
            }
          : { id: this.props.id },
      );
    }
  }

  async init() {
    try {
      const { data } = this.props;

      const cancelToken = this.getCancelToken();

      const loadedData =
        data.sourceType === CONTROL_SOURCE_TYPE.EXTERNAL
          ? await SDK.runDashChart({ id: data.external.entryId, params: this.actualParams, cancelToken })
          : await SDK.runDashControl({ shared: data, cancelToken });

      const { usedParams, uiScheme: scheme } = loadedData;

      if (this._isUnmounted) {
        return;
      }

      this.initAvailableItems(scheme);

      this.setState({
        status: LOAD_STATUS.SUCCESS,
        scheme,
        usedParams: Object.keys(usedParams),
        loadedData,
      });

      this.resolveMeta(loadedData);
    } catch (error) {
      console.error('DASHKIT_CONTROL_RUN', error);
      if (this._isUnmounted) {
        return;
      }
      this.setState({ status: LOAD_STATUS.FAIL, loadedData: null });
      this.resolveMeta();
    }
  }

  initAvailableItems(scheme) {
    for (let control of scheme) {
      const { param } = control;
      const { initiatorItem: item } = this.props.params[param];
      if (!item.availableItems || !item.availableItems[param] || item.availableItems[param].length === 0) {
        continue;
      }

      const availableItems = new Set(item.availableItems[param]);
      control.content = control.content.filter(it => availableItems.has(it.title) || availableItems.has(it.value));
    }
  }

  onChange(param, value) {
    this.props.onStateAndParamsChange({ params: { [param]: value } });
  }

  render() {
    switch (this.state.status) {
      case LOAD_STATUS.PENDING:
        return (
          <div className={b()}>
            <Loader size="s" />
          </div>
        );
      case LOAD_STATUS.FAIL:
        return (
          <div className={b()}>
            <span className={b('error')}>Произошла ошибка</span>
          </div>
        );
    }

    const {
      data: { sourceType },
      onStateAndParamsChange,
    } = this.props;

    const { scheme } = this.state;

    if (sourceType === CONTROL_SOURCE_TYPE.EXTERNAL) {
      const {
        data: {
          external: { entryId },
        },
      } = this.props;
      return (
        <div className={b({ external: true })}>
          <ChartKitControl
            scheme={scheme}
            params={this.actualParams}
            entryId={entryId}
            standalone={true}
            onChange={({ params }) => onStateAndParamsChange({ params })}
          />
        </div>
      );
    }

    return (
      <div className={b()}>
        {scheme.map(control => {
          const { param, type } = control;

          if (!Object.keys(this.actualParams).includes(param)) {
            return null;
          }

          const valueFromParams = this.actualParams[param];

          const props = {
            ...control,
            fieldDataType: control.fieldDataType,
            className: b('item'),
            key: param,
            value: valueFromParams,
            onChange: value => this.onChange(param, value),
          };

          if (type === TYPE.RANGE_DATEPICKER) {
            let from;
            let to;

            try {
              // eslint-disable-next-line no-unused-vars
              const [match, y1, m1, d1, y2, m2, d2] =
                this.actualParams[param].match(/__interval_(\d*)-(\d*)-(\d*)_(\d*)-(\d*)-(\d*)/) || [];

              from = `${y1}-${m1}-${d1}`;
              to = `${y2}-${m2}-${d2}`;

              props.value = { from, to };
              props.onChange = ({ from, to }) =>
                this.onChange(
                  param,
                  `__interval_${moment(from).format(DATE_FORMAT_DAY)}_${moment(to).format(DATE_FORMAT_DAY)}`,
                );
            } catch (error) {
              console.error('DASHKIT_RANGE_DATEPICKER_INCORRECT_VALUE', error);
            }
          }

          if (type === TYPE.INPUT) {
            props.onChange = value => {
              this.onChange(param, this._convertToPartialMatchValue(value, props.fieldDataType));
            };

            props.value = this._convertToPlainValue(valueFromParams, props.fieldDataType);
          }

          switch (type) {
            case TYPE.SELECT:
              return <SelectFilterControl {...props} />;
            case TYPE.INPUT:
              return <InputFilterControl {...props} />;
            case TYPE.DATEPICKER:
              return <ControlDatepicker {...props} />;
            case TYPE.RANGE_DATEPICKER:
              return <ControlRangeDatepicker {...props} />;
          }

          return null;
        })}
      </div>
    );
  }

  _convertToPartialMatchValue(valueInput, fieldDataType) {
    //TODO добавить enum для DataType
    if (fieldDataType !== 'STRING') {
      return valueInput;
    }

    return `${valueInput}${partialMatchPostfix}`;
  }

  _convertToPlainValue(value, fieldDataType) {
    if (fieldDataType === 'STRING' && value.includes(partialMatchPostfix)) {
      const regexp = new RegExp(partialMatchPostfix, 'g');

      return value.replace(regexp, '');
    }

    return value;
  }
}

const plugin = {
  type: ITEM_TYPE.CONTROL,
  defaultLayout: { w: 8, h: 4 },
  prerenderMiddleware,
  renderer(props, forwardedRef) {
    return <Control {...props} ref={forwardedRef} />;
  },
};

export default plugin;
