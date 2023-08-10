import { Tab } from './tab';

export type DashboardTabsSettingsProps = DashboardTabsSettingsState &
  DashboardTabsSettingsActions;

export interface DashboardTabsSettingsState {
  tabs: Tab[];
  visible: boolean;
}

export interface DashboardTabsSettingsActions {
  closeDialog(): void;
  setTabs(tabs: Tab[]): void;
}
