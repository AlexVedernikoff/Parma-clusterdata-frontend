import { VisualizationType } from './visualization-type';
import { ContainerProps } from './container-props';

export interface VisualizationFactoryProps {
  title: string;
  type: VisualizationType;
  containerProps: ContainerProps;
  icon?: JSX.Element;
  className?: string;
  containerContent?: JSX.Element;
}
