import { Theme, PropsTheme } from '@shared/app-settings';

export function combineDefaultThemeAndPropsTheme(
  propsTheme: PropsTheme,
  appTheme: Theme,
): Theme {
  const combinedTheme = propsTheme
    ? {
        ...propsTheme,
        ant: {
          token: { ...propsTheme.ant },
          components: {
            ...appTheme.ant.components,
          },
        },
      }
    : appTheme;

  return combinedTheme;
}
