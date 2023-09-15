import React from 'react';
import { DndContainer } from '@lib-shared/ui/drag-n-drop';
import { Checkbox, Select, InputNumber, Input, Slider } from 'antd';
import { VisualizationControlContainer } from '../visualization-control-container/visualization-control-container';
import {
  VisualizationFactoryProps,
  VisualizationType,
  ContainerProps,
  isDndContainerProps,
  isCheckboxProps,
  isSelectProps,
  isInputNumberProps,
  isInputTextProps,
  isSliderProps,
} from '../../types';
import styles from './visualization-factory.module.css';

const selectControl = (
  type: VisualizationType,
  containerProps: ContainerProps,
  containerContent?: JSX.Element,
): JSX.Element | null => {
  switch (type) {
    case VisualizationType.DndContainer:
      return isDndContainerProps(containerProps) ? (
        <DndContainer {...containerProps} />
      ) : null;
    case VisualizationType.CheckBox:
      return isCheckboxProps(containerProps) ? (
        <Checkbox className={styles['ant-checkbox']} {...containerProps}>
          {containerContent}
        </Checkbox>
      ) : null;
    case VisualizationType.Slider:
      return isSliderProps(containerProps) ? <Slider {...containerProps} /> : null;
    case VisualizationType.TextInput:
      return isInputTextProps(containerProps) ? (
        <Input className={styles['ant-control']} {...containerProps} />
      ) : null;
    case VisualizationType.NumberInput:
      return isInputNumberProps(containerProps) ? (
        <InputNumber className={styles['ant-control']} {...containerProps} />
      ) : null;
    case VisualizationType.Select:
      return isSelectProps(containerProps) ? (
        <Select className={styles['ant-control']} {...containerProps} />
      ) : null;
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
