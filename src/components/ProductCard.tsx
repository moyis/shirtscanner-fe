import { cn } from "~/utils";

const VERCEL_IMAGE_WIDTH = 300;
const VERCEL_IMAGE_QUALITY = 75;

function vercelImageUrl(src: string): string {
  if (typeof window === "undefined") return src;
  const host = window.location.hostname;
  const isVercel = host === "www.shirtscanner.com" || host.endsWith(".vercel.app");
  if (!isVercel) return src;
  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${VERCEL_IMAGE_WIDTH}&q=${VERCEL_IMAGE_QUALITY}`;
}

export interface Product {
  name: string;
  price: string | null;
  productLink: string;
  imageLink: string;
}

interface ProductProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function ProductCard({
  product,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: ProductProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <a href={product.productLink} target="_blank" rel="noreferrer">
        <div className="overflow-hidden rounded-md bg-muted shadow-[0_6px_16px_-8px_oklch(0.23_0.04_263/0.25)]">
          <img
            src={vercelImageUrl(product.imageLink)}
            onError={(event) => {
              if (event.currentTarget.src !== product.imageLink) {
                event.currentTarget.src = product.imageLink;
              }
            }}
            alt={product.name}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
          />
        </div>
        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none text-foreground">{product.name}</h3>
          {product.price ? (<p className="text-xs font-semibold text-foreground">{product.price}</p>) : (<></>)}
        </div>
      </a>
    </div>
  );
}