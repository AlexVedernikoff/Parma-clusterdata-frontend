import React from 'react';
import moment from 'moment';
import block from 'bem-cn-lite';

// import './DateTimeView.scss';


const b = block('data-time-view');


class DateTimeView extends React.Component {
    getOffsetGMT = () => {
        const timeZone = (new Intl.DateTimeFormat()).resolvedOptions().timeZone;
        const offsetGMT = moment().format('Z');

        return `${timeZone}, ${offsetGMT} GMT`;
    };

    render() {
        const offsetGMT = this.getOffsetGMT();

        return (
            <span className={b()}>
                {offsetGMT}
            </span>
        );
    }
}

export default DateTimeView;
