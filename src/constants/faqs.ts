export interface FAQ {
        id: string;
        question: string;
        answer: string;
        link?: string;
}

export const FAQS: FAQ[] = [
        {
                id: '1',
                question: 'How many calories should I eat to lose weight?',
                answer: 'Most people lose weight by eating about 10–20% fewer calories than their maintenance level. A simple way to start is multiplying your body weight (in lbs) by 12 to estimate a calorie target.',
                link: 'https://www.cdc.gov/healthyweight/losing_weight/index.html',
        },
        {
                id: '2',
                question: 'How much protein do I need daily?',
                answer: 'Aim for 1.6–2.2 grams of protein per kilogram of body weight daily to support muscle maintenance and recovery.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/28698222/',
        },
        {
                id: '3',
                question: 'Do carbs make you gain fat?',
                answer: 'No, carbs themselves don’t cause fat gain. Eating more calories than your body burns — from any source — leads to weight gain.',
                link: 'https://www.ncbi.nlm.nih.gov/books/NBK278998/',
        },
        {
                id: '4',
                question: 'Should I avoid eating after 8 p.m.?',
                answer: 'Meal timing matters less than total calorie intake. You can eat later if it fits your schedule and calorie goal.',
                link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5373499/',
        },
        {
                id: '5',
                question: 'Is breakfast the most important meal of the day?',
                answer: 'Breakfast isn’t essential for everyone. Some people perform and feel better eating later; what matters is total daily nutrition.',
                link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6566799/',
        },
        {
                id: '6',
                question: 'Can I eat fast food and still lose weight?',
                answer: 'Yes, if it fits your calorie goal. Focus on portion control and balance it with nutritious meals most of the time.',
        },
        {
                id: '7',
                question: 'How often should I work out for fat loss?',
                answer: 'Aim for at least 3–5 workouts per week combining strength and cardio. Consistency is key.',
                link: 'https://www.cdc.gov/physicalactivity/basics/adults/index.htm',
        },
        {
                id: '8',
                question: 'What type of exercise burns the most fat?',
                answer: 'The best exercise is one you can sustain long term. Both strength training and cardio help — together they’re most effective.',
        },
        {
                id: '9',
                question: 'How much water should I drink daily?',
                answer: 'About 2–2.5 liters (8–10 cups) per day works for most adults. Drink more if you’re active or in hot climates.',
                link: 'https://www.hsph.harvard.edu/nutritionsource/water/',
        },
        {
                id: '10',
                question: 'Is it bad to skip meals?',
                answer: 'Skipping meals isn’t harmful if total nutrition and energy are met. Just ensure you don’t end up overeating later.',
        },
        {
                id: '11',
                question: 'What is a calorie deficit?',
                answer: 'A calorie deficit happens when you consume fewer calories than your body burns, causing weight loss.',
        },
        {
                id: '12',
                question: 'Do I have to count calories to lose weight?',
                answer: 'Not necessarily. Tracking helps at first, but mindful eating and portion awareness can work once you learn your habits.',
        },
        {
                id: '13',
                question: 'Can I build muscle while losing fat?',
                answer: 'Yes, especially for beginners or people returning to training. It requires adequate protein, strength training, and a small calorie deficit.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/20847704/',
        },
        {
                id: '14',
                question: 'How much sleep do I need for recovery?',
                answer: 'Aim for 7–9 hours of quality sleep. Poor sleep can reduce performance, recovery, and fat-loss progress.',
                link: 'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need',
        },
        {
                id: '15',
                question: 'Do fat burners work?',
                answer: 'Most fat burners have minimal effect. Real fat loss comes from consistent calorie control and exercise.',
                link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7082907/',
        },
        {
                id: '16',
                question: 'How much cardio should I do per week?',
                answer: '150 minutes of moderate or 75 minutes of vigorous cardio weekly is recommended for health and fat loss.',
                link: 'https://www.cdc.gov/physicalactivity/basics/adults/index.htm',
        },
        {
                id: '17',
                question: 'Is lifting weights necessary for fat loss?',
                answer: 'It’s highly recommended. Strength training preserves muscle mass and boosts metabolism while you lose fat.',
        },
        {
                id: '18',
                question: 'What happens if I eat too few calories?',
                answer: 'Eating too little can slow metabolism, reduce energy, and cause muscle loss. Avoid extreme restriction.',
                link: 'https://www.ncbi.nlm.nih.gov/books/NBK278990/',
        },
        {
                id: '19',
                question: 'How can I stay full while dieting?',
                answer: 'Eat high-protein, high-fiber foods and include plenty of water. These help control hunger and maintain energy.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/18469287/',
        },
        {
                id: '20',
                question: 'Does drinking water boost metabolism?',
                answer: 'Drinking cold water slightly increases calorie burn, but the effect is small — it’s hydration that truly matters.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/14671205/',
        },
        {
                id: '21',
                question: 'Should I eat before or after a workout?',
                answer: 'Either works — eat before if you need energy, after if recovery is the focus. Just make sure you get protein and carbs around training.',
        },
        {
                id: '22',
                question: 'How long does it take to see results?',
                answer: 'You can usually notice small changes in 3–4 weeks, and visible transformation in 8–12 weeks with consistency.',
        },
        {
                id: '23',
                question: 'Are cheat meals bad?',
                answer: 'Cheat meals aren’t bad if occasional. Use them to enjoy food and refuel mentally, but avoid turning them into cheat days.',
        },
        {
                id: '24',
                question: 'Do I need supplements to lose fat?',
                answer: 'No supplement replaces good nutrition and exercise. Basics like protein powder, creatine, or vitamins can help convenience, not replace food.',
                link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6279856/',
        },
        {
                id: '25',
                question: 'What’s the best macro split for fat loss?',
                answer: 'A balanced start is 40% carbs, 30% protein, 30% fats — then adjust to preference and energy levels.',
        },
        {
                id: '26',
                question: 'Do I need to do cardio every day?',
                answer: 'No, cardio isn’t required daily. 3–5 sessions per week is plenty for most people, depending on goals and recovery.',
                link: 'https://www.cdc.gov/physicalactivity/basics/adults/index.htm',
        },
        {
                id: '27',
                question: 'What’s better for fat loss: HIIT or steady-state cardio?',
                answer: 'Both work. HIIT burns more in less time and improves conditioning; steady-state is easier to recover from. Mix both for balance.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/29734040/',
        },
        {
                id: '28',
                question: 'Can I train abs every day?',
                answer: 'You can do light core work daily, but intense ab workouts need rest like any other muscle group — 3–4 times per week is ideal.',
        },
        {
                id: '29',
                question: 'Is spot reduction (losing fat in one area) possible?',
                answer: 'No, you can’t target fat loss from specific areas. Fat loss happens overall through consistent calorie deficit.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/9187207/',
        },
        {
                id: '30',
                question: 'Why am I not losing weight even in a deficit?',
                answer: 'It might be due to inaccurate tracking, water retention, hormonal changes, or too low activity levels. Track consistently and be patient.',
        },
        {
                id: '31',
                question: 'Do women need to train differently than men?',
                answer: 'Not really. Both benefit from resistance training and balanced nutrition. Volume or recovery may vary individually.',
        },
        {
                id: '32',
                question: 'How much rest do I need between sets?',
                answer: 'For strength, rest 2–3 minutes. For muscle growth, 60–90 seconds. For endurance, 30–60 seconds works well.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/26605807/',
        },
        {
                id: '33',
                question: 'Should I lift heavy or light for fat loss?',
                answer: 'Both work if effort is high. Heavy weights preserve muscle and strength; lighter weights with higher reps burn more during training.',
        },
        {
                id: '34',
                question: 'How do I stay motivated long term?',
                answer: 'Focus on habits, not perfection. Track progress, celebrate small wins, and make your routine enjoyable.',
        },
        {
                id: '35',
                question: 'Do I need to stretch before workouts?',
                answer: 'Do dynamic stretches or light movements before training. Save static stretching for after workouts.',
                link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3273886/',
        },
        {
                id: '36',
                question: 'Is sore muscles a sign of a good workout?',
                answer: 'Not always. Soreness shows muscle stress, not necessarily progress. Focus on consistency and progressive overload.',
        },
        {
                id: '37',
                question: 'Can I drink alcohol while trying to lose fat?',
                answer: 'Yes, in moderation. Alcohol has calories and may affect recovery, so fit it into your calorie goals wisely.',
                link: 'https://www.cdc.gov/alcohol/fact-sheets/moderate-drinking.htm',
        },
        {
                id: '38',
                question: 'How can I track my progress besides the scale?',
                answer: 'Use progress photos, body measurements, clothes fit, and strength performance to gauge progress better than weight alone.',
        },
        {
                id: '39',
                question: 'What’s the best time to work out?',
                answer: 'The best time is when you can be consistent. Morning or evening doesn’t matter much as long as you show up regularly.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/23002093/',
        },
        {
                id: '40',
                question: 'Do I need to take pre-workout supplements?',
                answer: 'Not required. A small meal or coffee can work just as well. Pre-workouts may boost energy, but check caffeine tolerance.',
        },
        {
                id: '41',
                question: 'How important is protein timing?',
                answer: 'Hitting daily protein intake is more important than exact timing. Still, having protein around workouts supports recovery.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/24299050/',
        },
        {
                id: '42',
                question: 'What are good sources of plant-based protein?',
                answer: 'Lentils, tofu, tempeh, beans, chickpeas, and quinoa are great plant-based protein options.',
        },
        {
                id: '43',
                question: 'Is creatine safe to use?',
                answer: 'Yes, creatine monohydrate is one of the most studied and safe supplements for strength and performance.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/28615996/',
        },
        {
                id: '44',
                question: 'Do I need to cut out sugar completely?',
                answer: 'No, moderation is fine. Prioritize whole foods and keep added sugar under 10% of total calories.',
                link: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
        },
        {
                id: '45',
                question: 'What’s the best diet for fat loss?',
                answer: 'The best diet is the one you can stick to. Any plan creating a calorie deficit and providing nutrients can work.',
        },
        {
                id: '46',
                question: 'How can I reduce bloating?',
                answer: 'Drink more water, reduce sodium, eat slowly, and avoid overeating processed foods or carbonated drinks.',
        },
        {
                id: '47',
                question: 'Is it bad to train when sore?',
                answer: 'Light movement helps recovery, but avoid intense training for the same muscles until soreness eases.',
        },
        {
                id: '48',
                question: 'How can I improve recovery after workouts?',
                answer: 'Sleep well, eat enough protein and carbs, hydrate, and include rest or active recovery days.',
        },
        {
                id: '49',
                question: 'Does sweating mean I’m burning more fat?',
                answer: 'No, sweat only shows heat and water loss, not fat loss. Fat loss depends on calorie balance.',
        },
        {
                id: '50',
                question: 'Can I train twice a day?',
                answer: 'Yes, if recovery and nutrition are adequate. Most people benefit more from one solid session daily though.',
        },
        {
                id: '51',
                question: 'Can I eat late at night and still lose fat?',
                answer: 'Yes, meal timing doesn’t cause fat gain. What matters most is your total calorie intake.',
                link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5373499/',
        },
        {
                id: '52',
                question: 'Is intermittent fasting effective for weight loss?',
                answer: 'Yes, it can help reduce calorie intake, but it’s no more effective than other diets with the same calories.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/32763262/',
        },
        {
                id: '53',
                question: 'How can I reduce hunger during a diet?',
                answer: 'Eat more protein, drink water, include fiber-rich foods, and avoid long gaps between meals.',
        },
        {
                id: '54',
                question: 'Do I need to do warm-ups before lifting?',
                answer: 'Yes, spend 5–10 minutes warming up with light cardio or dynamic stretches to prevent injury.',
        },
        {
                id: '55',
                question: 'What are healthy fat sources?',
                answer: 'Olive oil, avocados, nuts, seeds, and fatty fish are great sources of healthy fats.',
        },
        {
                id: '56',
                question: 'How many steps should I aim for daily?',
                answer: '10,000 steps is a great target for most people, but anything above 7,000 daily supports health and fat loss.',
                link: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2770891',
        },
        {
                id: '57',
                question: 'Should I take rest days?',
                answer: 'Yes, rest days help your body recover, rebuild muscle, and prevent burnout.',
        },
        {
                id: '58',
                question: 'What is progressive overload?',
                answer: 'It’s the gradual increase of stress on your muscles — by adding weight, reps, or sets — to stimulate growth.',
        },
        {
                id: '59',
                question: 'Can stress affect weight loss?',
                answer: 'Yes, high stress raises cortisol which can increase appetite and water retention.',
                link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5579396/',
        },
        {
                id: '60',
                question: 'Is BMI an accurate measure of fitness?',
                answer: 'BMI is a general guideline, not a perfect indicator. It doesn’t account for muscle mass or body composition.',
        },
        {
                id: '61',
                question: 'What’s a diet break?',
                answer: 'A short period of eating at maintenance calories to reduce fatigue and support hormones during long diets.',
        },
        {
                id: '62',
                question: 'Do artificial sweeteners cause weight gain?',
                answer: 'Current research shows they’re safe in moderation and don’t cause fat gain directly.',
                link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7822659/',
        },
        {
                id: '63',
                question: 'Can I drink coffee before workouts?',
                answer: 'Yes, caffeine boosts performance and alertness. Just don’t overdo it close to bedtime.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/29118947/',
        },
        {
                id: '64',
                question: 'What’s the best time to eat protein?',
                answer: 'Distribute protein evenly throughout the day — 20–40 g every 3–4 hours works well.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/24299050/',
        },
        {
                id: '65',
                question: 'Do I lose muscle if I stop training?',
                answer: 'Yes, some loss occurs after a few weeks of inactivity, but muscle memory helps you regain it faster later.',
        },
        {
                id: '66',
                question: 'Can I build muscle without a gym?',
                answer: 'Yes, bodyweight training, resistance bands, and progressive overload can build muscle effectively at home.',
        },
        {
                id: '67',
                question: 'Are carbs necessary for muscle growth?',
                answer: 'Yes, carbs fuel workouts and help recovery. Low-carb diets can limit performance if too restrictive.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/28697803/',
        },
        {
                id: '68',
                question: 'What’s the difference between strength and hypertrophy training?',
                answer: 'Strength focuses on heavier weights and lower reps; hypertrophy uses moderate weights and higher volume to grow muscle.',
        },
        {
                id: '69',
                question: 'Does training on an empty stomach burn more fat?',
                answer: 'It may increase fat use during that session, but total daily calories still decide fat loss.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/25429252/',
        },
        {
                id: '70',
                question: 'Is stretching after workouts important?',
                answer: 'Yes, post-workout stretching improves flexibility and may reduce muscle tension.',
        },
        {
                id: '71',
                question: 'Do genetics affect fat distribution?',
                answer: 'Yes, genetics play a big role in where your body stores or loses fat first.',
        },
        {
                id: '72',
                question: 'Can lack of sleep stop fat loss?',
                answer: 'Yes, poor sleep increases hunger hormones and decreases metabolism efficiency.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/21543552/',
        },
        {
                id: '73',
                question: 'Is walking enough to lose weight?',
                answer: 'Yes, if paired with proper diet. Walking burns calories and improves health with minimal joint stress.',
        },
        {
                id: '74',
                question: 'What’s the difference between weight loss and fat loss?',
                answer: 'Weight loss includes water and muscle; fat loss focuses on reducing body fat while keeping muscle mass.',
        },
        {
                id: '75',
                question: 'Should I eat before morning cardio?',
                answer: 'If you feel better fasted, go for it. If you lack energy, a small snack helps. Both can work for fat loss.',
        },
        {
                id: '76',
                question: 'Can dehydration affect workout performance?',
                answer: 'Yes, even mild dehydration can reduce strength, endurance, and focus.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/17921463/',
        },
        {
                id: '77',
                question: 'Is yoga good for fitness?',
                answer: 'Yes, yoga improves flexibility, recovery, and reduces stress, complementing strength and cardio training.',
        },
        {
                id: '78',
                question: 'Do I need to eat clean 100% of the time?',
                answer: 'No, aim for 80–90% nutritious foods and 10–20% flexible choices for balance and sustainability.',
        },
        {
                id: '79',
                question: 'Does metabolism slow with age?',
                answer: 'Yes, slightly, mostly due to muscle loss and less activity — staying active and lifting weights helps maintain it.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/32832443/',
        },
        {
                id: '80',
                question: 'How can I boost my metabolism naturally?',
                answer: 'Build muscle, move more daily, stay hydrated, and get enough sleep — these keep metabolism healthy.',
        },
        {
                id: '81',
                question: 'Can I lose fat without exercise?',
                answer: 'Yes, through calorie control, but exercise improves health, body composition, and sustainability.',
        },
        {
                id: '82',
                question: 'Are cheat days useful?',
                answer: 'They can help mentally, but frequent overeating can offset your progress. Use moderation.',
        },
        {
                id: '83',
                question: 'Do I need to eat immediately after workouts?',
                answer: 'Not immediately — eating within 1–2 hours is fine for most people.',
        },
        {
                id: '84',
                question: 'What are micronutrients?',
                answer: 'Vitamins and minerals your body needs in small amounts to support energy, metabolism, and health.',
        },
        {
                id: '85',
                question: 'Is it okay to work out when sick?',
                answer: 'If symptoms are mild and above the neck (like a cold), light exercise is fine. Rest if feverish or fatigued.',
        },
        {
                id: '86',
                question: 'Can I build muscle in a calorie deficit?',
                answer: 'Yes, possible for beginners or overweight individuals, but it’s easier in maintenance or surplus.',
        },
        {
                id: '87',
                question: 'Is fruit bad because it has sugar?',
                answer: 'No, fruit sugar is natural and comes with fiber and nutrients. Limit juice, but whole fruit is great.',
                link: 'https://www.hsph.harvard.edu/nutritionsource/fruits/',
        },
        {
                id: '88',
                question: 'Do I need to detox after overeating?',
                answer: 'No detox needed. Just return to normal eating and hydration — your body naturally regulates itself.',
        },
        {
                id: '89',
                question: 'Can I lose fat without giving up carbs?',
                answer: 'Yes. Carb quality and total calories matter more than avoiding them entirely.',
        },
        {
                id: '90',
                question: 'Should I train while in a calorie deficit?',
                answer: 'Yes, but manage intensity. Focus on maintaining strength and form while eating enough protein.',
        },
        {
                id: '91',
                question: 'Are “toning workouts” real?',
                answer: 'Not exactly. “Toning” means building some muscle and losing fat — best done with strength training and a good diet.',
        },
        {
                id: '92',
                question: 'Does lifting weights make women bulky?',
                answer: 'No, women have lower testosterone levels. Lifting builds lean, defined muscle, not bulk.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/11023016/',
        },
        {
                id: '93',
                question: 'Can I eat the same food every day?',
                answer: 'Yes, if it meets your nutrient needs. Just include variety over time to avoid deficiencies.',
        },
        {
                id: '94',
                question: 'Is it better to work out in the morning or night?',
                answer: 'Both are fine. Morning helps consistency; evening may allow better performance — choose what fits your life.',
        },
        {
                id: '95',
                question: 'Does lifting weights help posture?',
                answer: 'Yes, strengthening your back, core, and shoulders improves posture and reduces pain.',
        },
        {
                id: '96',
                question: 'How much rest should I get between workouts?',
                answer: 'Rest each muscle group 48 hours before training it again for best recovery and growth.',
        },
        {
                id: '97',
                question: 'Do I need a personal trainer to start?',
                answer: 'Not required, but a coach helps with form, structure, and accountability — great if you’re new.',
        },
        {
                id: '98',
                question: 'Why did my weight go up after starting workouts?',
                answer: 'Likely from water retention and glycogen storage — it’s normal and temporary.',
        },
        {
                id: '99',
                question: 'Can stretching prevent injury?',
                answer: 'Dynamic stretching before and mobility work after training support flexibility and reduce injury risk.',
                link: 'https://pubmed.ncbi.nlm.nih.gov/18296968/',
        },
        {
                id: '100',
                question: 'How do I stay consistent with fitness?',
                answer: 'Set realistic goals, track small wins, plan workouts ahead, and focus on progress, not perfection.',
        },
];
