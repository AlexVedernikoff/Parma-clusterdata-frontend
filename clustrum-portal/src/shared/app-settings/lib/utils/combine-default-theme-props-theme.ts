import { $appSettingsStore, Theme } from '@shared/app-settings';

export function combineDefaultThemeAndPropsTheme(propsTheme: Theme): Theme {
  const combinedTheme = propsTheme
    ? {
        ...propsTheme,
        ant: {
          token: { ...propsTheme.ant.token },
          components: {
            ...$appSettingsStore.getState().theme.ant.components,
          },
        },
      }
    : $appSettingsStore.getState().theme;

  return combinedTheme;
}
