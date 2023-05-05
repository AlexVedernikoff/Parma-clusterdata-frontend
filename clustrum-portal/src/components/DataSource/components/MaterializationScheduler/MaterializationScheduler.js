import React from 'react';
import block from 'bem-cn-lite';
import { TextInput } from 'lego-on-react';

// import './MaterializationScheduler.scss';

const b = block('materialization-scheduler');

function PeriodSetup(props) {
  const { materializationCron, changeScheduleSettings } = props;

  return (
    <div className={b('section', b('margin', { bottom: 15 }))}>
      <div className={b('label', b('width', { 120: true }))}>
        <span>Расписание</span>
      </div>
      <TextInput
        cls={b('width', { 120: true })}
        theme="normal"
        size="s"
        view="default"
        tone="default"
        placeholder="0 */5 * * * *"
        onChange={text =>
          changeScheduleSettings({
            materializationCron: text,
          })
        }
        text={materializationCron}
      />
      <details>
        <div>
          <p>Расписание материализации задается в виде cron-выражения.</p>
          <p>
            Cron-выражение имеет вид: <code>s min h d mon w</code>, где:
            <ul>
              <li>
                <code>s</code> - секунды (0 - 59),
              </li>
              <li>
                <code>min</code> - минуты (0 - 59),
              </li>
              <li>
                <code>d</code> - день месяца (1 - 31),
              </li>
              <li>
                <code>mon</code> - месяц (1 - 12 или JAN-DEC),
              </li>
              <li>
                <code>w</code> - день недели (0 - 7 (0 или 7 Sunday) или MON-SUN.
              </li>
            </ul>
          </p>
          <p>
            Также в cron-выражении применяются специальные символы:
            <ul>
              <li>
                <code>*</code> - любое значение,
              </li>
              <li>
                <code>,</code> - разделение символов,
              </li>
              <li>
                <code>-</code> - диапазон,
              </li>
              <li>
                <code>/</code> - интервал,
              </li>
              <li>
                <code>?</code> - любое значение (для дней месяца и дней недели).
              </li>
            </ul>
          </p>
          <p>
            Примеры:
            <ul>
              <li>
                <code>0 0 * * * *</code> - каждый час в 0 минут 0 секунд,
              </li>
              <li>
                <code>0 */5 * * * *</code> - каждые 5 минут 0 секунд,
              </li>
              <li>
                <code>*/10 * * * * *</code> - каждые 10 секунд,
              </li>
              <li>
                <code>0 0 8-10 * * *</code> - в 8:00, 9:00, 10:00 часов каждого дня,
              </li>
              <li>
                <code>0 0 6,19 * * *</code> - в 9:00 и 19:00 часов каждого дня,
              </li>
              <li>
                <code>0 0 9-17 * *</code> MON-FRI - с 9:00 до 17:00 в рабочие дни,
              </li>
              <li>
                <code>0 0 0 1 1 ?</code> - каждый Новый Год в полночь.
              </li>
            </ul>
          </p>
        </div>
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
