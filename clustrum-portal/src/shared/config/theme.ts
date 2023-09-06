const DEFAULT_PRIMARY_COLOR = '#bb2649';
const CUSTOM_PRIMARY_COLOR = process.env.REACT_APP_PRIMARY_COLOR;
const rootElem = document.querySelector<HTMLElement>(':root');

if (rootElem) {
  rootElem.style.setProperty(
    '--antd-color-primary',
    CUSTOM_PRIMARY_COLOR || DEFAULT_PRIMARY_COLOR,
  );
}

export const ANT_TOKEN = {
  token: {
    colorPrimary: CUSTOM_PRIMARY_COLOR || DEFAULT_PRIMARY_COLOR,
    colorLink: CUSTOM_PRIMARY_COLOR || DEFAULT_PRIMARY_COLOR,
    colorSplit: 'rgba(0, 0, 0, 0.06)',
    colorBorder: 'rgba(0, 0, 0, 0.15)',
  },
};

export const COLOR_ACCENT = '#ffd700';
