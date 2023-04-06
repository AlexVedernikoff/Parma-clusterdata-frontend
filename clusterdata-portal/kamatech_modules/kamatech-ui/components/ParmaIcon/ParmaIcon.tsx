import * as React from 'react';
import { ParmaIconModel } from './ParmaIcon.model';
import { ParmaIconInterface } from './ParmaIcon.interface';

export class ParmaIcon extends React.Component<ParmaIconInterface> {
  static defaultProps = { fill: ParmaIconModel.fill, stroke: ParmaIconModel.stroke };

  render() {
    const model = new ParmaIconModel(this.props);
    return (
      <svg
        xmlns={ParmaIconModel.xmlns}
        xmlnsXlink={ParmaIconModel.xmlnsXlink}
        viewBox={model.data.viewBox}
        width={model.viewWidth}
        height={model.viewHeight}
        fill={model.fill}
        stroke={model.stroke}
        className={model.className}
        onClick={model.onClick}
      >
        <use xlinkHref={model.xlinkHref} />
      </svg>
    );
  }
}
