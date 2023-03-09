import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {Button} from 'lego-on-react';
import {I18n} from '@parma-data-ui/clusterdata';


const b = block('dl-connector');
const i18n = I18n.keyset('connections.form');
const TOKEN_CODE_PATTERN = /code=([\d]{7})/;

class AppMetricaConnector extends React.Component {
    static propTypes = {
        onChangeCallback: PropTypes.func.isRequired,
        sdk: PropTypes.object.isRequired,
    };

    getMetricaOAuthToken = async ({confirmCode}) => {
        const {sdk, onChangeCallback} = this.props;
        const {token} = await sdk.getMetrikaOAuthToken({confirmCode});

        if (token) {
            onChangeCallback({token});
        }
    };

    getConfirmCode = ({oauthPageWindow}) => {
        return new Promise((resolve) => {
            const intervalId = setInterval(async () => {
                let confirmationCode;

                try {
                    const url = oauthPageWindow.location.href;
                    const confirmCodeMatch = url.match(TOKEN_CODE_PATTERN);

                    if (confirmCodeMatch) {
                        clearInterval(intervalId);

                        confirmationCode = confirmCodeMatch[1];

                        oauthPageWindow.close();
                        resolve(confirmationCode);
                    }
                } catch (error) {
                    if (confirmationCode) {
                        clearInterval(intervalId);
                        oauthPageWindow.close();
                    }
                }
            }, 200);
        });
    };

    onGetTokenBtnClick = async () => {
        const {
            metrikaOAuthClientId,
            endpoints: {
                extPassportOAuth: oauthUrl
            } = {}
        } = window.DL;
        const redirectUrl = window.location.origin;

        const queryParams = `response_type=code&client_id=${metrikaOAuthClientId}&redirect_uri=${redirectUrl}`;
        const oauthPageWindow = window.open(`${oauthUrl}/authorize?${queryParams}`, 'authPage');

        const confirmCode = await this.getConfirmCode({oauthPageWindow});

        await this.getMetricaOAuthToken({confirmCode});
    };

    render() {
        return (
            <Button
                cls={b('get-token-btn')}
                theme="pseudo"
                size="s"
                view="default"
                tone="default"
                text={i18n('field_get-token')}
                onClick={this.onGetTokenBtnClick}
            />
        );
    }
}

export default AppMetricaConnector;
