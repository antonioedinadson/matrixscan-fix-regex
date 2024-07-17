import { PermissionsAndroid, Platform } from "react-native";

export const cameraPermission = async (): Promise<boolean> => {
    try {
        const isOldVersion = Platform.OS === 'android' && Platform.Version < 23;

        if (isOldVersion) {
            return true;
        }

        const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log("CAMERA: PERMISIONS NOT ACCEPTED");
            return false;
        }

        console.log("CAMERA: PERMISIONS ACCEPTED");
        return true;

    } catch (error) {
        throw error;
    }
};