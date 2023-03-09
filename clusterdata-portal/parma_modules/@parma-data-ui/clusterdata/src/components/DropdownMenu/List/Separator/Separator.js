import React from 'react';
import cn from 'bem-cn-lite';
// import './Separator.scss';

const b = cn('header-menu');

class Separator extends React.Component {
    render() {
        return (
            <div className={b('separator')}/>
        );
    }
}

export default Separator;