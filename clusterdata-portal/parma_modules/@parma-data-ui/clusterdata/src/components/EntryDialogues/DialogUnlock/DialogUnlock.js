import React from 'react';
import PropTypes from 'prop-types';
import DialogAddParticipants from 'components/AccessRights/DialogAddParticipants/DialogAddParticipants';

export default class DialogUnlock extends React.Component {
    static propTypes = {
        sdk: PropTypes.object,
        onClose: PropTypes.func,
        visible: PropTypes.bool,
        dialogProps: PropTypes.shape({
            entry: PropTypes.object.isRequired
        }).isRequired
    };

    onClose = () => {
        this.props.onClose({status: 'close'});
    }

    render() {
        const {
            dialogProps: {entry},
            ...props
        } = this.props;

        return (
            <DialogAddParticipants
                {...props}
                entry={entry}
                onClose={this.onClose}
                onSuccess={this.onClose}
                withParticipantsRequests
                mode="request"
            />
        );
    }
}
