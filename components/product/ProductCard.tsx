import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Product } from "@/types";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:shadow-lg">
            <div className="relative aspect-4/5 overflow-hidden bg-zinc-100 sm:aspect-3/4">
                <Link href={`/products/${product.id}`}>
                    <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center text-zinc-400">
                        {/* Placeholder if no image, or actual image */}
                        {product.image_urls && product.image_urls[0] ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={product.image_urls[0]}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        ) : (
                            <span className="text-4xl font-heading text-primary/20">Ayuniv</span>
                        )}
                    </div>
                </Link>
                <div className="absolute bottom-4 right-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Button size="icon" className="rounded-full shadow-md" title="Add to cart">
                        <ShoppingBag className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold font-heading text-foreground">
                        <Link href={`/products/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                        </Link>
                    </h3>
                    <p className="text-lg font-medium text-primary">${product.price}</p>
                </div>
                <p className="mt-1 text-sm text-foreground/60 line-clamp-2 font-body">{product.description}</p>
            </div>
        </div>
    );
}
