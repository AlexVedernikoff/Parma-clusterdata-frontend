import React, { PureComponent } from 'react';

import { Button } from 'lego-on-react';

import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';

class DialogNoRights extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Dialog visible={this.props.visible} onClose={this.props.onClose}>
        <div className="dialog-no-rights">
          <Dialog.Header caption="Нет прав для редактирования" />
          <Dialog.Body>
            <div>
              Диаграмма доступен в режиме «Только для чтения». Запросите права
              на редактирование или сохраните изменения новым чартом
            </div>
          </Dialog.Body>
          <Dialog.Footer preset="default" listenKeyEnter hr={false}>
            <Button
              theme="pseudo"
              view="default"
              tone="default"
              size="n"
              onClick={this.props.onAccessRights}
            >
              Запросить права
            </Button>
            <Button
              theme="pseudo"
              view="default"
              tone="default"
              size="n"
              onClick={this.props.onSaveAs}
            >
              Сохранить как
            </Button>
          </Dialog.Footer>
        </div>
      </Dialog>
    );
  }
}

export default DialogNoRights;
