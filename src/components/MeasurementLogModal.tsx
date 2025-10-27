import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Trash2Icon } from 'lucide-react-native';
import { CText } from './ui/CText';
import { EditModal } from './ui/EditModal';
import { TrendIcon } from './ui/TrendIcon';
import { getMeasurementTrend, getTrendColor } from '../utils/measurementUtils';
import { MeasurementLogEntry } from '../services/measurementLogStorage';
import { COLORS } from '../style/color';

interface MeasurementLogModalProps {
        visible: boolean;
        logs: MeasurementLogEntry[];
        onClose: () => void;
        onDeleteLog: (logIndex: number) => void;
}

export const MeasurementLogModal: React.FC<MeasurementLogModalProps> = ({ visible, logs, onClose, onDeleteLog }) => {
        // Normalize logs so each item has a `measurements` object for trend calc
        const measurementLogs = (logs || []).map((l) => {
                const keys = ['weight', 'waist', 'hip', 'neck', 'thigh', 'bicep'] as const;
                const flat: Record<string, any> = {};
                keys.forEach((k) => {
                        const v = (l as any)[k];
                        if (v && typeof v === 'object' && v.value !== undefined && v.value !== null) {
                                flat[k] = v;
                        }
                });
                const hasMeasurements = (l as any).measurements && Object.keys((l as any).measurements || {}).length;
                return {
                        ...l,
                        measurements: hasMeasurements ? (l as any).measurements : flat,
                } as any;
        });

        const renderLogEntry = (log: MeasurementLogEntry, index: number) => {
                // Last log (oldest) always shows minus - no trend to compare
                // Logs are sorted newest first, so last index is oldest
                const isOldestLog = index === logs.length - 1;

                const measurementKeys = ['weight', 'waist', 'hip', 'neck', 'thigh', 'bicep'] as const;
                const flatMeasurements: Record<string, any> = {};
                measurementKeys.forEach((key) => {
                        const maybe = (log as any)[key];
                        if (maybe && typeof maybe === 'object' && maybe.value !== undefined && maybe.value !== null) {
                                flatMeasurements[key] = maybe;
                        }
                });

                const entryMeasurements =
                        (log as any).measurements && Object.keys((log as any).measurements || {}).length
                                ? (log as any).measurements
                                : flatMeasurements;

                return (
                        <View key={log._id} className="mb-4 rounded-lg bg-white/5 p-3">
                                <View className="mb-3 flex-row items-center justify-between">
                                        <View className="flex-row items-center gap-3">
                                                <CText className="font-semibold">
                                                        {new Date(
                                                                log.createdAt ||
                                                                        log.updatedAt ||
                                                                        new Date().toISOString(),
                                                        ).toLocaleString()}
                                                </CText>
                                                {isOldestLog && (
                                                        <CText className="rounded-full border border-primary bg-transparent px-2 text-sm !text-primary">
                                                                Baseline
                                                        </CText>
                                                )}
                                        </View>
                                        {!isOldestLog && (
                                                <TouchableOpacity
                                                        onPress={() => onDeleteLog(index)}
                                                        className="rounded-full bg-status-error p-2"
                                                >
                                                        <Trash2Icon size={16} color={COLORS.ICON_LIGHT} />
                                                </TouchableOpacity>
                                        )}
                                </View>
                                {Object.entries(entryMeasurements || {}).map(([type, data]: [string, any]) => {
                                        if (!data || data.value === undefined || data.value === null) {
                                                return null;
                                        }

                                        const measurementTrend = isOldestLog
                                                ? null
                                                : getMeasurementTrend(measurementLogs as any[], index, type);
                                        const trendColor = measurementTrend
                                                ? getTrendColor(measurementTrend.direction)
                                                : COLORS.GRAY_500;

                                        return (
                                                <View key={type} className="mb-1 flex-row items-center justify-between">
                                                        <CText className="capitalize">{type}</CText>
                                                        <View className="flex-row items-center">
                                                                <TrendIcon
                                                                        direction={
                                                                                measurementTrend?.direction || 'same'
                                                                        }
                                                                        size={16}
                                                                        color={trendColor}
                                                                />
                                                                <CText>
                                                                        {data.value} {data.unit}
                                                                        {measurementTrend &&
                                                                                measurementTrend.direction !==
                                                                                        'same' && (
                                                                                        <CText
                                                                                                style={{
                                                                                                        color: trendColor,
                                                                                                }}
                                                                                        >
                                                                                                {' '}
                                                                                                (
                                                                                                {measurementTrend.direction ===
                                                                                                'up'
                                                                                                        ? '+'
                                                                                                        : '-'}
                                                                                                {measurementTrend.change.toFixed(
                                                                                                        1,
                                                                                                )}
                                                                                                )
                                                                                        </CText>
                                                                                )}
                                                                </CText>
                                                        </View>
                                                </View>
                                        );
                                })}
                        </View>
                );
        };

        return (
                <EditModal
                        visible={visible}
                        title="Measurement Log"
                        onClose={onClose}
                        onSave={onClose}
                        disableSave={true}
                >
                        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
                                {logs.length === 0 ? (
                                        <CText>You haven't logged any measurements yet</CText>
                                ) : (
                                        logs.map((log, index) => renderLogEntry(log, index))
                                )}
                        </ScrollView>
                </EditModal>
        );
};
