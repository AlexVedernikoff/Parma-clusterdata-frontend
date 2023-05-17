import React from 'react';
import PropTypes from 'prop-types';
import ErrorDispatcher, {
  ERROR_TYPE,
} from '../../../modules/error-dispatcher/error-dispatcher';
import './style.css';
import { _valueFormatter } from '../Table/Table_deprecated';

const FIRST_ELEMENT_INDEX = 0;

class Indicator extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.onLoad();
  }

  componentDidUpdate(prevProps, prevState) {
    // костыль для того, чтобы индикатор не обновлялся два раза и не сбрасывался Loader
    if (this.props.data !== prevProps.data) {
      this.props.onLoad();
    }
  }

  componentDidCatch(error, info) {
    this.props.onError({ error });
  }

  render() {
    const { data } = this.props.data;
    const head = data.head[FIRST_ELEMENT_INDEX];
    const rows = data.rows[FIRST_ELEMENT_INDEX];

    const indicatorData = {
      head: head.name,
      type: head.type,
      cell: rows.cells[FIRST_ELEMENT_INDEX],
    };

    if (!indicatorData.head) {
      throw ErrorDispatcher.wrap({ type: ERROR_TYPE.NO_DATA });
    }

    return (
      <div className="widget-indicator__metric">
        <div className="widget-indicator__title">{indicatorData.head}</div>
        <div className="widget-indicator__value">
          {_valueFormatter(indicatorData.type, indicatorData.cell)}
        </div>
      </div>
    );
  }
}

export default Indicator;
