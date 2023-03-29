import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import block from 'bem-cn-lite';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';

import Loader from '../../Loader/Loader';
import {
  ControlSelect,
  ControlInput,
  ControlDatepicker,
  ControlRangeDatepicker,
  ControlCheckbox,
  ControlButton,
} from './Items/Items';

import axiosInstance from '../../../modules/axios/axios';
import settings from '../../../modules/settings/settings';
import { wrapToArray, unwrapFromArray } from '../../../helpers/helpers';

// import './Control.scss';

const STATUS = {
  LOADING: 'loading',
  DONE: 'done',
  ERROR: 'error',
};

const TYPE = {
  SELECT: 'select',
  BUTTON: 'button',
  INPUT: 'input',
  CHECKBOX: 'checkbox',
  DATEPICKER: 'datepicker',
  RANGE_DATEPICKER: 'range-datepicker',
};

const b = block('chartkit-control');

class Control extends React.PureComponent {
  static propTypes = {
    scheme: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(Object.values(TYPE)).isRequired,
        param: PropTypes.string,
        label: PropTypes.string,
        updateOnChange: PropTypes.bool,
        updateControlsOnChange: PropTypes.bool,
      }),
    ).isRequired,
    params: PropTypes.object.isRequired,
    entryId: PropTypes.string.isRequired,
    standalone: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    params: {},
  };

  get params() {
    return { ...this.props.params, ...this.state.params };
  }

  state = {
    status: STATUS.LOADING,
    params: this.props.params,
    scheme: this.props.scheme,
  };

  componentDidMount() {
    this.setState({ status: STATUS.DONE });
  }

  componentWillReceiveProps({ scheme, params }) {
    this.setState({ scheme, params });
  }

  async run(params) {
    this.setState({ status: STATUS.LOADING });

    const data = {
      id: this.props.entryId,
      uiOnly: true,
      params,
    };

    let response;

    try {
      response = await axiosInstance({
        url: `${settings.chartsEndpoint}/run`,
        method: 'post',
        data,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        return null;
      }

      console.error('CHARTKIT_CONTROL', error);

      this.setState({ status: STATUS.ERROR });
    }

    const { uiScheme, params: newParams } = response.data;

    this.setState({
      status: STATUS.DONE,
      scheme: uiScheme,
      params: omit(newParams, 'name'),
    });
  }

  onChange({ type, param, paramFrom, paramTo, updateOnChange, updateControlsOnChange }, value) {
    const newParams = { ...this.params };

    if (type === TYPE.RANGE_DATEPICKER) {
      newParams[paramFrom] = [value.from];
      newParams[paramTo] = [value.to];
    } else {
      newParams[param] = wrapToArray(value);
    }

    if (!isEqual(newParams, this.params) || type === TYPE.BUTTON) {
      if (updateOnChange) {
        this.props.onChange({ params: newParams, state: { forceUpdate: true } });
      } else if (updateControlsOnChange) {
        this.run(newParams);
      } else {
        this.setState({ params: newParams });
      }
    }
  }

  renderControl = control => {
    if (!control) {
      return null;
    }

    const { type, label, param, paramFrom, paramTo } = control;

    const props = {
      ...control,
      className: b('item'),
      key: param || paramFrom || label,
      value:
        type === TYPE.RANGE_DATEPICKER
          ? {
              from: paramFrom && unwrapFromArray(this.params[paramFrom]),
              to: paramTo && unwrapFromArray(this.params[paramTo]),
            }
          : unwrapFromArray(this.params[param]),
      onChange: value => this.onChange(control, value),
    };

    switch (control.type) {
      case TYPE.SELECT:
        return <ControlSelect {...props} />;
      case TYPE.INPUT:
        return <ControlInput {...props} />;
      case TYPE.DATEPICKER:
        return <ControlDatepicker {...props} />;
      case TYPE.RANGE_DATEPICKER:
        return <ControlRangeDatepicker {...props} />;
      case TYPE.CHECKBOX:
        return <ControlCheckbox {...props} />;
      case TYPE.BUTTON:
        return <ControlButton {...props} />;
    }

    return null;
  };

  renderBody() {
    const { status } = this.state;

    if (status === STATUS.LOADING) {
      return <Loader size="s" />;
    }

    if (status === STATUS.ERROR) {
      return <div>Произошла ошибка</div>;
    }

    return <React.Fragment>{this.state.scheme.map(this.renderControl)}</React.Fragment>;
  }

  render() {
    return <div className={b({ standalone: this.props.standalone })}>{this.renderBody()}</div>;
  }
}

export default Control;
