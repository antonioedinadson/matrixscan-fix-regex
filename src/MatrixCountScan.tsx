import { useEffect, useMemo, useRef, useState } from "react";
import { BackHandler } from "react-native";
import { BarcodeCount, BarcodeCountSession, BarcodeCountSettings, BarcodeCountView, BarcodeCountViewListener, BarcodeCountViewStyle, BarcodeCountViewUiListener, Symbology, TrackedBarcode } from "scandit-react-native-datacapture-barcode";
import { Camera, DataCaptureContext, FrameSourceState } from "scandit-react-native-datacapture-core";
import { cameraPermission } from "./permission";

const MatrixCountScan = () => {

    // CONTEXT
    const dataCaptureContext = useMemo(() => {
        // return DataCaptureContext.forLicenseKey('license_key');
        return DataCaptureContext.forLicenseKey('LICENSE_KEY_HERE');
    }, []);

    // REFS
    let viewListenerRef = useRef<BarcodeCountViewListener | null>(null);
    let viewUiListenerRef = useRef<BarcodeCountViewUiListener | null>(null);

    // STATES
    const [barcodeCountMode, setBarcodeCountMode] = useState<BarcodeCount | null>(null);
    const [camera, setCamera] = useState<Camera | null>(null);
    const [cameraState, setCameraState] = useState(FrameSourceState.Off);

    // SETUP
    useEffect(() => {

        const init = () => {

            const settings = new BarcodeCountSettings();
            settings.enableSymbologies([Symbology.EAN8, Symbology.Code128]);

            const filterSettings = settings.filterSettings;
            filterSettings.excludedCodesRegex = '^1234.*';

            const barcodeCount = BarcodeCount.forContext(dataCaptureContext, settings);

            const barcodeCountListener = {
                didScan: (_: BarcodeCount, session: BarcodeCountSession) => {
                    console.log(session);
                },
            };

            barcodeCount.addListener(barcodeCountListener);

            viewUiListenerRef.current = {
                didTapListButton: (_: BarcodeCountView) => { },
                didTapExitButton: (_: BarcodeCountView) => {
                    setCameraState(FrameSourceState.Off)
                }
            };

            viewListenerRef.current = {
                didCompleteCaptureList: _ => {

                }
            };

            setBarcodeCountMode(barcodeCount);
        };

        const startCamera = () => {

            // CAMERA INITIALIZE
            if (!camera) {
                const defaultCamera = Camera.withSettings(BarcodeCount.recommendedCameraSettings);
                dataCaptureContext.setFrameSource(defaultCamera)
                setCamera(defaultCamera);
                console.log("CAMERA INITIALIZE");
            }

            // CAMERA PERMISSION HANDLER
            cameraPermission()
                .then(() => setCameraState(FrameSourceState.On))
                .catch(() => BackHandler.exitApp());
        };

        init();
        startCamera();

        return () => {
            dataCaptureContext.dispose();
        };

    }, []);

    useEffect(() => {

        if (camera) {
            camera.switchToDesiredState(cameraState)
                .then(res => console.log("CAMERA ON"))
                .catch(err => console.log(err));
        }

        return () => {
            if (camera) {
                camera.switchToDesiredState(FrameSourceState.Off)
                    .then(res => console.log("CAMERA OFF"))
                    .catch(err => console.log(err));
            }
        }
    }, [cameraState]);

    return (
        barcodeCountMode && (
            <BarcodeCountView
                // @ts-ignore
                style={{ flex: 1 }}
                barcodeCount={barcodeCountMode}
                context={dataCaptureContext}
                viewStyle={BarcodeCountViewStyle.Icon}
                ref={view => {
                    if (view) {
                        view.uiListener = viewUiListenerRef.current;
                        view.listener = viewListenerRef.current;
                    }
                }}
            />
        )
    );
};

export default MatrixCountScan;