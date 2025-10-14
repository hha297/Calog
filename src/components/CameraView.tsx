import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { CText } from './ui/CText';

type CameraViewProps = {
        onBarcodeScanned: (code: string) => void;
        onClose: () => void;
};

export const CameraView: React.FC<CameraViewProps> = ({ onBarcodeScanned, onClose }) => {
        const { hasPermission, requestPermission } = useCameraPermission();
        const device = useCameraDevice('back');
        const [isActive, setIsActive] = useState(true);
        const hasRequested = useRef(false);

        useEffect(() => {
                if (!hasPermission && !hasRequested.current) {
                        hasRequested.current = true;
                        requestPermission();
                }
        }, [hasPermission, requestPermission]);

        const handleCodes = useCallback(
                (codes: { value?: string }[]) => {
                        const first = codes.find((c) => !!c.value)?.value;
                        if (!first) return;
                        // prevent multiple triggers
                        setIsActive(false);
                        onBarcodeScanned(first);
                },
                [onBarcodeScanned],
        );

        const codeScanner = useCodeScanner({
                codeTypes: ['ean-13', 'ean-8', 'upc-a', 'upc-e', 'code-128', 'qr'],
                onCodeScanned: handleCodes,
        });

        if (!device) {
                return (
                        <View className="h-64 items-center justify-center rounded-lg bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                <CText>Loading camera…</CText>
                        </View>
                );
        }

        if (!hasPermission) {
                return (
                        <View className="h-64 items-center justify-center rounded-lg bg-surfacePrimary dark:bg-surfacePrimary-dark">
                                <CText>This app needs camera permission to scan barcodes.</CText>
                                <TouchableOpacity
                                        onPress={requestPermission}
                                        className="mt-3 rounded-md bg-primary px-4 py-2"
                                >
                                        <CText className="text-white">Grant Permission</CText>
                                </TouchableOpacity>
                        </View>
                );
        }

        return (
                <View className="overflow-hidden rounded-xl">
                        <Camera
                                style={{ height: 320, width: '100%' }}
                                device={device}
                                isActive={isActive}
                                codeScanner={codeScanner}
                        />
                        <View className="absolute left-0 right-0 top-0 items-end p-3">
                                <TouchableOpacity onPress={onClose} className="rounded-md bg-black/50 px-3 py-2">
                                        <CText className="text-white">Close</CText>
                                </TouchableOpacity>
                        </View>
                        <View className="pointer-events-none absolute left-6 right-6 top-1/2 -mt-16 h-32 border-2 border-primary/80" />
                </View>
        );
};
