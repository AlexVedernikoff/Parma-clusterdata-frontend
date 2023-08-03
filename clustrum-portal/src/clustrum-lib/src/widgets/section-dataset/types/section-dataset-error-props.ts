import { ErrorCode } from '@lib-shared/types';

export interface SectionDatasetErrorProps {
  errorStatus?: ErrorCode;
  onRequestDatasetRights(): void;
  onLoadDatasetAgain(): void;
}
