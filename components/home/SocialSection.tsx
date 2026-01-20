import { Instagram } from "lucide-react";

const socialPosts = [
    { image: "/assets/shecare.png", handle: "@healthyliving" },
    { image: "/assets/sea_buckthorn_pulp_300ml.png", handle: "@juicelife" },
    { image: "/assets/duo_shecare.png", handle: "@wellnessjourney" },
    { image: "/assets/shecare_closeup.png", handle: "@naturelove" },
    { image: "/assets/sea_buckthorn_pulp_500ml.png", handle: "@fitfuel" },
];

export function SocialSection() {
    return (
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
                    <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
                        Sippin' on social
                    </h2>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-foreground/60">
                            Raise your glass and celebrate
                            <br />
                            with Social Sips!
                        </p>
                        <a
                            href="https://instagram.com/ayuniv"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                        >
                            <Instagram className="h-5 w-5" />
                            <span className="font-medium">ayuniv</span>
                        </a>
                    </div>
                </div>

                {/* Social Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {socialPosts.map((post, index) => (
                        <a
                            key={index}
                            href="#"
                            className="group relative aspect-square bg-secondary/30 rounded-2xl overflow-hidden"
                        >
                            <img
                                src={post.image}
                                alt={`Social post by ${post.handle}`}
                                className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center pb-4">
                                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {post.handle}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
