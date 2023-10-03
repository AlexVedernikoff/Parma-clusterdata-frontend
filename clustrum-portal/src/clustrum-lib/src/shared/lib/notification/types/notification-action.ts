export interface NotificationAction {
  label: string;
  onClick: () => void;
  isForceCloseAfterClick: boolean;
}
