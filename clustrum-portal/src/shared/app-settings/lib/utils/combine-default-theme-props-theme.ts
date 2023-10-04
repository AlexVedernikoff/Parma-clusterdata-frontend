import { Theme } from '@shared/app-settings';

export function combineDefaultThemeAndPropsTheme(
  propsTheme: Theme,
  appTheme: Theme,
): Theme {
  const combinedTheme = propsTheme
    ? {
        ...propsTheme,
        ant: {
          token: { ...propsTheme.ant.token },
          components: {
            ...appTheme.ant.components,
          },
        },
      }
    : appTheme;

  return combinedTheme;
}
