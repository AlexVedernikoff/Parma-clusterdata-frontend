import { DATASET_ERRORS } from '../../../../../constants';

export interface SectionDatasetErrorProps {
  errorStatus?: keyof typeof DATASET_ERRORS;
  onRequestDatasetRights(): void;
  onLoadDatasetAgain(): void;
}
