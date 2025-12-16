import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '../styles/theme';

const ScanButton = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={onPress}
                activeOpacity={0.9}
            >
                <Ionicons name="scan-outline" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        zIndex: 100,
    },
    button: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.large,
        shadowColor: theme.colors.primary,
        borderWidth: 4,
        borderColor: '#fff',
    },
});

export default ScanButton;
