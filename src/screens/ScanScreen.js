import { Ionicons } from '@expo/vector-icons';
// import { Camera, CameraView } from 'expo-camera'; // Camera deprecated
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PRODUCTS } from '../data/products';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

export default function ScanScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // Find product in DB or show "Product Not Found"
        const product = PRODUCTS.find(p => p.barcode === data);

        if (product) {
            navigation.navigate('ProductDetail', { product });
        } else {
            alert(`Produit non trouvé : ${data}`);
        }

        // Reset scan after delay
        setTimeout(() => setScanned(false), 2000);
    };

    if (!permission) {
        return <View style={styles.center}><Text>Demande de permission caméra...</Text></View>;
    }
    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>Accès à la caméra refusé</Text>
                <Button title="Autoriser" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "ean13", "upc_a"],
                }}
            />

            {/* Overlay */}
            <View style={styles.overlay}>
                <View style={styles.unfocusedContainer} />
                <View style={styles.middleContainer}>
                    <View style={styles.unfocusedContainer} />
                    <View style={styles.focusedContainer}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                    <View style={styles.unfocusedContainer} />
                </View>
                <View style={styles.unfocusedContainer} />
            </View>

            <Text style={styles.instructions}>Scannez un code-barre</Text>

            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unfocusedContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
    },
    middleContainer: {
        flexDirection: 'row',
        height: SCAN_SIZE,
    },
    focusedContainer: {
        width: SCAN_SIZE,
        height: SCAN_SIZE,
        backgroundColor: 'transparent',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: theme.colors.primary,
        borderWidth: 4,
    },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    instructions: {
        position: 'absolute',
        bottom: 100,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
});
