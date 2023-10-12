import { DashboardSettings } from './dashboard-settings';

export interface DashboardSettingsState {
  visible: boolean;
  settings: DashboardSettings;
}

export interface DashboardSettingsActions {
  closeDialog(): void;
  setSettings(settings: DashboardSettings): void;
}

export type DashboardSettingsProps = DashboardSettingsState & DashboardSettingsActions;
