import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

const b = block('card');

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    chartEditMode: PropTypes.object,
    onError: PropTypes.func.isRequired,
    onStateAndParamsChange: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data === prevState.prevData) {
      return null;
    }
    return {
      prevData: nextProps.data,
    };
  }

  state = {
    prevData: null,
    options: null,
  };

  componentDidMount() {
    this.props.onLoad();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data.data !== prevProps.data.data) {
      this.props.onLoad();
    }
  }

  componentDidCatch(error, info) {
    this.props.onError({ error, widgetData: this.state.options });
  }

  static convertTableToList(data) {
    const listData = [];
    data.rows.forEach(rowCell => {
      const value = {};
      rowCell.cells.forEach((cell, index) => {
        value[data.head[index].name] = cell.value;
      });
      listData.push(value);
    });
    return listData;
  }

  _renderObject(sourceData) {
    let data = sourceData[0];
    //todo Внимание хардкор / сделать в системе подтип данных "ссылка"
    return Object.entries(data).map(([key, value]) => {
      if (value !== undefined && value !== null) {
        return (
          <div className={b('row')} key={key}>
            <div className={b('row_cell_key')}>{key}</div>
            <div
              className={b('row_cell_value')}
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        );
      }
    });
  }

  render() {
    let sourceData = Card.convertTableToList(this.props.data.data);
    return (
      <div className={b()} id="card">
        {this._renderObject(sourceData)}
      </div>
    );
  }
}

export default Card;
