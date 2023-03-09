import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
// import './Title.scss';

const b = cn('dl-dropdown-menu');

class Title extends React.Component {
    static propTypes = {
        content: PropTypes.string.isRequired
    }

    render() {
        return (
            <div className={b('title')}>
                {this.props.content}
            </div>
        );
    }
}

export default Title;