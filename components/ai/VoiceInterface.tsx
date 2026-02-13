"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, X, Activity, Volume2 } from 'lucide-react';

interface VoiceInterfaceProps {
    onClose: () => void;
    onSendMessage: (message: string) => Promise<void>;
    messages: any[];
}

export function VoiceInterface({ onClose, onSendMessage, messages }: VoiceInterfaceProps) {
    const [hasStarted, setHasStarted] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");

    // For Karaoke Text
    const [aiFullText, setAiFullText] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
    const [voicesLoaded, setVoicesLoaded] = useState(false);

    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis | null>(null);
    const silenceTimer = useRef<NodeJS.Timeout | null>(null);
    const isManuallyStopped = useRef(false);

    // Initialize API & Load Voices
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false; // We handle restarting manually for better control
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    setIsListening(true);
                    setStatus("listening");
                    isManuallyStopped.current = false;
                    resetSilenceTimer();
                };

                recognition.onresult = (event: any) => {
                    let interim = '';
                    let final = '';

                    resetSilenceTimer(); // Activity detected

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            final += event.results[i][0].transcript;
                        } else {
                            interim += event.results[i][0].transcript;
                        }
                    }

                    if (final) {
                        setTranscript(final);
                        handleUserSpeech(final);
                    } else {
                        setTranscript(interim);
                    }
                };

                recognition.onend = () => {
                    setIsListening(false);
                    // If unexpected stop (and not handling speech/speaking), restart!
                    if (!isManuallyStopped.current && status === 'listening') {
                        // console.log("Restarting listener...");
                        recognition.start();
                    } else if (status === 'listening') {
                        setStatus("idle");
                    }
                };

                recognition.onerror = (event: any) => {
                    //console.error("Speech Recognition Error", event.error);
                    if (event.error === 'no-speech') {
                        // Ignore, let loop restart if needed
                    }
                };

                recognitionRef.current = recognition;
            }

            synthesisRef.current = window.speechSynthesis;
            const loadVoices = () => {
                const voices = synthesisRef.current?.getVoices() || [];
                if (voices.length > 0) setVoicesLoaded(true);
            };
            loadVoices();
            if (synthesisRef.current && synthesisRef.current.onvoiceschanged !== undefined) {
                synthesisRef.current.onvoiceschanged = loadVoices;
            }
        }
    }, [status]); // Re-bind if status changes to ensure logic holds

    const resetSilenceTimer = () => {
        if (silenceTimer.current) clearTimeout(silenceTimer.current);
        silenceTimer.current = setTimeout(() => {
            // No interaction for 30 seconds? End call.
            speak("Are you still there? I'll hang up now to save battery.");
            setTimeout(onClose, 4000);
        }, 30000);
    };

    const startListening = () => {
        isManuallyStopped.current = false;
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setStatus("listening");
                setTranscript(""); // Clear previous
            } catch (e) { /* ignore */ }
        }
    };

    const stopListening = () => {
        isManuallyStopped.current = true;
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const cleanTextForSpeech = (text: string) => {
        // 1. Remove Markdown Images/Links [![(...)]](...) or [(...)]
        // Regex to capture the "Alt Text" inside [![Alt]...] or [Alt](...)
        let cleaned = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1'); // Extract Alt from Image
        cleaned = cleaned.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');   // Extract Text from Link

        // 2. Cleanup Product Names (Assumes format "Name | Price")
        // "Ayuniv Sea Buckthorn Pulp Juice | ₹799" -> "Ayuniv Sea Buckthorn Pulp Juice"
        // Also remove specific filler words if needed
        cleaned = cleaned.replace(/\|\s*₹\d+/g, ''); // Remove Price

        // 3. Remove Formatting chars (*, #, etc)
        cleaned = cleaned.replace(/[*#_`]/g, '');

        // 4. Truncate very long names if they have " - " or similar (Common in e-comm titles)
        // "Product Name - High Quantity..." -> "Product Name"
        cleaned = cleaned.replace(/ - .*$/, '');

        return cleaned.trim();
    };

    const speak = (text: string) => {
        if (!synthesisRef.current) return;
        synthesisRef.current.cancel();

        const speechText = cleanTextForSpeech(text);

        // Setup Karaoke State
        setAiFullText(speechText);
        setCurrentWordIndex(0);

        const utterance = new SpeechSynthesisUtterance(speechText);

        const voices = synthesisRef.current.getVoices();
        const preferred = voices.find(v =>
            v.name.includes("Google US English") ||
            v.name.includes("Samantha")
        );
        if (preferred) utterance.voice = preferred;

        utterance.rate = 1.1; // Slightly faster

        utterance.onstart = () => {
            setStatus("speaking");
            // Stop listening while speaking
            stopListening();
        };

        // Karaoke Logic (Highlighting)
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                // charIndex is the character position
                setCurrentWordIndex(event.charIndex);
            }
        };

        utterance.onend = () => {
            setStatus("idle");
            setTimeout(startListening, 300);
        };

        synthesisRef.current.speak(utterance);
    };

    const startSession = () => {
        setHasStarted(true);
        // Intro
        speak("Hi, I'm listening.");
        // speak() onend will trigger startListening
    };

    const handleUserSpeech = async (text: string) => {
        if (!text.trim()) return;

        setStatus("processing");
        stopListening(); // Stop mic while processing

        await onSendMessage(text);
    };

    // React to new AI messages
    useEffect(() => {
        if (!hasStarted || messages.length === 0) return;
        const lastMsg = messages[messages.length - 1];

        // Only speak if it's a NEW assistant message and we were waiting (processing)
        if (lastMsg.role === 'assistant' && status === 'processing') {
            speak(lastMsg.content);
        }
    }, [messages, status, hasStarted]);

    // Cleanup
    useEffect(() => {
        return () => {
            recognitionRef.current?.stop();
            synthesisRef.current?.cancel();
            if (silenceTimer.current) clearTimeout(silenceTimer.current);
        };
    }, []);

    if (!hasStarted) {
        return (
            <div className="absolute inset-0 bg-[#0F1111] z-20 flex flex-col items-center justify-center p-8 text-center text-white">
                <div className="w-24 h-24 mb-6 rounded-full bg-[#2D3A3A] flex items-center justify-center animate-pulse">
                    <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-heading mb-2">Voice Mode</h3>
                <p className="text-sm text-[#8A9A9A] mb-8 max-w-[200px]">
                    Tap below to start. <br />
                    <span className="text-xs opacity-50 block mt-2">
                        {voicesLoaded ? "Audio Ready" : "Loading Voices..."}
                    </span>
                </p>
                <button
                    onClick={startSession}
                    disabled={!voicesLoaded}
                    className="w-full max-w-xs px-8 py-3 bg-[#5A7A6A] text-white rounded-full font-bold hover:bg-[#4A6A5A] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                    Start Conversation
                </button>
                <button onClick={onClose} className="text-xs text-[#5A7A6A] uppercase tracking-widest cursor-pointer">
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0F1111] z-20 flex flex-col items-center justify-between p-6 overflow-hidden"
        >
            {/* Top Bar */}
            <div className="w-full flex justify-end items-center pt-2 relative z-10 shrink-0">
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer">
                    <X className="w-5 h-5 text-white/50" />
                </button>
            </div>

            {/* Main Content Area - Scrollable Container */}
            <div className="flex-1 w-full flex flex-col items-center relative overflow-hidden my-4">

                {/* Visualizer (Shrinks when speaking text is long) */}
                <motion.div
                    animate={{
                        scale: status === 'speaking' && aiFullText.length > 50 ? 0.7 : 1,
                        opacity: status === 'speaking' && aiFullText.length > 150 ? 0.5 : 1
                    }}
                    className="relative shrink-0 w-64 h-64 flex items-center justify-center transition-all duration-500"
                >
                    {/* Glow */}
                    <motion.div
                        animate={{
                            opacity: status === 'speaking' ? [0.2, 0.5, 0.2] : 0.1,
                            scale: status === 'speaking' ? [1, 1.2, 1] : 1
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-[#5A7A6A] rounded-full blur-[80px]"
                    />

                    {/* Central Elements */}
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        {/* Circle */}
                        <motion.div
                            animate={{
                                scale: status === 'speaking' ? [1, 1.1, 1] : status === 'listening' ? [1, 1.05, 1] : 1,
                            }}
                            className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-500
                                ${status === 'listening' ? 'bg-white text-black' :
                                    status === 'speaking' ? 'bg-[#5A7A6A] text-white' :
                                        status === 'processing' ? 'bg-white/10 text-white animate-pulse' : 'bg-[#2D3A3A] text-white'}`}
                        >
                            {status === 'listening' && <Mic className="w-8 h-8" />}
                            {status === 'speaking' && <Activity className="w-8 h-8" />}
                            {status === 'processing' && <div className="w-2 h-2 bg-white rounded-full animate-bounce" />}
                            {status === 'idle' && <MicOff className="w-6 h-6 opacity-50" />}
                        </motion.div>

                        {/* Text Status */}
                        <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">
                            {status === 'listening' ? "Listening" :
                                status === 'speaking' ? "Aya Speaking" :
                                    status === 'processing' ? "Thinking" : "Paused"}
                        </p>
                    </div>
                </motion.div>

                {/* DYNAMIC CAPTIONS */}
                <div className="absolute bottom-0 w-full max-h-[50%] flex flex-col justify-end pb-4 px-2">
                    <AnimatePresence mode='wait'>
                        {/* User Transcript */}
                        {transcript && status !== 'speaking' && (
                            <motion.div
                                key="user-caption"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-[#2D3A3A] px-6 py-4 rounded-3xl mx-auto max-w-sm"
                            >
                                <p className="text-lg font-light text-white text-center leading-normal">
                                    "{transcript}"
                                </p>
                            </motion.div>
                        )}

                        {/* AI Transcript - Karaoke Style */}
                        {aiFullText && status === 'speaking' && (
                            <motion.div
                                key="ai-caption"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="w-full max-w-sm mx-auto bg-black/40 backdrop-blur-md px-6 py-6 rounded-4xl border border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar"
                            >
                                <p className="text-xl font-medium text-[#c0d4cc] leading-relaxed text-center">
                                    {/* Render text with current word highlighted slightly if possible, currently simple strict render */}
                                    <span className="text-white drop-shadow-md">{aiFullText.slice(0, currentWordIndex)}</span>
                                    <span className="opacity-50">{aiFullText.slice(currentWordIndex)}</span>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="w-full flex justify-center items-center gap-8 pb-8 z-20 shrink-0">
                {/* Mic Toggle (Manual Override) */}
                <button
                    onClick={() => isListening ? stopListening() : startListening()}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer border ${isListening ? 'bg-white text-black border-transparent' : 'bg-transparent border-white/20 text-white hover:bg-white/10'}`}
                >
                    {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>

                {/* End Call */}
                <button
                    onClick={onClose}
                    className="w-16 h-16 rounded-full bg-[#FF4D4D] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                    <PhoneOff className="w-8 h-8" />
                </button>
            </div>
        </motion.div>
    );
}
