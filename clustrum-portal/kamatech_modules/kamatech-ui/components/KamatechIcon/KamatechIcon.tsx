import * as React from 'react';
import { KamatechIconModel } from './KamatechIcon.model';
import { KamatechIconInterface } from './KamatechIcon.interface';

export class KamatechIcon extends React.Component<KamatechIconInterface> {
  static defaultProps = {
    fill: KamatechIconModel.fill,
    stroke: KamatechIconModel.stroke,
  };

  render() {
    const model = new KamatechIconModel(this.props);
    return (
      <svg
        xmlns={KamatechIconModel.xmlns}
        xmlnsXlink={KamatechIconModel.xmlnsXlink}
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
