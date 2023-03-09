import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DialogCreateEntry
    from '@parma-data-ui/common/src/components/EntryDialogues/DialogCreateEntry/DialogCreateEntry';
import noop from 'lodash/noop';
import {I18n} from '../../../utils/i18n';

const i18n = I18n.keyset('component.dialog-save-editor-chart.view');

class DialogSaveEditorChart extends Component {
    static propTypes = {
        dialogProps: PropTypes.shape({
            path: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            data: PropTypes.object,
            title: PropTypes.string,
            defaultName: PropTypes.string,
            errorText: PropTypes.string,
            textButtonApply: PropTypes.string,
            textButtonCancel: PropTypes.string,
            withError: PropTypes.bool,
            onNotify: PropTypes.func
        }),
        sdk: PropTypes.shape({
            createEditorChart: PropTypes.func.isRequired
        })
    }
    onApply = ({key}) => {
        return this.props.sdk.createEditorChart({
            key,
            data: this.props.dialogProps.data || {},
            type: this.props.dialogProps.type
        });
    }
    render() {
        const defaultDialogProps = {
            title: i18n('section_title'),
            defaultName: i18n('label_name-default'),
            errorText: i18n('label_error'),
            textButtonApply: i18n('button_apply'),
            textButtonCancel: i18n('button_cancel'),
            withError: true,
            onNotify: noop
        };
        return (
            <DialogCreateEntry
                {...this.props}
                onApply={this.onApply}
                defaultDialogProps={defaultDialogProps}
            />
        );
    }
}

export default DialogSaveEditorChart;
