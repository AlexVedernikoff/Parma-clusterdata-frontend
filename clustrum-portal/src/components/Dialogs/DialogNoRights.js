import React, { PureComponent } from 'react';

// import './Dialogs.scss';

import { Button } from 'lego-on-react';

import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';

import { i18n } from '@kamatech-data-ui/clustrum';

class DialogNoRights extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Dialog visible={this.props.visible} onClose={this.props.onClose}>
        <div className="dialog-no-rights">
          <Dialog.Header caption={i18n('wizard', 'label_no-rights-title')} />
          <Dialog.Body>
            <div>{i18n('wizard', 'label_no-rights-text')}</div>
          </Dialog.Body>
          <Dialog.Footer preset="default" listenKeyEnter hr={false}>
            <Button theme="pseudo" view="default" tone="default" size="n" onClick={this.props.onAccessRights}>
              {i18n('wizard', 'button_access-rights')}
            </Button>
            <Button theme="pseudo" view="default" tone="default" size="n" onClick={this.props.onSaveAs}>
              {i18n('wizard', 'button_save-as')}
            </Button>
          </Dialog.Footer>
        </div>
      </Dialog>
    );
  }
}

export default DialogNoRights;
