import '../EntryIcon/EntryIcon';
import '../EntryDialogues/EntryDialogues';
import PathSelect from '@parma-data-ui/common/src/components/PathSelect/PathSelect';
import {getPlaceParameters} from '../Navigation/Base/configure';
PathSelect.getPlaceParameters = getPlaceParameters;
export default PathSelect;
