import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Icon from '../../Icon/Icon';
// import './Menu.scss';
import iconHamburger from '../../../assets/icons/header-sidemenu.svg';
import {TextInput} from 'lego-on-react';
import ServiceMenu from '../../ServiceMenu/ServiceMenu';

const b = block('yc-header-menu');

export default class Menu extends React.Component {
    static propTypes = {
        menuData: PropTypes.shape({
            currentItem: PropTypes.string, // item name
            groups: PropTypes.arrayOf(
                PropTypes.shape({
                    title: PropTypes.string,
                    items: PropTypes.arrayOf(
                        PropTypes.shape({
                            name: PropTypes.string.isRequired,
                            title: PropTypes.string.isRequired,
                            icon: PropTypes.object, // icon data
                            url: PropTypes.string,
                            wrapper: PropTypes.func
                        })
                    )
                })
            )
        })
    };

    state = {
        isMenuOpen: false,
        searchText: ''
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isMenuOpen && !prevState.isMenuOpen) {
            this.attachClickListener();
        } else if (!this.state.isMenuOpen && prevState.isMenuOpen) {
            this.detachClickListener();
        }
    }

    containerRef = React.createRef()
    blindRef = React.createRef()

    attachClickListener() {
        setTimeout(() => {
            window.addEventListener('click', this.handlePossibleOutsideClick);
        }, 0);
    }

    detachClickListener() {
        window.removeEventListener('click', this.handlePossibleOutsideClick);
    }

    handlePossibleOutsideClick = (event) => {
        if (this.containerRef.current && !this.containerRef.current.contains(event.target)) {
            this.close();
        }
    };

    toggleOpen = () => {
        this.blindRef.current.style.visibility = 'visible';
        this.containerRef.current.style.visibility = 'visible';

        if (this.state.isMenuOpen) {
            document.body.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';
        }

        this.setState(prevState => ({isMenuOpen: !prevState.isMenuOpen}));
    };

    close = () => {
        document.body.style.overflow = '';
        this.setState({isMenuOpen: false});
    };

    onChange = searchText => this.setState({searchText});

    onMenuItemClick = () => {
        this.close();
    }

    render() {
        const {isMenuOpen, searchText} = this.state;
        const {menuData} = this.props;

        return (
            <React.Fragment>
                <div
                    className={b('inner', {view: isMenuOpen ? 'open' : 'close'})}
                    ref={this.containerRef}
                >
                    <div className={b('inner-content')}>
                        {Boolean(menuData) && (
                            <ServiceMenu
                                menuData={menuData}
                                searchText={searchText}
                                onItemClick={this.onMenuItemClick}
                            />
                        )}
                    </div>
                </div>
                <div
                    className={b('blind', {view: isMenuOpen ? 'open' : 'close'})}
                    ref={this.blindRef}
                />
                <button className={b('hamburger-place')} onClick={this.toggleOpen}>
                    <Icon data={iconHamburger}/>
                </button>
            </React.Fragment>
        );
    }
}
