import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import moment from 'moment';
import { Button, CheckBox, TextInput } from 'lego-on-react';
import YCSelect from '@parma-data-ui/common/src/components/YCSelect/YCSelect';
import Datepicker from '@parma-data-ui/common/src/components/Datepicker';
import settings from '../../../../modules/settings/settings';
import { i18nV2 as i18nFactory } from '../../../../modules/i18n/i18n';
import * as keyset from './i18n';
import useDebounce from '../../../../../../../../src/hooks/use-debounce';

const DATE_FORMAT = 'YYYY-MM-DD';
const i18n = i18nFactory(keyset);
const b = block('chartkit-control-item');

function Label({ text }) {
  return text ? <span className={b('title')}>{text}</span> : null;
}

Label.propTypes = { text: PropTypes.string };

function ControlSelect({ label, searchable = true, multiselect, content, value, onChange, className = '' }) {
  return (
    <div className={b('control', { 'is-select': true }, className)}>
      <Label text={label} />
      <YCSelect
        showSearch={searchable}
        type={multiselect ? 'multiple' : 'single'}
        allowEmptyValue={true}
        value={value}
        onChange={onChange}
        cls={b('component')}
        placeholder={i18n('control.select_placeholder')}
        items={content.map(({ title, value }) => ({
          value,
          title,
          key: value,
        }))}
      />
    </div>
  );
}

ControlSelect.propTypes = {
  label: PropTypes.string,
  param: PropTypes.string.isRequired,
  multiselect: PropTypes.bool,
  searchable: PropTypes.bool,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

function ControlInput({ label, placeholder, value, onChange, className = '' }) {
  const [text, setText] = React.useState(value);
  const debouncedOnChange = useDebounce(onChange, 500);

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div className={b('control', { 'is-input': true }, className)}>
      <Label text={label} />
      <TextInput
        theme="normal"
        view="default"
        tone="default"
        size="s"
        placeholder={placeholder}
        cls={b('component', { input: true })}
        text={text}
        onChange={value => {
          setText(value);
          debouncedOnChange(value);
        }}
        controlAttrs={{
          onKeyPress: event => event.charCode === 13 && onChange(text),
        }}
        // срабатывает дважды, поэтому используется controlAttrs.onKeyPress
        // onKeyDown={event => event.keyCode === 13 && props.onEnter(text)}
      />
      {value && (
        <div
          className={b('clear-btn')}
          onClick={() => {
            onChange('');
            setText('');
          }}
        ></div>
      )}
    </div>
  );
}

ControlInput.propTypes = {
  label: PropTypes.string,
  param: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

function ControlDatepicker({ label, minDate, maxDate, value, onChange, className = '' }) {
  return (
    <div className={b('control', { 'is-datepicker': true, 'is-single-datepicker': true }, className)}>
      <Label text={label} />
      <Datepicker
        locale={settings.lang}
        minDate={minDate}
        maxDate={maxDate}
        date={value}
        scale="day"
        showApply={false}
        callback={({ from }) => onChange(moment(from).format(DATE_FORMAT))}
      />
    </div>
  );
}

ControlDatepicker.propTypes = {
  label: PropTypes.string,
  param: PropTypes.string.isRequired,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

function ControlRangeDatepicker({ label, minDate, maxDate, value: { from, to }, onChange, className = '' }) {
  return (
    <div className={b('control', { 'is-datepicker': true, 'is-range-datepicker': true }, className)}>
      <Label text={label} />
      <Datepicker
        locale={settings.lang}
        minDate={minDate}
        maxDate={maxDate}
        fromDate={from}
        toDate={to}
        showApply={false}
        callback={({ from, to }) =>
          onChange({
            from: moment(from).format(DATE_FORMAT),
            to: moment(to).format(DATE_FORMAT),
          })
        }
      />
    </div>
  );
}

ControlRangeDatepicker.propTypes = {
  label: PropTypes.string,
  param: PropTypes.string, // для случая __interval_YYYY-MM-DD_YYYY-MM-DD
  paramFrom: PropTypes.string,
  paramTo: PropTypes.string,
  dateFormat: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  value: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

function ControlButton({ text, theme, onChange, className = '' }) {
  return (
    <Button
      theme={theme || 'normal'}
      view="default"
      tone="default"
      size="xs"
      cls={b('control', className)}
      // setTimeout в частности для того, чтобы отработал onBlur от ControlInput
      onClick={() => setTimeout(() => onChange(), 0)}
    >
      {text || i18n('apply')}
    </Button>
  );
}

ControlButton.propTypes = {
  text: PropTypes.string,
  theme: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

function ControlCheckbox({ label, value, onChange, className = '' }) {
  const checked = value === 'true';
  return (
    <CheckBox
      theme="normal"
      view="default"
      tone="default"
      size="s"
      checked={checked}
      cls={b('control', className)}
      onChange={() => onChange(checked ? 'false' : 'true')}
    >
      {label}
    </CheckBox>
  );
}

ControlCheckbox.propTypes = {
  label: PropTypes.string,
  param: PropTypes.string.isRequired,
  dateFormat: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export { ControlSelect, ControlInput, ControlDatepicker, ControlRangeDatepicker, ControlCheckbox, ControlButton };
