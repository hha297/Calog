import { COLORS } from '../style/color';

export interface MeasurementData {
        value: number;
        unit: string;
}

export interface MeasurementLog {
        _id?: string;
        createdAt?: string;
        recordedAt?: string;
        measurements: Record<string, MeasurementData>;
}

export type TrendDirection = 'up' | 'down' | 'same';

export interface TrendResult {
        direction: TrendDirection;
        change: number;
        percentage: number;
}

/**
 * Calculate trend between two measurement values
 */
export const calculateTrend = (current: number, previous: number): TrendResult => {
        if (current === previous) {
                return {
                        direction: 'same',
                        change: 0,
                        percentage: 0,
                };
        }

        const change = current - previous;
        const percentage = previous !== 0 ? (change / previous) * 100 : 0;

        return {
                direction: change > 0 ? 'up' : 'down',
                change: Math.abs(change),
                percentage: Math.abs(percentage),
        };
};

/**
 * Get trend for a specific measurement type across logs
 * Logs are sorted newest first, so we compare current with next (older) log
 */
export const getMeasurementTrend = (
        logs: MeasurementLog[],
        currentIndex: number,
        measurementType: string,
): TrendResult | null => {
        // Can't compare if it's the last log (oldest) or no next log
        if (currentIndex >= logs.length - 1) {
                return null;
        }

        const currentLog = logs[currentIndex]; // Newer log
        const nextLog = logs[currentIndex + 1]; // Older log (to compare with)

        // Handle different measurement structures
        const currentMeasurement = currentLog.measurements[measurementType];
        const nextMeasurement = nextLog.measurements[measurementType];

        // Check if both measurements exist and have values
        if (!currentMeasurement?.value || !nextMeasurement?.value) {
                return null;
        }

        // Compare current (newer) with next (older) log
        return calculateTrend(currentMeasurement.value, nextMeasurement.value);
};

/**
 * Get all measurement types from logs
 */
export const getMeasurementTypes = (logs: MeasurementLog[]): string[] => {
        const types = new Set<string>();

        logs.forEach((log) => {
                Object.keys(log.measurements).forEach((type) => {
                        types.add(type);
                });
        });

        return Array.from(types).sort();
};

/**
 * Format trend change for display
 */
export const formatTrendChange = (trend: TrendResult): string => {
        if (trend.direction === 'same') {
                return 'No change';
        }

        const direction = trend.direction === 'up' ? '+' : '-';
        const change = trend.change.toFixed(1);
        const percentage = trend.percentage.toFixed(1);

        return `${direction}${change} cm (${direction}${percentage}%)`;
};

/**
 * Get trend color based on direction
 * Simple consistent coloring: up = green, down = red, same = gray
 */
export const getTrendColor = (direction: TrendDirection): string => {
        switch (direction) {
                case 'up':
                        return COLORS.SUCCESS; // Green for increase
                case 'down':
                        return COLORS.ERROR; // Red for decrease
                case 'same':
                default:
                        return COLORS.GRAY_500; // Gray for no change
        }
};
