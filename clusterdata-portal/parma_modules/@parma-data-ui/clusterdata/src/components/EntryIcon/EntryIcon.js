import EntryIcon from '@parma-data-ui/common/src/components/Navigation/EntryIcon/EntryIcon';
import { ENTRY_TYPES, DL } from '../../constants/common';

import iconFilesFolder from '../../icons/files-folder';
import iconFilesWidget from '../../icons/files-widget.svg';
import iconFilesDataset from '../../icons/files-dataset.svg';
import iconFilesDashboard from '../../icons/files-dashboard.svg';
import iconFilesMonitoring from '../../icons/files-monitoring.svg';
import iconFilesPresentation from '../../icons/files-presentation.svg';
import iconFilesMisc from '../../icons/files-misc.svg';

import iconLegacyWizard from '../../icons/legacy-wizard.svg';
import iconScript from '../../icons/script.svg';

const typeToIcon = {
  legacyWizard: iconLegacyWizard,
  script: iconScript,
  ...ENTRY_TYPES.legacyWizard.reduce((result, type) => {
    result[type] = iconLegacyWizard;
    return result;
  }, {}),
  ...ENTRY_TYPES.legacyScript.reduce((result, type) => {
    result[type] = iconScript;
    return result;
  }, {}),
};

const getScopeIcon = scope => {
  switch (scope) {
    case 'folder':
      return iconFilesFolder;
    case 'widget':
    case 'chart':
      return iconFilesWidget;
    case 'dataset':
      return iconFilesDataset;
    case 'dashboard':
    case 'dash':
      return iconFilesDashboard;
    case 'monitoring':
      return iconFilesMonitoring;
    case 'pdf':
      return iconFilesPresentation;
    default:
      return iconFilesMisc;
  }
};

EntryIcon.icons = ({ scope, type }) => {
  let iconData;
  if (type && DL.IS_INTERNAL) {
    const icon = typeToIcon[type];
    if (icon) {
      iconData = icon;
    }
  }
  return iconData ? iconData : getScopeIcon(scope);
};

export default EntryIcon;
