import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {Button} from 'lego-on-react';
import {Icon} from '@parma-data-ui/common/src';

import iconOkay from '@parma-data-ui/clusterdata/src/icons/okay.svg';
import iconError from '@parma-data-ui/clusterdata/src/icons/error.svg';
// import './VerifyButton.scss';


const b = block('dl-connector-verify');

class VerifyButton extends React.Component {
    static propTypes = {
        verifyConnection: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
        isVerifySuccess: PropTypes.bool
    };

    render() {
        const {
            text,
            verifyConnection,
            isVerifySuccess
        } = this.props;

        return (
            <div className={b()}>
                <Button
                    size="s"
                    theme="normal"
                    view="default"
                    tone="default"
                    text={text}
                    onClick={verifyConnection}
                />
                {
                    typeof isVerifySuccess === 'boolean' && (
                        <Icon
                            className={b('icon')}
                            data={isVerifySuccess ? iconOkay : iconError}
                            width="16"
                        />
                    )
                }
            </div>
        );
    }
}

export default VerifyButton;
