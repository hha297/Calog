export interface ExerciseActivity {
        id: string;
        name: string;
        caloriesPer30Min: number; // Calories burned per 30 min (70kg person)
        description?: string;
}

export interface ExerciseActivityGroup {
        id: string;
        name: string;
        activities: ExerciseActivity[];
}

export const EXERCISE_ACTIVITY_GROUPS: ExerciseActivityGroup[] = [
        {
                id: 'strength',
                name: 'Strength Training',
                activities: [
                        {
                                id: 'weightlifting',
                                name: 'Weightlifting',
                                caloriesPer30Min: 135,
                                description: 'General lifting, moderate intensity',
                        },
                        {
                                id: 'bodyweight',
                                name: 'Bodyweight exercises',
                                caloriesPer30Min: 200,
                                description: 'Push-ups, pull-ups, squats, etc.',
                        },
                ],
        },
        {
                id: 'high_intensity',
                name: 'High Intensity Training',
                activities: [
                        {
                                id: 'hiit',
                                name: 'HIIT (High Intensity Interval Training)',
                                caloriesPer30Min: 375,
                                description: 'Short bursts of high effort exercise',
                        },
                        {
                                id: 'crossfit',
                                name: 'CrossFit',
                                caloriesPer30Min: 420,
                                description: 'Functional strength & cardio mix',
                        },
                        {
                                id: 'boxing',
                                name: 'Boxing / Kickboxing',
                                caloriesPer30Min: 390,
                                description: 'Combat cardio workout',
                        },
                        {
                                id: 'jumping_rope',
                                name: 'Jumping rope',
                                caloriesPer30Min: 340,
                                description: 'Moderate to fast jumping rope',
                        },
                        {
                                id: 'climbing',
                                name: 'Rock climbing',
                                caloriesPer30Min: 320,
                                description: 'Indoor or outdoor climbing',
                        },
                ],
        },
        {
                id: 'outdoor_sports',
                name: 'Outdoor / Other Sports',
                activities: [
                        {
                                id: 'skateboarding',
                                name: 'Skateboarding',
                                caloriesPer30Min: 180,
                                description: 'Recreational skating',
                        },
                        {
                                id: 'skiing',
                                name: 'Skiing',
                                caloriesPer30Min: 250,
                                description: 'Downhill or cross-country skiing',
                        },
                        {
                                id: 'surfing',
                                name: 'Surfing',
                                caloriesPer30Min: 150,
                                description: 'Paddling and riding waves',
                        },
                        {
                                id: 'badminton',
                                name: 'Badminton',
                                caloriesPer30Min: 165,
                                description: 'Playing singles or doubles',
                        },
                        {
                                id: 'walk_slow',
                                name: 'Slow walking (<3.2 km/h)',
                                caloriesPer30Min: 100,
                                description: 'Leisure pace, slow walk',
                        },
                        {
                                id: 'walk_moderate',
                                name: 'Moderate walking (4.8 km/h)',
                                caloriesPer30Min: 140,
                                description: 'Moderate pace walking',
                        },
                        {
                                id: 'walk_fast',
                                name: 'Fast walking (5.6 km/h)',
                                caloriesPer30Min: 175,
                                description: 'Brisk walking, 10–11 min/km',
                        },
                        {
                                id: 'run_in_place',
                                name: 'Running in place',
                                caloriesPer30Min: 285,
                                description: 'Light jogging or running in place',
                        },
                        {
                                id: 'run_6_4',
                                name: 'Running (6.4 km/h)',
                                caloriesPer30Min: 270,
                                description: 'Slow jogging pace',
                        },
                        {
                                id: 'run_9_6',
                                name: 'Running (9.6 km/h)',
                                caloriesPer30Min: 375,
                                description: 'Moderate run (~6:15 min/km)',
                        },
                        {
                                id: 'run_14_5',
                                name: 'Running (14.5 km/h)',
                                caloriesPer30Min: 525,
                                description: 'Fast run (~4:00 min/km)',
                        },
                        {
                                id: 'run_19_3',
                                name: 'Running (19.3 km/h)',
                                caloriesPer30Min: 735,
                                description: 'Sprint pace (~3:00 min/km)',
                        },
                        {
                                id: 'cycling_leisure',
                                name: 'Cycling, leisure pace (16–19 km/h)',
                                caloriesPer30Min: 140,
                                description: 'Leisure outdoor cycling',
                        },
                        {
                                id: 'cycling_moderate',
                                name: 'Cycling, moderate pace (19–22 km/h)',
                                caloriesPer30Min: 245,
                                description: 'Moderate effort cycling',
                        },
                        {
                                id: 'cycling_vigorous',
                                name: 'Cycling, vigorous pace (22–26 km/h)',
                                caloriesPer30Min: 315,
                                description: 'Vigorous cycling',
                        },
                        {
                                id: 'swimming',
                                name: 'Swimming, moderate pace',
                                caloriesPer30Min: 300,
                                description: 'General moderate swimming',
                        },
                        {
                                id: 'basketball',
                                name: 'Basketball',
                                caloriesPer30Min: 285,
                                description: 'Casual full-court play',
                        },
                        {
                                id: 'tennis',
                                name: 'Tennis',
                                caloriesPer30Min: 260,
                                description: 'Singles or doubles play',
                        },
                        {
                                id: 'football',
                                name: 'Football',
                                caloriesPer30Min: 315,
                                description: 'Recreational or moderate match',
                        },
                        {
                                id: 'hiking',
                                name: 'Hiking',
                                caloriesPer30Min: 215,
                                description: 'Hiking on trails or slopes',
                        },
                ],
        },
        {
                id: 'light_recovery',
                name: 'Light / Recovery',
                activities: [
                        {
                                id: 'stretching',
                                name: 'Stretching',
                                caloriesPer30Min: 90,
                                description: 'General stretching or mobility work',
                        },
                        {
                                id: 'pilates',
                                name: 'Pilates',
                                caloriesPer30Min: 120,
                                description: 'Low-impact core strengthening workout',
                        },
                        {
                                id: 'tai_chi',
                                name: 'Tai Chi',
                                caloriesPer30Min: 135,
                                description: 'Slow, controlled martial art form',
                        },
                        {
                                id: 'yoga',
                                name: 'Yoga',
                                caloriesPer30Min: 120,
                                description: 'Yoga practice (Hatha or gentle flow)',
                        },
                ],
        },
        {
                id: 'daily_activities',
                name: 'Daily Activities',
                activities: [
                        {
                                id: 'cleaning',
                                name: 'House cleaning',
                                caloriesPer30Min: 135,
                                description: 'Vacuuming, sweeping, general tidying',
                        },
                        {
                                id: 'gardening',
                                name: 'Gardening',
                                caloriesPer30Min: 165,
                                description: 'Light yard work or gardening',
                        },
                        {
                                id: 'shopping',
                                name: 'Grocery shopping',
                                caloriesPer30Min: 105,
                                description: 'Walking and carrying light bags',
                        },
                        {
                                id: 'cooking',
                                name: 'Cooking',
                                caloriesPer30Min: 75,
                                description: 'Light kitchen activity',
                        },
                ],
        },
        {
                id: 'entertainment',
                name: 'Active Entertainment',
                activities: [
                        {
                                id: 'zumba',
                                name: 'Zumba',
                                caloriesPer30Min: 210,
                                description: 'Dance fitness workout',
                        },
                        {
                                id: 'karaoke_dance',
                                name: 'Karaoke dancing',
                                caloriesPer30Min: 150,
                                description: 'Energetic singing and dancing',
                        },
                        {
                                id: 'dancing',
                                name: 'General dancing',
                                caloriesPer30Min: 165,
                                description: 'Social or casual dancing',
                        },
                ],
        },
];

export const EXERCISE_ACTIVITIES: ExerciseActivity[] = EXERCISE_ACTIVITY_GROUPS.flatMap((g) => g.activities);
