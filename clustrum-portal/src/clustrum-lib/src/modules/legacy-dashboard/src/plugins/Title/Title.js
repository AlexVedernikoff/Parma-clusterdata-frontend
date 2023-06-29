import React from 'react';
import block from 'bem-cn-lite';
import { TitleInfoElement } from '@lib-shared/ui/info-elements';

const b = block('dashkit-plugin-title');

export default {
  type: 'title',
  defaultLayout: { w: Infinity, h: 2 },
  renderer(props, forwardedRef) {
    return <TitleInfoElement {...props} ref={forwardedRef} />;
  },
};
