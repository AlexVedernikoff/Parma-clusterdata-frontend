import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import constants from '../../constants';

// import './index.scss';


const b = block(constants.cNameBody);

// все интервалы считаются от текущей даты
// interval: 0 - текущая дата, interval: -1 - вчерашний день, прошлая неделя, прошлый месяц и т.д.
const DEFAULT_PRESETTINGS = {
    day: [
        {
            name: {
                ru: 'Сегодня',
                en: 'Today'
            },
            interval: 0
        },
        {
            name: {
                ru: 'Вчера',
                en: 'Yesterday'
            },
            interval: -1
        },
        {
            name: {
                ru: 'Позавчера',
                en: 'Other day'
            },
            interval: -2
        }
    ],
    week: [
        {
            name: {
                ru: 'Текущая',
                en: 'Current'
            },
            interval: 0
        },
        {
            name: {
                ru: 'Прошедшая',
                en: 'Past'
            },
            interval: -1
        }
    ],
    month: [
        {
            name: {
                ru: 'Текущий',
                en: 'Current'
            },
            interval: 0
        },
        {
            name: {
                ru: 'Прошедший',
                en: 'Past'
            },
            interval: -1
        }
    ],
    quarter: [
        {
            name: {
                ru: 'Текущий',
                en: 'Current'
            },
            interval: 0
        },
        {
            name: {
                ru: 'Прошедший',
                en: 'Past'
            },
            interval: -1
        }
    ],
    year: [
        {
            name: {
                ru: 'Текущий',
                en: 'Current'
            },
            interval: 0
        },
        {
            name: {
                ru: 'Прошедший',
                en: 'Past'
            },
            interval: -1
        }
    ]
};

const getPresetsList = (type, lang) => {
    return DEFAULT_PRESETTINGS[type].map(preset => {
        return (
            <Preset
                key={`preset-${preset.name[lang]}`}
                content={preset.name[lang]}
                interval={preset.interval}
                type={type}
            />
        );
    });
};

const Preset = ({content, type, interval}) => {
    return (
        <div
            className={b('presets-item')}
            data-interval={interval}
            data-type={type}
        >
            {content}
        </div>
    );
};

export default function Presets(props) {
    const {type, lang, onPresetClick} = props;

    return (
        <div
            className={b('presets')}
            onClick={onPresetClick}
        >
            {getPresetsList(type, lang)}
        </div>
    );
}

Presets.propTypes = {
    lang: PropTypes.string,
    type: PropTypes.string,
    onPresetClick: PropTypes.func
};

Preset.propTypes = {
    content: PropTypes.string,
    type: PropTypes.string,
    interval: PropTypes.number
};
