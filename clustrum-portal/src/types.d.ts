declare module '*.module.css' {
  const classes: { [key: string]: string };
  // eslint-disable-next-line import/no-default-export
  export default classes;
}

declare let ENV: {
  biHost: string;
  portalHost: string;
  exportHost: string;
};
