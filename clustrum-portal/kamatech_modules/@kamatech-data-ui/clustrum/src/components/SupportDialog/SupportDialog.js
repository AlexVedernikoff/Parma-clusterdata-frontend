import React, { PureComponent } from 'react';
import block from 'bem-cn-lite';

import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';

// import './SupportDialog.scss';
const b = block('support-dialog');

class SupportDialog extends PureComponent {
  state = {
    isVisible: false,
  };

  open = () => {
    this.setState({
      isVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      isVisible: false,
    });
  };

  render() {
    const { isVisible } = this.state;

    return (
      <Dialog visible={isVisible} onClose={this.onClose}>
        <div className={b()}>
          <Dialog.Header caption={'ClusterData Support'} />
          <div className={b('content')}>
            <iframe
              className={b('support-iframe')}
              src="https://forms.yandex.ru/surveys/9782/?iframe=1&theme=support&lang=ru"
              frameBorder="0"
              name="frame-7211"
            />
          </div>
          <Dialog.Footer
            onClickButtonCancel={this.onClose}
            onClickButtonApply={this.onClose}
            textButtonCancel="Готово"
            textButtonApply={''}
            progress={false}
          />
        </div>
      </Dialog>
    );
  }
}

export default SupportDialog;
