export type DoshaType = 'Vata' | 'Pitta' | 'Kapha';

export interface QuizOption {
    text: string;
    dosha: DoshaType;
}

export interface QuizQuestion {
    id: number;
    question: string;
    options: QuizOption[];
}

export const DOSHA_QUIZ_DATA: QuizQuestion[] = [
    {
        id: 1,
        question: "How would you describe your natural energy levels?",
        options: [
            { text: "Bursts of energy, but I tire easily", dosha: 'Vata' },
            { text: "Strong, intense, and focused", dosha: 'Pitta' },
            { text: "Steady, enduring, and slow to start", dosha: 'Kapha' }
        ]
    },
    {
        id: 2,
        question: "How does your skin tend to feel?",
        options: [
            { text: "Dry, rough, or cold to the touch", dosha: 'Vata' },
            { text: "Sensitive, warm, or prone to redness", dosha: 'Pitta' },
            { text: "Oily, smooth, and cool", dosha: 'Kapha' }
        ]
    },
    {
        id: 3,
        question: "Which best describes your sleep pattern?",
        options: [
            { text: "Light, interrupted, often have vivid dreams", dosha: 'Vata' },
            { text: "Moderate, but I can wake up alert if needed", dosha: 'Pitta' },
            { text: "Deep, heavy, and I love sleeping in", dosha: 'Kapha' }
        ]
    },
    {
        id: 4,
        question: "How do you react to stress?",
        options: [
            { text: "Anxiety, worry, or fear", dosha: 'Vata' },
            { text: "Irritability, anger, or frustration", dosha: 'Pitta' },
            { text: "Withdrawal, silence, or stubbornness", dosha: 'Kapha' }
        ]
    },
    {
        id: 5,
        question: "What is your typical digestion like?",
        options: [
            { text: "Irregular, gassy, or prone to constipation", dosha: 'Vata' },
            { text: "Strong appetite, quick digestion, prone to heartburn", dosha: 'Pitta' },
            { text: "Slow digestion, heavy feeling after meals", dosha: 'Kapha' }
        ]
    },
    {
        id: 6,
        question: "What kind of weather do you prefer?",
        options: [
            { text: "Warm and humid (I dislike cold/wind)", dosha: 'Vata' },
            { text: "Cool and dry (I dislike heat)", dosha: 'Pitta' },
            { text: "Warm and dry (I dislike cold/damp)", dosha: 'Kapha' }
        ]
    },
    {
        id: 7,
        question: "How would you describe your natural body frame?",
        options: [
            { text: "Slim, thin, or lanky", dosha: 'Vata' },
            { text: "Medium, athletic, or balanced", dosha: 'Pitta' },
            { text: "Sturdy, broad, or heavy", dosha: 'Kapha' }
        ]
    }
];

export const DOSHA_RESULTS = {
    Vata: {
        title: "The Creative Air",
        description: "You are governed by Air and Ether. Creative, energetic, and quick-thinking, but prone to anxiety and dryness when out of balance.",
        recommendation: "Ground yourself with warming, nourishing rituals.",
        color: "from-blue-100 to-purple-100",
        textColor: "text-purple-900",
        buttonColor: "bg-purple-900",
        productSlug: "she-care-juice"
    },
    Pitta: {
        title: "The Fiery Leader",
        description: "You are governed by Fire and Water. Ambitious, focused, and sharp, but prone to irritation and inflammation when overheated.",
        recommendation: "Cool down with calming, soothing rituals.",
        color: "from-orange-100 to-red-100",
        textColor: "text-orange-900",
        buttonColor: "bg-orange-900",
        productSlug: "cholesterol-care-juice"
    },
    Kapha: {
        title: "The Earthy Nurturer",
        description: "You are governed by Earth and Water. Calm, loving, and steady, but prone to lethargy and congestion when stagnant.",
        recommendation: "Energize with stimulating, lightening rituals.",
        color: "from-green-100 to-teal-100",
        textColor: "text-green-900",
        buttonColor: "bg-green-900",
        productSlug: "ayuniv-sea-buckthorn-Juice-300ml"
    }
};
