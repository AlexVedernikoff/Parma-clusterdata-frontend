import React from 'react';
import { DndContainer } from '@lib-shared/ui/drag-n-drop';
import { VisualizationControlContainer } from './visualization-control-container';
import { DndContainerProps, DndItemData } from '@lib-shared/ui/drag-n-drop/types';
import {
  VisualizationFactoryProps,
  VisualizationType,
  ContainerProps,
  isDndContainerProps,
} from '../types';

//Перевод на Ant в 711988
import { CheckBox } from '../../../../../../kamatech_modules/lego-on-react';
import { KamatechRangePicker } from '../../../../../../kamatech_modules/kamatech-ui';
import { KamatechRangePicker as KamatechRangePickerType } from '../../../../../../kamatech_modules/kamatech-ui/components/KamatechRangePicker/KamatechRangePicker.interface';
import Select from '../../../../../../kamatech_modules/lego-on-react/es-modules-src/components/select/select.react';
import TextInput from '../../../../../../kamatech_modules/lego-on-react/es-modules-src/components/textinput/textinput.react';

const selectControl = (
  type: VisualizationType,
  containerProps: ContainerProps,
  containerContent?: JSX.Element,
): JSX.Element | null => {
  //TODO Добавить остальные проверки, после появления типов
  switch (type) {
    case VisualizationType.DndContainer:
      return isDndContainerProps(containerProps) ? (
        <DndContainer {...(containerProps as DndContainerProps<DndItemData>)} />
      ) : null;
    case VisualizationType.CheckBox:
      return <CheckBox {...containerProps} />;
    case VisualizationType.RangePicker:
      return <KamatechRangePicker {...(containerProps as KamatechRangePickerType)} />;
    case VisualizationType.TextInput:
      return <TextInput {...containerProps} />;
    case VisualizationType.Select:
      return <Select {...containerProps}>{containerContent}</Select>;
    default:
      return null;
  }
};

export function VisualizationFactory(props: VisualizationFactoryProps): JSX.Element {
  const { type, containerProps, title, icon, className, containerContent } = props;

  return (
    <VisualizationControlContainer title={title} icon={icon} className={className}>
      {selectControl(type, containerProps, containerContent)}
    </VisualizationControlContainer>
  );
}
