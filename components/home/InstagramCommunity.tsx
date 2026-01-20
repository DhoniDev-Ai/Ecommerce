import { Instagram } from "lucide-react";
import { cn } from "@/utils/cn";

const feedImages = [
    { id: 1, url: "/assets/sea_buckthorn_pulp_300ml.png", size: "tall" },
    { id: 2, url: "/assets/duo_shecare.png", size: "square" },
    { id: 3, url: "/assets/sea_buckthorn_pulp_500ml.png", size: "square" },
    { id: 4, url: "/assets/duo_shecare_2.png", size: "tall" },
];

export function InstagramCommunity() {
    return (
        <section className="py-10 bg-[#FDFBF7]">
            <div className="mx-auto max-w-7xl px-8 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-md">
                        <h2 className="font-heading text-4xl text-[#2D3A3A] mb-4">
                            Inside the <span className="italic text-[#5A7A6A]">Circle</span>
                        </h2>
                        <p className="text-[#7A8A8A] font-light">
                            Join 10k+ people sharing their morning ritual with #AyunivWellness.
                        </p>
                    </div>
                    <a
                        href="https://www.instagram.com/ayuniv_official/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-[#5A7A6A] hover:underline"
                    >
                        <Instagram className="w-4 h-4" /> @ayuniv_official
                    </a>
                </div>

                {/* Staggered Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {feedImages.map((img) => (
                        <div
                            key={img.id}
                            className={cn(
                                "relative overflow-hidden rounded-3xl group cursor-pointer bg-[#F3F1ED]",
                                img.size === "tall" ? "aspect-[3/4]" : "aspect-square"
                            )}
                        >
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                                <Instagram className="text-white w-8 h-8 opacity-70" />
                            </div>
                            <img
                                src={img.url}
                                alt="Community post"
                                className="object-contain w-full h-full p-6 transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
