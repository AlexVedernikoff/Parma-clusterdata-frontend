import { VisualizationType } from './visualization-type';
import { ContainerProps } from './container-props';

export interface VisualizationFactoryProps {
  containerTitle: string;
  containerType: VisualizationType;
  containerProps: ContainerProps;
  containerIcon?: Element;
  containerClassName?: string;
  containerContent?: Element;
}
