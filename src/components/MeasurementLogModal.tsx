import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Trash2Icon } from 'lucide-react-native';
import { CText } from './ui/CText';
import { EditModal } from './ui/EditModal';
import { TrendIcon } from './ui/TrendIcon';
import { getMeasurementTrend, getTrendColor } from '../utils/measurementUtils';
import { MeasurementLogEntry } from '../services/measurementLogStorage';

interface MeasurementLogModalProps {
        visible: boolean;
        logs: MeasurementLogEntry[];
        onClose: () => void;
        onDeleteLog: (logId: string) => void;
}

export const MeasurementLogModal: React.FC<MeasurementLogModalProps> = ({ visible, logs, onClose, onDeleteLog }) => {
        const renderLogEntry = (log: MeasurementLogEntry, index: number) => {
                // Last log (oldest) always shows minus - no trend to compare
                // Logs are sorted newest first, so last index is oldest
                const isOldestLog = index === logs.length - 1;

                return (
                        <View key={log._id} className="mb-4 rounded-lg bg-white/5 p-3">
                                <View className="mb-3 flex-row items-center justify-between">
                                        <CText className="font-semibold">
                                                {new Date(
                                                        log.createdAt || log.updatedAt || new Date().toISOString(),
                                                ).toLocaleString()}
                                        </CText>
                                        <TouchableOpacity
                                                onPress={() => onDeleteLog(log._id!)}
                                                className="rounded-full bg-status-error p-2"
                                        >
                                                <Trash2Icon size={16} color="#FFFFFF" />
                                        </TouchableOpacity>
                                </View>
                                {Object.entries(log.measurements || {}).map(([type, data]: [string, any]) => {
                                        if (!data || data.value === undefined || data.value === null) {
                                                return null;
                                        }

                                        const measurementTrend = isOldestLog
                                                ? null
                                                : getMeasurementTrend(logs as any[], index, type);
                                        const trendColor = measurementTrend
                                                ? getTrendColor(measurementTrend.direction)
                                                : '#666666';

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
                                        <CText>No logs yet</CText>
                                ) : (
                                        logs.map((log, index) => renderLogEntry(log, index))
                                )}
                        </ScrollView>
                </EditModal>
        );
};
