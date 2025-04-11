export const reviewItem = {
    title: "Введение к научной работе",
    date: "16 марта 2025",
    wordCount: 1250,
    similarity: 12,
    uniqueness: 88,
    aiContent: 5,
    status: "completed",
    processingTime: "45 секунд",
};

export const reviewTextWithHighlights = [
    {
        id: "p1",
        text: "Концепция искусственного интеллекта значительно эволюционировала за последнее десятилетие. ",
        highlighted: false,
    },
    {
        id: "p2",
        text: "Алгоритмы машинного обучения стали все более сложными, позволяя компьютерам выполнять задачи, которые раньше требовали человеческого интеллекта. ",
        highlighted: true,
        similarity: 85,
        source: "Журнал ИИ, 2023",
    },
    {
        id: "p3",
        text: "Эта трансформация привела к замечательным достижениям в различных областях, включая здравоохранение, финансы и транспорт. ",
        highlighted: false,
    },
    {
        id: "p4",
        text: "Глубокое обучение, подмножество машинного обучения, особенно революционизировало возможности распознавания изображений и речи. ",
        highlighted: true,
        similarity: 72,
        source: "Достижения глубокого обучения, 2024",
    },
    {
        id: "p5",
        text: "Интеграция систем ИИ в повседневные приложения продолжает менять наше взаимодействие с технологиями. ",
        highlighted: false,
    },
    {
        id: "p6",
        text: "Однако эти разработки также поднимают важные этические вопросы, касающиеся конфиденциальности, предвзятости и будущего работы. ",
        highlighted: false,
    },
    {
        id: "p7",
        text: "Исследователи и политики должны сотрудничать, чтобы обеспечить ответственную разработку и внедрение технологий ИИ. ",
        highlighted: true,
        similarity: 68,
        source: "Этика в ИИ, 2023",
    },
];

// Моковые данные для текста с выделенным ИИ-содержанием
export const reviewAiContentHighlights = [
    {
        id: "ai1",
        text: "Более того, развитие нейронных сетей привело к появлению генеративных моделей, способных создавать реалистичный контент. ",
        isAI: true,
        confidence: 92,
    },
    {
        id: "ai2",
        text: "Эти модели находят применение в искусстве, дизайне и даже в научных исследованиях. ",
        isAI: true,
        confidence: 88,
    },
];

export const reviewSources = [
    {
        id: "s1",
        title: "Журнал ИИ: Достижения в машинном обучении",
        url: "https://example.com/ai-journal",
        author: "Смирнов И. и др.",
        year: 2023,
        similarity: 85,
        matchedWords: 42,
    },
    {
        id: "s2",
        title: "Достижения глубокого обучения: Комплексный обзор",
        url: "https://example.com/deep-learning",
        author: "Иванов А. и Петров Б.",
        year: 2024,
        similarity: 72,
        matchedWords: 28,
    },
    {
        id: "s3",
        title: "Этика в ИИ: Вызовы и возможности",
        url: "https://example.com/ethics-ai",
        author: "Сидорова М.",
        year: 2023,
        similarity: 68,
        matchedWords: 24,
    },
    {
        id: "s4",
        title: "Будущее искусственного интеллекта в здравоохранении",
        url: "https://example.com/ai-healthcare",
        author: "Козлов Л. и др.",
        year: 2022,
        similarity: 45,
        matchedWords: 18,
    },
    {
        id: "s5",
        title: "Машинное обучение: Принципы и приложения",
        url: "https://example.com/ml-principles",
        author: "Николаев Р.",
        year: 2021,
        similarity: 32,
        matchedWords: 15,
    },
];
