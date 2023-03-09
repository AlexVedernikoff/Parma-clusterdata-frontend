import React from 'react';

export const withHiddenUnmount = Component => function WithHiddenUnmount(props) {
    if (props.visible === false) {
        return null;
    }
    return <Component {...props}/>;
};
