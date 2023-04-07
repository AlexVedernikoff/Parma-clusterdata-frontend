import React from 'react';
import block from 'bem-cn-lite';
import { TextInput } from 'lego-on-react';

import { i18n } from '@kamatech-data-ui/clustrum';

// import './MaterializationScheduler.scss';

const b = block('materialization-scheduler');

function PeriodSetup(props) {
  const { materializationCron, changeScheduleSettings } = props;

  return (
    <div className={b('section', b('margin', { bottom: 15 }))}>
      <div className={b('label', b('width', { 120: true }))}>
        <span>{i18n('dataset.materialization.modify', 'field_materialization')}</span>
      </div>
      <TextInput
        cls={b('width', { 120: true })}
        theme="normal"
        size="s"
        view="default"
        tone="default"
        placeholder={i18n('dataset.materialization.modify', 'label_placeholder-cron')}
        onChange={text =>
          changeScheduleSettings({
            materializationCron: text,
          })
        }
        text={materializationCron}
      />
      <details>
        <div dangerouslySetInnerHTML={{ __html: i18n('dataset.materialization.modify', 'cron_help') }}></div>
      </details>
    </div>
  );
}

function MaterializationScheduler(props) {
  const { scheduleSettings, changeScheduleSettings } = props;

  const passProps = {
    ...scheduleSettings,
    changeScheduleSettings,
  };

  return (
    <div className={b()}>
      <PeriodSetup {...passProps} />
    </div>
  );
}

export default MaterializationScheduler;
