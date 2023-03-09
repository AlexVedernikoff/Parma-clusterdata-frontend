import React from 'react';
import block from 'bem-cn-lite';

import {DashKitContext} from '../../context/DashKitContext';
import GridLayout from '../GridLayout/GridLayout';
import {withContext} from '../../hoc/withContext';
import {calcLayout} from '../../hoc/calcLayout';

const b = block('dashkit');

function DashKitView() {
    const context = React.useContext(DashKitContext);
    const {registerManager} = context;
    return (
        <div className={b({theme: registerManager.settings.theme})}>
            <GridLayout/>
        </div>
    );
}

export default calcLayout(
    withContext(DashKitView)
);
