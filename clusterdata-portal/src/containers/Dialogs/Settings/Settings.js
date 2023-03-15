import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { Dialog, YCSelect } from '@parma-data-ui/common/src';
import { i18n } from '@parma-data-ui/clusterdata';
import Wrapper from '../Control/Wrapper/Wrapper';
import { getSettings, isDialogVisible } from '../../../store/selectors/dash';
import { closeDialog, setSettings } from '../../../store/actions/dash';
import { DIALOG_TYPE } from '../../../modules/constants/constants';
import { getStyles } from '../../../services/dashboard/get-styles';

const b = block('dialog-settings');

function Settings({ settings, visible, setSettings, closeDialog }) {
  const [selectedStyle, selectStyle] = React.useState({
    styleId: settings.styleId,
    style: settings.style,
  });
  const [styles, setStyles] = React.useState([]);
  const stylesMap = new Map(styles.map(({ id, value }) => [id, value]));

  useEffect(() => {
    getStyles().then(styles => setStyles(styles));
  }, []);

  const handleStyleChange = styleId => {
    const style = stylesMap.get(styleId);

    if (style) {
      selectStyle({ styleId, style });
    }
  };

  return settings ? (
    <Dialog visible={visible} onClose={closeDialog} autoclosable={false}>
      <Dialog.Header caption={i18n('dash.settings-dialog.edit', 'label_settings')} />
      <Dialog.Body className={b()}>
        <Wrapper title={i18n('dash.settings-dialog.edit', 'theme_select')}>
          <YCSelect
            showSearch={true}
            type={'single'}
            allowEmptyValue={false}
            value={selectedStyle.styleId}
            onChange={handleStyleChange}
            disabled={!styles.length}
            items={styles.map(({ id, name }) => ({
              value: id,
              title: name,
              key: id,
            }))}
          />
        </Wrapper>
      </Dialog.Body>
      <Dialog.Footer
        onClickButtonCancel={closeDialog}
        textButtonApply={i18n('dash.settings-dialog.edit', 'button_save')}
        textButtonCancel={i18n('dash.settings-dialog.edit', 'button_cancel')}
        onClickButtonApply={() => {
          setSettings({ ...settings, ...selectedStyle });
          closeDialog();
        }}
      />
    </Dialog>
  ) : null;
}

Settings.propTypes = {
  settings: PropTypes.shape({
    styleId: PropTypes.string.isRequired,
    style: PropTypes.string.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  setSettings: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  settings: getSettings(state),
  visible: isDialogVisible(state, DIALOG_TYPE.SETTINGS),
});

const mapDispatchToProps = {
  closeDialog,
  setSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
