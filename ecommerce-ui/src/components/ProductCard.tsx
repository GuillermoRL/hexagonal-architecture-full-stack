import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/domain/entities/product.entity";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-lg ${
        product.isPalindromeDiscount ? 'ring-4 ring-green-500' : ''
      }`}
    >
      {/* Image Header */}
      <div className="relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-48 w-full rounded-t-lg object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center rounded-t-lg bg-secondary">
            <span className="text-6xl font-bold text-muted-foreground opacity-20">
              P
            </span>
          </div>
        )}
        {product.hasPromotion() && (
          <div className="absolute right-2 top-2">
            <Badge variant="success">
              {product.promotion!.discount}% OFF
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="pt-4">
        <h3 className="text-lg font-bold">{product.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
      </CardContent>

      {/* Footer with Price */}
      <CardFooter className="flex flex-col items-start gap-2">
        {product.hasPromotion() ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                {product.getFormattedPrice()}
              </span>
              <Badge variant="outline" className="text-xs">
                {product.promotion!.code}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {product.getFormattedFinalPrice()}
            </p>
          </>
        ) : (
          <p className="text-2xl font-bold">
            {product.getFormattedPrice()}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};
