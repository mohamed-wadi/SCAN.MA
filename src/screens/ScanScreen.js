import { Ionicons } from '@expo/vector-icons';
// import { Camera, CameraView } from 'expo-camera'; // Camera deprecated
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProducts } from '../context/ProductContext';
import { useUser } from '../context/UserContext';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

export default function ScanScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { getProductByBarcode } = useProducts();
    const { incrementScanCount } = useUser();
    const [sound, setSound] = useState();
    const lastScanRef = useRef(0); // Throttle ref

    async function playScanSound() {
        console.log('Loading Sound');
        try {
            const { sound } = await Audio.Sound.createAsync(
                // Short beep sound (hosted or requiring local asset). 
                // For now, using a generic online notification sound or creating a very short one is hard.
                // We will use a reliable public URL for a short beep.
                { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' }
            );
            setSound(sound);
            console.log('Playing Sound');
            await sound.playAsync();
        } catch (error) {
            console.log('Error playing sound', error);
        }
    }

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    useFocusEffect(
        useCallback(() => {
            // Met un délai avant de réactiver le scanner pour éviter de rescanner immédiatement en revenant
            const timer = setTimeout(() => {
                setScanned(false);
            }, 5000);
            return () => clearTimeout(timer);
        }, [])
    );

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    const handleBarCodeScanned = ({ type, data }) => {
        const now = Date.now();
        // Prevent double scan if already scanned or if less than 5s passed since last scan
        if (scanned || (now - lastScanRef.current < 5000)) return;

        lastScanRef.current = now;
        setScanned(true);
        incrementScanCount(); // Track scan stats
        playScanSound(); // Play beep

        // Find product in DB or show "Product Not Found"
        const product = getProductByBarcode(data);

        if (product) {
            navigation.navigate('ProductDetail', { product });
            // Re-enable scan when coming back is handled by useFocusEffect usually, 
            // but here we just wait a bit or let user reset. 
            // Easier: setScanned(false) only when coming back via listener
        } else {
            Alert.alert(
                "Produit inconnu",
                `Le code ${data} n'existe pas encore. Voulez-vous l'ajouter ? `,
                [
                    {
                        text: "Annuler",
                        onPress: () => {
                            // Delay re-enabling scan logic is handled by the throttle/focus effect mostly, 
                            // but explicit setScanned(false) with delay is good here too.
                            setTimeout(() => setScanned(false), 2000);
                        },
                        style: "cancel"
                    },
                    {
                        text: "Ajouter",
                        onPress: () => {
                            navigation.navigate('AddProduct', { barcode: data });
                            // We keep scanned=true so it doesn't scan while navigating
                            // Resetting it will happen when returning or manually
                        }
                    }
                ]
            );
        }
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
