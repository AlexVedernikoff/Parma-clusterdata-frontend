import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import Datepicker from '../../Datepicker';
import {formatTimeCanonical, getTimestampFromDate, getUTCFromCharts} from '../util';

export default class TimelineDatepicker extends React.Component {
    static propTypes = {
        from: PropTypes.number,
        to: PropTypes.number,
        onFromChange: PropTypes.func,
        onToChange: PropTypes.func
    }
    onFromChange = ({from}) => {
        this.props.onFromChange(getUTCFromCharts(getTimestampFromDate(from)));
    }
    onToChange = ({from}) => {
        this.props.onToChange(getUTCFromCharts(getTimestampFromDate(from)));
    }
    render() {
        const {from, to} = this.props;
        return (
            <Fragment>
                <Datepicker
                    dateFormat="YYYY-MM-DD"
                    timeFormat="HH:mm"
                    scale="day"
                    showApply={false}
                    allowTime={true}
                    hasClear={false}
                    date={formatTimeCanonical(from)}
                    inputWidth={120}
                    callback={this.onFromChange}
                />
                {' — '}
                <Datepicker
                    dateFormat="YYYY-MM-DD"
                    timeFormat="HH:mm"
                    scale="day"
                    showApply={false}
                    allowTime={true}
                    hasClear={false}
                    date={formatTimeCanonical(to)}
                    inputWidth={120}
                    callback={this.onToChange}
                />
            </Fragment>
        )
    }
}
