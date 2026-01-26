import Link from "next/link";

const goals = [
    {
        id: "energy",
        title: "Energy",
        description: "Natural vitality for your day",
        color: "from-amber-50 to-orange-50",
        accent: "#D4A574",
    },
    {
        id: "immunity",
        title: "Immunity",
        description: "Support your body's defenses",
        color: "from-emerald-50 to-teal-50",
        accent: "#5A8A7A",
    },
    {
        id: "digestion",
        title: "Digestion",
        description: "Gentle gut wellness",
        color: "from-lime-50 to-green-50",
        accent: "#7A9A6A",
    },
    {
        id: "detox",
        title: "Detox",
        description: "Cleanse and renew naturally",
        color: "from-cyan-50 to-sky-50",
        accent: "#5A8A9A",
    },
];

export function WellnessGoals() {
    return (
        <section id="WellnessGoals" className="py-20 bg-linear-to-b from-[#FDFBF7] to-[#F8F6F2]">
            <div className="mx-auto max-w-7xl px-8 lg:px-12">
                {/* Section Header - Asymmetric */}
                <div className="grid lg:grid-cols-2 gap-8 mb-20">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-[#7A8B7A] mb-4">
                            Wellness Goals
                        </p>
                        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-[#2D3A3A] leading-tight">
                            How do you want
                            <br />
                            <span className="italic text-[#5A7A6A]">to feel today?</span>
                        </h2>
                    </div>
                    <div className="lg:flex lg:items-end lg:justify-end">
                        <p className="text-[#7A8A8A] max-w-sm font-light leading-relaxed">
                            Every body is different. Find the blend that supports your unique
                            wellness journey.
                        </p>
                    </div>
                </div>

                {/* Goals Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {goals.map((goal) => (
                        <Link
                            key={goal.id}
                            href={`/products?goal=${goal.id}`}
                            className="group relative"
                        >
                            <div
                                className={`relative p-8 rounded-4xl bg-linear-to-br ${goal.color} transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 overflow-hidden`}
                            >
                                {/* Decorative circle */}
                                <div
                                    className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-150"
                                    style={{ backgroundColor: goal.accent }}
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                    <h3
                                        className="font-heading text-2xl mb-2"
                                        style={{ color: goal.accent }}
                                    >
                                        {goal.title}
                                    </h3>
                                    <p className="text-sm text-[#6A7A7A] font-light mb-8">
                                        {goal.description}
                                    </p>

                                    {/* Arrow indicator */}
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                                        style={{ backgroundColor: `${goal.accent}15` }}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            style={{ color: goal.accent }}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
