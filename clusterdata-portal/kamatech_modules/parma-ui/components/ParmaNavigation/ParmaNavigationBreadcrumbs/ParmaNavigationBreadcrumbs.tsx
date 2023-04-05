import * as React from 'react';
import './ParmaNavigationBreadcrumbs.css';

import { ParmaNavigationCrumb } from '../ParmaNavigationCrumb/ParmaNavigationCrumb';
import { ParmaNavigationBreadcrumbsInterface } from './ParmaNavigationBreadcrumbs.interface';
import { ParmaNavigationBreadcrumbsModel } from './ParmaNavigationBreadcrumbs.model';
import { ClassHelper } from '../../../helpers';

export class ParmaNavigationBreadcrumbs extends React.PureComponent<ParmaNavigationBreadcrumbsInterface> {
  static defaultProps = {
    size: ParmaNavigationBreadcrumbsModel.size,
    path: ParmaNavigationBreadcrumbsModel.path,
    place: ParmaNavigationBreadcrumbsModel.place,
  };

  renderBreadcrumbs(model: ParmaNavigationBreadcrumbsModel) {
    return model
      .getFolderParts()
      .filter(Boolean)
      .map((item, index, array) => {
        const isFirst = index === 0;
        const isLast = index === array.length - 1;
        return (
          <ParmaNavigationCrumb
            key={`brd-folder-name-${index}`}
            onClick={this.props.onClick}
            linkWrapper={this.props.linkWrapper}
            first={isFirst}
            last={isLast}
            item={item}
          />
        );
      });
  }

  render() {
    const model = new ParmaNavigationBreadcrumbsModel(this.props);
    const baseClass = 'parma-navigation-breadcrumbs';
    const sizeClass = model.size ? `${baseClass}_size_${model.size}` : '';
    const className = ClassHelper.merge(baseClass, sizeClass);
    return <div className={className}>{this.renderBreadcrumbs(model)}</div>;
  }
}
