import { CallbackFunctionArgs, CallbackFunctionArgsReturnAny } from '../../../helpers';
import { KamatechNavigationBreadcrumbsInterface } from './KamatechNavigationBreadcrumbs.interface';
import { NavigationPlace } from './KamatechNavigationBreadcrumbs.enum';

export class KamatechNavigationBreadcrumbsModel
  implements KamatechNavigationBreadcrumbsInterface {
  constructor(value?: KamatechNavigationBreadcrumbsInterface) {
    const { size, path, place, onClick, linkWrapper, getPlaceParameters } = value || {};
    this.size = size || KamatechNavigationBreadcrumbsModel.size;
    this.path = path || KamatechNavigationBreadcrumbsModel.path;
    this.place = place || KamatechNavigationBreadcrumbsModel.place;
    this.onClick = onClick;
    this.linkWrapper = linkWrapper;
    this.getPlaceParameters = getPlaceParameters;
  }

  public static size = 'm';

  public static path = '';

  public static place = NavigationPlace.Root;

  size?: string;

  path?: string;

  place?: string;

  onClick?: CallbackFunctionArgs;

  linkWrapper?: CallbackFunctionArgsReturnAny;

  getPlaceParameters?: (value: string) => { text: string };

  getFolderNameByPathMap(): { path: string; name: string }[] {
    let partialPath = '';

    return (this.path || '')
      .split('/')
      .filter(Boolean)
      .map(name => {
        partialPath += name + '/';
        return { name, path: partialPath };
      });
  }

  getFolderParts(): { path: string; name: string }[] {
    if (!this.getPlaceParameters || !this.place) {
      return [];
    }

    const { text } = this.getPlaceParameters(this.place);
    const first = { path: '', name: text };

    switch (this.place) {
      case NavigationPlace.Root:
      case NavigationPlace.Favorites:
      case NavigationPlace.Latest:
      case NavigationPlace.Dashboards:
      case NavigationPlace.Datasets:
      case NavigationPlace.Widgets:
      case NavigationPlace.Connections: {
        return [first, ...this.getFolderNameByPathMap()];
      }
      default: {
        return [first];
      }
    }
  }
}
