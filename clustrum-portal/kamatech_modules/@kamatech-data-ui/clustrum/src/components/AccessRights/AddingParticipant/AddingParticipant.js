import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Suggest from 'components/Suggest/Suggest';
import { KeyCodes } from 'constants/common';
import User from '../User/User';

// import './AddingParticipant.scss';

const b = block('dl-ar-adding-participant');

export default class AddingParticipant extends React.Component {
  static defaultProps = {
    data: [],
  };

  static propTypes = {
    sdk: PropTypes.object.isRequired,
    visible: PropTypes.bool,
    editable: PropTypes.bool,
    predefinedParticipants: PropTypes.array,
    onAction: PropTypes.func,
  };

  static getDerivedStateFromProps(props, state) {
    const { editable, predefinedParticipants } = props;
    const { data, isLoading } = state;

    if (data.length) {
      return null;
    } else {
      return {
        disabled: !editable,
        data: predefinedParticipants || [],
        predefinedParticipants,
        isLoading: predefinedParticipants ? !predefinedParticipants.length : isLoading,
      };
    }
  }

  constructor(props) {
    super(props);

    this.cancelablePromise = null;
    this.inputProps = {
      placeholder: 'Добавить участника',
      cls: b('input'),
    };
    this.suggestRef = React.createRef();
  }

  state = {
    data: [],
    predefinedParticipants: [],
    participant: null,
    isLoading: true,
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleKeyDown = event => {
    const { disabled } = this.state;
    if (event.keyCode === KeyCodes.ENTER && !disabled) {
      event.preventDefault();
      this.onAddParticipant();
    }
  };

  getData = text => {
    const { sdk } = this.props;

    if (text === '') {
      const { predefinedParticipants } = this.props;

      this.setState({
        data: predefinedParticipants || [],
        isLoading: !predefinedParticipants,
      });
    } else {
      this.setState({ isLoading: true });
      sdk
        .suggest({ searchText: text, limit: 10 }, { cancelable: true })
        .then(data => {
          if (this._isMounted) {
            this.setState({
              data: data ? data : [],
              isLoading: false,
            });
          }
        })
        .catch(error => {
          if (sdk.isCancel(error)) {
            return;
          }
          if (this._isMounted) {
            this.setState({ data: [], isLoading: false });
          }
        });
    }
  };

  renderItem = data => {
    return (
      <div className={b('item')}>
        <User showIcon useRole={false} participant={data} onClickLink={this.onClickLink} />
      </div>
    );
  };

  onClickLink = event => {
    event.preventDefault();
  };

  onAction = participant => {
    this.setState(
      {
        participant,
      },
      () => {
        this.onAddParticipant();
      },
    );
  };

  onAddParticipant = () => {
    const { participant } = this.state;
    this.props.onAction({ action: 'ADD', participant });
    this.suggestRef.current.clear();
  };

  render() {
    const { visible } = this.props;
    const { data, disabled, isLoading } = this.state;

    return (
      <div className={b()}>
        <Suggest
          ref={this.suggestRef}
          visible={visible}
          renderItem={this.renderItem}
          data={data}
          filterBy="title"
          onChange={this.getData}
          onAction={this.onAction}
          onItemClick={this.onAction}
          inputProps={this.inputProps}
          emptyItem={<div className={b('empty-item')}>Пользователь не найден</div>}
          isLoading={isLoading}
          disabled={disabled}
          className={b('suggest')}
        />
      </div>
    );
  }
}
