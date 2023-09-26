import React from 'react';
import { DndContainer } from '@lib-shared/ui/drag-n-drop';
import {
  Checkbox,
  Select,
  InputNumber,
  Input,
  Slider,
  CheckboxProps,
  SliderSingleProps,
  InputNumberProps,
  SelectProps,
  InputProps,
} from 'antd';
import { VisualizationControlContainer } from '../visualization-control-container';
import {
  VisualizationFactoryProps,
  VisualizationType,
  ContainerProps,
  isDndContainerProps,
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
      return (
        <Checkbox
          className={styles['ant-checkbox']}
          {...(containerProps as CheckboxProps)}
        >
          {containerContent}
        </Checkbox>
      );
    case VisualizationType.Slider:
      return <Slider {...(containerProps as SliderSingleProps)} />;
    case VisualizationType.TextInput:
      return (
        <Input className={styles['ant-control']} {...(containerProps as InputProps)} />
      );
    case VisualizationType.NumberInput:
      return (
        <InputNumber
          className={styles['ant-control']}
          {...(containerProps as InputNumberProps)}
        />
      );
    case VisualizationType.Select:
      return (
        <Select className={styles['ant-control']} {...(containerProps as SelectProps)} />
      );
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
