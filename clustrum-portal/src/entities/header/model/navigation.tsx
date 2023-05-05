interface Item {
  title: string;
}

const translateText = (text: string): string => {
  switch (text) {
    case 'root':
      return 'Все объекты';
    case 'favorites':
      return 'Избранное';
    case 'connections':
    case 'connection':
      return 'Подключения';
    case 'datasets':
    case 'dataset':
      return 'Наборы данных';
    case 'widgets':
    case 'widget':
      return 'Диаграммы';
    case 'dashboards':
    case 'dash':
      return 'Аналитические панели';
    default:
      return text;
  }
};

export function NavigationItems(place: string, path: string): Item[] {
  return [
    {
      title: translateText(place),
    },
    ...path
      .split('/')
      .filter(item => item !== '')
      .map(item => ({
        title: translateText(item),
      })),
  ];
}

export function FormatPath(path: string): string {
  const pathItems: string[] = translateText(path)
    .split('/')
    .filter(item => item !== '');

  return pathItems[pathItems.length - 1];
}
