import React from 'react';
import block from 'bem-cn-lite';
import {connect} from 'react-redux';
import {
    Route,
    withRouter
} from 'react-router-dom';
import {createStructuredSelector} from 'reselect';
import PropTypes from 'prop-types';
import {
    Utils,
    Navigation,
    Header
} from '@parma-data-ui/clusterdata';
import {DL} from '@parma-data-ui/clusterdata/src/constants/common';

import {Pointerfocus} from 'lego-on-react';

// import './NavigationPage.scss';


const b = block('navigation-page');


class NavigationPage extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };

    static defaultProps = {
        headerEnabled: true
    };

    render() {
        const {
            installationType,
            endpoints,
            clouds,
            menu = [],
            features: {
                logoText,
                toggleTheme
            } = {},
            user = {}
        } = window.DL;
        const {
            sdk
        } = this.props;

        const userData = {
            ...user,
            yu: Utils.getCookie('parmauid')
        };

        const startFrom = DL.IS_INTERNAL ? undefined : 'navigation';

        return (
            <div className={b()}>
                <Pointerfocus/>
                <Header
                    installationType={installationType}
                    sdk={sdk}
                    endpoints={endpoints}
                    clouds={clouds}
                    userData={userData}
                    menuData={menu}
                    logoText={logoText}
                    toggleTheme={toggleTheme}
                />
                <div className={b('navigation')}>
                    <Route
                        path="/:root?/:path*"
                        render={({match, location, history}) => (
                            <Navigation
                                sdk={sdk}
                                match={match}
                                location={location}
                                history={history}
                                startFrom={startFrom}
                            />
                        )}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({});
const mapDispatchToProps = {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavigationPage));

