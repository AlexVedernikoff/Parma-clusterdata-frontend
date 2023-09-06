import React from 'react';
import PropTypes from 'prop-types';
import { DL } from '../../../constants/common';
import Utils from '../../../utils';
import { PLACE, PLACE_VALUES } from '../constants';

export const resolveNavigationPath = Component =>
  class ResolveNavigationPath extends React.Component {
    static propTypes = {
      startFrom: PropTypes.string,
      sdk: PropTypes.object,
      visible: PropTypes.bool,
    };

    state = {};

    async componentDidMount() {
      await this.setPath(this.props.startFrom || DL.USER_FOLDER);
    }

    async setPath(origin) {
      let path = '';
      let root = PLACE.ORIGIN_ROOT;
      if (Utils.isEntryId(origin)) {
        try {
          const { key } = await this.props.sdk.getEntry({ entryId: origin });
          path = key;
        } catch (error) {
          console.warn(error);
        }
      } else if (PLACE_VALUES.includes(origin)) {
        root = origin;
      } else {
        path = origin;
      }
      this.setState({ resolvedPath: path, resolvedRoot: root });
    }

    render() {
      return (
        this.props.visible && (
          <Component
            {...this.props}
            path={this.state.resolvedPath}
            root={this.state.resolvedRoot}
          />
        )
      );
    }
  };
