import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { Button, Icon } from 'lego-on-react';
import { NavigationMinimal, EntryTitle, i18n } from '@parma-data-ui/clusterdata';
import Loader from '../../components/Loader/Loader';
import { SDK } from '../../modules/sdk';
import { getPersonalFolderPath, getNavigationPathFromKey } from '../../helpers/utils-dash';
import { changeNavigationPath } from '../../store/actions/dash';
import { ENTRY_SCOPE, ENTRY_TYPE } from '../../constants/constants';

const b = block('dropdown-navigation');

class DropdownNavigation extends React.PureComponent {
  static propTypes = {
    entryId: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    clickableScope: PropTypes.oneOf(Object.values(ENTRY_SCOPE)).isRequired,
    includeClickableType: PropTypes.oneOf(Object.values(ENTRY_TYPE)),
    excludeClickableType: PropTypes.oneOf(Object.values(ENTRY_TYPE)),
    size: PropTypes.string,
    navigationPath: PropTypes.string.isRequired,
    changeNavigationPath: PropTypes.func.isRequired,
  };

  static defaultProps = { size: 'n' };

  static getDerivedStateFromProps({ entryId }, { prevEntryId }) {
    return entryId === prevEntryId ? null : { entry: null };
  }

  state = {
    prevEntryId: null,
    entry: null,
    showNavigation: false,
  };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  setButtonRef = ref => {
    this.buttonRef = ref;
  };

  get loading() {
    return this.props.entryId && this.props.entryId !== this.state.prevEntryId;
  }

  async update() {
    const entryId = this.props.entryId;
    const state = { prevEntryId: entryId };

    if (this.loading) {
      try {
        state.entry = await SDK.getEntryMeta({ entryId });
      } catch (error) {
        console.error('DROPDOWN_NAVIGATION_GET_ENTRY', error);
      }
    }

    this.setState(state);
  }

  render() {
    if (this.loading) {
      return (
        <div className={b()}>
          <Loader size="s" />
        </div>
      );
    }

    return (
      <div className={b()}>
        <Button
          theme="pseudo"
          size={this.props.size}
          view="default"
          tone="default"
          onClick={() => this.setState({ showNavigation: !this.state.showNavigation })}
          innerRef={this.setButtonRef}
          cls={b('button')}
        >
          {this.state.entry ? (
            <EntryTitle entry={this.state.entry} theme="inline" />
          ) : (
            i18n('dash.navigation-input.edit', 'button_choose')
          )}
          <Icon glyph="type-arrow" direction={this.state.showNavigation ? 'top' : 'bottom'} />
        </Button>
        <NavigationMinimal
          sdk={SDK}
          startFrom={
            this.state.entry
              ? getNavigationPathFromKey(this.state.entry.key)
              : this.props.navigationPath || getPersonalFolderPath()
          }
          hasTail={true}
          anchor={this.buttonRef}
          onClose={() => this.setState({ showNavigation: false })}
          visible={this.state.showNavigation}
          popupDirections={[
            'right-top',
            'right-center',
            'right-bottom',
            'left-top',
            'left-center',
            'left-bottom',
            'bottom-center',
            'bottom-left',
            'bottom-right',
            'top-center',
            'top-left',
            'top-right',
          ]}
          clickableScope={this.props.clickableScope}
          includeClickableType={this.props.includeClickableType}
          excludeClickableType={this.props.excludeClickableType}
          onEntryClick={entry => {
            this.props.onClick({ entry });
            this.props.changeNavigationPath(getNavigationPathFromKey(entry.key));
            this.setState({ entry, showNavigation: false });
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  navigationPath: state.dash.navigationPath,
});

const mapDispatchToProps = {
  changeNavigationPath,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropdownNavigation);
