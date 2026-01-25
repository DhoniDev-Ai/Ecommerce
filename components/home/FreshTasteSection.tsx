import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function FreshTasteSection() {
    return (
        <section className="py-20 bg-linear-to-r from-rose-100 via-pink-50 to-amber-50 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div>
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Indulge in <span className="italic text-primary">the fresh</span>
                            <br />
                            <span className="italic text-primary">taste</span> of fruits
                        </h2>
                        <p className="text-foreground/70 mb-8 max-w-md">
                            Our drinks are crafted to energize your day and satisfy your
                            cravings.
                        </p>
                        <Link href="/products">
                            <Button className="rounded-full" size="lg">
                                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Stats & Image */}
                    <div className="relative">
                        <div className="flex items-end gap-6">
                            <div className="w-48 lg:w-64">
                                <Image
                                    width={1000}
                                    height={1000}
                                    src="/assets/sea_buckthorn_pulp_500ml.png"
                                    alt="Sea Buckthorn Pulp"
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <p className="font-heading text-5xl font-bold text-foreground">
                                    85%
                                </p>
                                <p className="text-sm text-foreground/60">
                                    Plant-based
                                    <br />
                                    ingredients in recipe
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
