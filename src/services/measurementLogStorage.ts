import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './api/client';

const MEASUREMENT_LOG_KEY = '@calog_measurement_logs';

export interface MeasurementLogEntry {
        _id?: string; // For database entries
        userId?: string;
        measurements: {
                weight?: { value: number; unit: string };
                waist?: { value: number; unit: string };
                hip?: { value: number; unit: string };
                neck?: { value: number; unit: string };
                thigh?: { value: number; unit: string };
                bicep?: { value: number; unit: string };
        };
        createdAt?: string;
        updatedAt?: string;
        input?: {
                measurements: {
                        weight?: { value: number; unit: string };
                        waist?: { value: number; unit: string };
                        hip?: { value: number; unit: string };
                        neck?: { value: number; unit: string };
                        thigh?: { value: number; unit: string };
                        bicep?: { value: number; unit: string };
                };
        };
}

export interface MeasurementBatch {
        measurements: {
                weight?: { value: number; unit: 'kg' };
                waist?: { value: number; unit: 'cm' };
                hip?: { value: number; unit: 'cm' };
                neck?: { value: number; unit: 'cm' };
                thigh?: { value: number; unit: 'cm' };
                bicep?: { value: number; unit: 'cm' };
        };
}

async function getAllLogs(): Promise<MeasurementLogEntry[]> {
        try {
                const raw = await AsyncStorage.getItem(MEASUREMENT_LOG_KEY);
                if (!raw) return [];
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? (parsed as MeasurementLogEntry[]) : [];
        } catch {
                return [];
        }
}

async function saveAllLogs(logs: MeasurementLogEntry[]): Promise<void> {
        try {
                await AsyncStorage.setItem(MEASUREMENT_LOG_KEY, JSON.stringify(logs));
        } catch {}
}

export const measurementLogStorage = {
        async appendLogs(measurements: MeasurementBatch['measurements']): Promise<void> {
                // Convert to log entry for local storage
                const logEntry: MeasurementLogEntry = {
                        measurements,
                        createdAt: new Date().toISOString(),
                };

                // Save to local storage
                const logs = await getAllLogs();
                logs.unshift(logEntry);
                await saveAllLogs(logs);

                // Save to database
                try {
                        await apiClient.post('/api/measurement-logs', {
                                measurements,
                        });
                } catch (error) {
                        console.warn('Failed to save measurement logs to database:', error);
                }
        },
        async getLogs(): Promise<MeasurementLogEntry[]> {
                try {
                        const response = (await apiClient.get('/api/measurement-logs')) as any;
                        console.log('getLogs response:', response);

                        // Handle different response formats
                        if (response.success && response.data) {
                                return response.data;
                        } else if (Array.isArray(response)) {
                                return response;
                        } else if (response.data && Array.isArray(response.data)) {
                                return response.data;
                        }

                        return [];
                } catch (error) {
                        console.error('Failed to fetch measurement logs from database:', error);
                        return [];
                }
        },
        async getLatestLogs(): Promise<MeasurementLogEntry[]> {
                try {
                        // Try to fetch latest from database
                        const response = (await apiClient.get('/api/measurement-logs/latest')) as any;
                        if (response.data?.success && response.data?.data) {
                                return response.data.data;
                        }
                } catch (error) {
                        console.warn('Failed to fetch latest measurement logs from database:', error);
                }

                // Fallback to local storage - get latest log
                const logs = await getAllLogs();
                if (logs.length === 0) return [];

                // Return the most recent log
                const sortedLogs = logs.sort((a, b) => {
                        const bt = new Date(b.createdAt || 0).getTime();
                        const at = new Date(a.createdAt || 0).getTime();
                        return bt - at;
                });

                return [sortedLogs[0]];
        },
        async getLogsByGroup(groupId: string): Promise<MeasurementLogEntry[]> {
                try {
                        const response = (await apiClient.get(`/api/measurement-logs/group/${groupId}`)) as any;
                        if (response.data?.success && response.data?.data) {
                                return response.data.data;
                        }
                } catch (error) {
                        console.warn('Failed to fetch measurement logs by group:', error);
                }

                return [];
        },
        async deleteLog(logId: string): Promise<void> {
                try {
                        await apiClient.delete(`/api/measurement-logs/${logId}`);
                } catch (error) {
                        console.error('Failed to delete measurement log:', error);
                        throw error;
                }
        },
        async clear(): Promise<void> {
                try {
                        await AsyncStorage.removeItem(MEASUREMENT_LOG_KEY);
                } catch {}
        },
};
