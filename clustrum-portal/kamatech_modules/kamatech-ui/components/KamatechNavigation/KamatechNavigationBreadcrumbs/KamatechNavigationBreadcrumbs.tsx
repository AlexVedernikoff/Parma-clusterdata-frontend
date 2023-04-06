import * as React from 'react';
import './KamatechNavigationBreadcrumbs.css';

import { KamatechNavigationCrumb } from '../KamatechNavigationCrumb/KamatechNavigationCrumb';
import { KamatechNavigationBreadcrumbsInterface } from './KamatechNavigationBreadcrumbs.interface';
import { KamatechNavigationBreadcrumbsModel } from './KamatechNavigationBreadcrumbs.model';
import { ClassHelper } from '../../../helpers';

export class KamatechNavigationBreadcrumbs extends React.PureComponent<KamatechNavigationBreadcrumbsInterface> {
  static defaultProps = {
    size: KamatechNavigationBreadcrumbsModel.size,
    path: KamatechNavigationBreadcrumbsModel.path,
    place: KamatechNavigationBreadcrumbsModel.place,
  };

  renderBreadcrumbs(model: KamatechNavigationBreadcrumbsModel) {
    return model
      .getFolderParts()
      .filter(Boolean)
      .map((item, index, array) => {
        const isFirst = index === 0;
        const isLast = index === array.length - 1;
        return (
          <KamatechNavigationCrumb
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
    const model = new KamatechNavigationBreadcrumbsModel(this.props);
    const baseClass = 'parma-navigation-breadcrumbs';
    const sizeClass = model.size ? `${baseClass}_size_${model.size}` : '';
    const className = ClassHelper.merge(baseClass, sizeClass);
    return <div className={className}>{this.renderBreadcrumbs(model)}</div>;
  }
}
