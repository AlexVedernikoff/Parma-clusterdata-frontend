import React from 'react';
import PropTypes from 'prop-types';
import {TextInput} from 'lego-on-react';

class EnterInput extends React.Component {
    static propTypes = {
        autoselect: PropTypes.bool,
        onCancel: PropTypes.func,
        onDone: PropTypes.func,
        onChange: PropTypes.func
    }
    static defaultProps = {
        view: 'default',
        tone: 'default',
        theme: 'normal',
        size: 's'
    }
    state = {}
    static getDerivedStateFromProps(props, state) {
        const {text} = props;
        if (state.previousText === text) {
            return state;
        } else {
            return {
                text,
                previousText: props.text
            };
        }
    }
    componentDidMount() {
        if (this.props.autoselect) {
            this.focus();
            this.select();
        }
    }
    focus() {
        if (this.inputRef.current) {
            const control = this.inputRef.current._control;
            control.focus();
        }
    }
    select() {
        if (this.inputRef.current) {
            const control = this.inputRef.current._control;
            control.select();
        }
    }
    inputRef = React.createRef()
    onKeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
                this.props.onDone(this.state.text);
                break;
            case 'Escape': {
                this.props.onCancel();
            }
        }
    }
    onBlur = () => {
        this.props.onCancel();
    }
    onChange = (text) => {
        this.setState({text});
        if (this.props.onChange) {
            this.props.onChange(text);
        }
    }
    render() {
        const {onCancel, onDone, ...props} = this.props; // eslint-disable-line no-unused-vars
        return (
            <TextInput
                ref={this.inputRef}
                {...props}
                onChange={this.onChange}
                onBlur={this.onBlur}
                onKeyDown={this.onKeyDown}
                text={this.state.text}
            />
        );
    }
}

export default EnterInput;
