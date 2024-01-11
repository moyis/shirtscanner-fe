import { Product } from "~/routes/search";
import { cn } from "~/utils";

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
        <div className="overflow-hidden rounded-md">
          <img
            src={product.imageLink}
            alt={product.name}
            width={width}
            height={height}
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
          />
        </div>
        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{product.name}</h3>
          {product.price ? (<p className="text-xs text-muted-foreground">{product.price}</p>) : (<></>)}          
        </div>
      </a>
    </div>
  );
}
