import { useState } from 'react';
import { Snackbar } from 'react-native-paper';

const DeviceSnackbar = ({ state }) => {
    const [visible, setVisible] = useState(!state);

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}>
            Device offline some fonctions are disabled
        </Snackbar>
    );
};

export default DeviceSnackbar;