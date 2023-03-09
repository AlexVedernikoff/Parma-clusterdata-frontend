import React from 'react';

function ConnectionName(props) {
    const {
        db_type: connectionType,
        name,
        filename
    } = props;
    let connectionName;

    switch (connectionType) {
        case 'csv':
            connectionName = filename;
            break;
        default:
            connectionName = name;
            break;
    }

    return (
        <span>
            {connectionName}
        </span>
    );
}

export default ConnectionName;
