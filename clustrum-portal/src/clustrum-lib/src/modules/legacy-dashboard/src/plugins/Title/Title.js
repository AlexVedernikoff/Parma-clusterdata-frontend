import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { PluginTitle } from '../../../../../shared/ui/info-elements/title-info-element/title-info-element';
// import './Title.scss';

const b = block('dashkit-plugin-title');

// class PluginTitle extends React.Component {
//   render() {
//     const { data } = this.props;
//     const text = data.text ? data.text : '';
//     const size = data.size ? data.size : false;
//     const id = data.showInTOC && text ? encodeURIComponent(text) : undefined;
//     return (
//       <div id={id} className={b({ size })}>
//         {text}
//       </div>
//     );
//   }
// }
//
// PluginTitle.propTypes = {
//   data: PropTypes.shape({
//     size: PropTypes.string,
//     text: PropTypes.string,
//     showInTOC: PropTypes.bool,
//   }),
// };

export default {
  type: 'title',
  defaultLayout: { w: Infinity, h: 2 },
  renderer(props, forwardedRef) {
    return <PluginTitle {...props} ref={forwardedRef} />;
  },
};
