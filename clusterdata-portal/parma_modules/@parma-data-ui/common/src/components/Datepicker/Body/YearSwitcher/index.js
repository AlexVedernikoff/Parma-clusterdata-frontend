import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Icon from '../../../Icon/Icon';
import iconArrow from '../../../../assets/icons/chevron-right.svg';
import constants from '../../constants';

// import './index.scss';


const b = block(constants.cNameBody);

export default function YearSwitcher(props) {
    const {year, onSwitcherClick} = props;

    return (
        <div
            className={b('year-switcher')}
            onClick={onSwitcherClick}
        >
            <div
                className={b('year-switcher-arrow', {left: true})}
                data-dir="prev"
            >
                <Icon data={iconArrow}/>
            </div>
            <div className={b('year-switcher-val')}>{year}</div>
            <div
                className={b('year-switcher-arrow', {right: true})}
                data-dir="next"
            >
                <Icon data={iconArrow}/>
            </div>
        </div>
    );
}

YearSwitcher.propTypes = {
    year: PropTypes.number,
    onSwitcherClick: PropTypes.func
};
