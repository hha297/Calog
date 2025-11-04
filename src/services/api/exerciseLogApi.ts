import apiClient from './client';

export interface ExerciseEntryDTO {
        name: string;
        durationMinutes?: number;
        calories?: number;
        description?: string;
        timestamp?: string; // ISO
}

export async function addExerciseEntry(dateISO: string, entry: ExerciseEntryDTO) {
        return apiClient.post('/api/exercise-logs/add', { date: dateISO, entry });
}

export async function getDailyExercises(dateISO: string) {
        const params = new URLSearchParams({ date: dateISO }).toString();
        return apiClient.get(`/api/exercise-logs?${params}`);
}

export async function deleteExerciseEntry(dateISO: string, index: number) {
        const params = new URLSearchParams({ date: dateISO, index: String(index) }).toString();
        return apiClient.delete(`/api/exercise-logs/remove?${params}`);
}

export async function updateExerciseEntry(
        dateISO: string,
        index: number,
        entry: Partial<ExerciseEntryDTO>,
) {
        return apiClient.put('/api/exercise-logs/update', { date: dateISO, index, entry });
}

