import { $appSettingsStore } from '@entities/app-settings';
import { SDK } from '@kamatech-data-ui/clustrum';

export default new SDK({
  endpoints: $appSettingsStore.getState().endpoints,
  currentCloudId: $appSettingsStore.getState().currentCloudId,
  currentCloudFolderId: $appSettingsStore.getState().currentCloudFolderId,
});
