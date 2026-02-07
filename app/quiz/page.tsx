"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { DOSHA_QUIZ_DATA, QuizQuestion, DoshaType, DOSHA_RESULTS } from '@/lib/data/quiz-data';
import Link from 'next/link';
import Image from 'next/image';
import { useAI } from '@/context/AIContext';

export default function QuizPage() {
    const { openWithContext } = useAI();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scores, setScores] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
    const [showResult, setShowResult] = useState(false);
    const [resultDosha, setResultDosha] = useState<DoshaType | null>(null);

    const currentQuestion: QuizQuestion = DOSHA_QUIZ_DATA[currentIndex];
    const totalQuestions = DOSHA_QUIZ_DATA.length;
    const progress = ((currentIndex) / totalQuestions) * 100;

    const handleAnswer = (dosha: DoshaType) => {
        // 1. Calculate new scores immediately to fix async state bug
        const newScores = {
            ...scores,
            [dosha]: scores[dosha] + 1
        };
        setScores(newScores);

        if (currentIndex < totalQuestions - 1) {
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 300); // Small delay for visual feedback
        } else {
            // 2. Calculate result using NEW scores
            const sorted = Object.entries(newScores).sort(([, a], [, b]) => b - a);
            setResultDosha(sorted[0][0] as DoshaType || 'Vata');
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentIndex(0);
        setScores({ Vata: 0, Pitta: 0, Kapha: 0 });
        setShowResult(false);
        setResultDosha(null);
    };

    const handleAIAnalysis = () => {
        const message = `I just took the Prakriti Quiz and my dominant Dosha is ${resultDosha} (${DOSHA_RESULTS[resultDosha || 'Vata'].title}). \n\nCan you explain what this means for my daily routine, diet, and recommend suitable rituals?`;
        openWithContext(message);
    };

    // Dynamic Background based on progress
    const bgGradient = "bg-[#FDFBF7]";

    return (
        <div className={`min-h-screen ${bgGradient} text-[#2D3A3A] font-sans flex flex-col`}>

            {/* Header */}
            <header className="p-6 flex justify-between items-center max-w-5xl mx-auto w-full">
                <Link href="/" className="opacity-90 hover:opacity-100 transition">
                    <Image src="/assets/logo.png" alt="Ayuniv" width={100} height={100} className="rounded-lg grayscale opacity-80 hover:grayscale-25 hover:opacity-100 transition-all" />
                </Link>
                {!showResult && (
                    <div className="text-xs uppercase tracking-widest font-semibold text-[#8A9A9A]">
                        Question {currentIndex + 1} / {totalQuestions}
                    </div>
                )}
            </header>

            <main className="grow flex items-center justify-center p-6 relative overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#E8F3F1] via-transparent to-transparent" />
                <div className="absolute bottom-0 right-0 w-full h-full opacity-30 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-[#F7E8E8] via-transparent to-transparent" />

                <div className="max-w-2xl w-full mx-auto relative z-10">
                    <AnimatePresence mode='wait'>
                        {!showResult ? (
                            <motion.div
                                key={currentQuestion.id}
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                {/* Question */}
                                <div className="text-center space-y-4">
                                    <motion.h2
                                        className="font-heading text-3xl md:text-5xl leading-tight text-[#2D3A3A]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {currentQuestion.question}
                                    </motion.h2>
                                    <div className="w-16 h-1 bg-[#5A7A6A]/20 mx-auto rounded-full" />
                                </div>

                                {/* Options */}
                                <div className="grid gap-4 pt-4">
                                    {currentQuestion.options.map((option, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => handleAnswer(option.dosha)}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group cursor-pointer relative overflow-hidden p-6 text-left border border-[#E8E6E2] rounded-2xl bg-white hover:border-[#5A7A6A] hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="relative z-10 flex items-center justify-between">
                                                <span className="text-lg font-medium text-[#4A5A5A] group-hover:text-[#2D3A3A] transition-colors">
                                                    {option.text}
                                                </span>
                                                <ChevronRight className="w-5 h-5 text-[#9AA09A] group-hover:text-[#5A7A6A] transform group-hover:translate-x-1 transition-all" />
                                            </div>
                                            {/* Fill Effect */}
                                            <div className="absolute inset-0 bg-[#5A7A6A]/5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-[#E8E6E2] h-1 rounded-full mt-10 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-[#5A7A6A]"
                                        initial={{ width: `${((currentIndex) / totalQuestions) * 100}%` }}
                                        animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            // RESULT VIEW
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="text-center space-y-8"
                            >

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#8A9A9A]">Your Prakriti Is</h3>
                                    {/* SIMPLIFIED H1: Solid Color based on Dosha */}
                                    <h1 className={`font-heading text-6xl md:text-8xl ${DOSHA_RESULTS[resultDosha || 'Vata'].textColor}`}>
                                        {resultDosha}
                                    </h1>
                                    <p className="font-serif italic text-2xl text-[#5A6A6A]">
                                        "{DOSHA_RESULTS[resultDosha || 'Vata'].title}"
                                    </p>
                                </div>

                                <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-[#E8E6E2] shadow-sm">
                                    <p className="text-[#4A5A5A] leading-relaxed">
                                        {DOSHA_RESULTS[resultDosha || 'Vata'].description}
                                    </p>



                                    <div className="mt-6 pt-6 border-t border-[#F3F1ED] flex flex-col gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-[#5A7A6A] mb-4 uppercase tracking-wider">Recommended Ritual</p>
                                            <p className="italic text-[#2D3A3A] mb-6">
                                                {DOSHA_RESULTS[resultDosha || 'Vata'].recommendation}
                                            </p>

                                            <Link
                                                href={`/products/${DOSHA_RESULTS[resultDosha || 'Vata'].productSlug || 'ayuniv-sea-buckthorn-Juice-300ml'}`}
                                                className="block w-full py-4 bg-[#2D3A3A] text-white rounded-full font-bold hover:bg-[#5A7A6A] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 relative group overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    Shop {resultDosha} Rituals <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </Link>
                                        </div>

                                        <button
                                            onClick={handleAIAnalysis}
                                            className="w-full cursor-pointer py-3 border border-[#E8E6E2] rounded-full text-[#5A7A6A] font-bold text-sm tracking-wide uppercase hover:bg-[#FDFBF7] hover:border-[#5A7A6A] transition-all flex items-center justify-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4" /> Ask Aya for Personalized Advice
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={resetQuiz}
                                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#8A9A9A] hover:text-[#5A7A6A] transition-colors mt-8"
                                >
                                    <RefreshCw className="w-4 h-4" /> Retake Analysis
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
