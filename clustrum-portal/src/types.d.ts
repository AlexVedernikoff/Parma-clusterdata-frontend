declare module '*.module.css' {
  const classes: { [key: string]: string };
  // eslint-disable-next-line import/no-default-export
  export default classes;
}

declare let BUILD_SETTINGS: {
  systemTitle: string;
  isLib: boolean;
};
