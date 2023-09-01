import React from 'react';
import PropTypes from 'prop-types';

import { UnknownWidgetProps } from './types/unknown-widget-props';

export class UnknownWidget extends React.PureComponent<UnknownWidgetProps> {
  static propTypes = {
    onLoad: PropTypes.func.isRequired,
  };

  componentDidMount(): void {
    const { onLoad } = this.props;
    onLoad();
  }

  componentDidUpdate(): void {
    const { onLoad } = this.props;
    onLoad();
  }

  render(): JSX.Element {
    return <div>Unknown widget type</div>;
  }
}
