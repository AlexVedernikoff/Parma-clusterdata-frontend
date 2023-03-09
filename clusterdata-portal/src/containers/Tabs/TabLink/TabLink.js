import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {Link} from 'react-router-dom';

const b = block('dash-tab-link');

function TabLink({ title, id, location, tabId, setPageTab, isMenuItem }) {
    return (
        <Link
            data-id={id}
            to={{
                ...location,
                search: `?tab=${id}`,
                hash: ''
            }}
            className={b({
                'selected': id === tabId, 
                'is-menu-item': isMenuItem
            })}
            onClick={() => setPageTab(id)}
        >
            {title}
        </Link>
    )
}

TabLink.propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    tabId: PropTypes.string.isRequired,
    setPageTab: PropTypes.func.isRequired,
    isMenuItem: PropTypes.bool,
};

export default TabLink;
