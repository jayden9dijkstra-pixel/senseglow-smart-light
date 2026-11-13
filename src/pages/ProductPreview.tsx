import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { SpecTiles } from "@/components/product/Blueprint";
import { getPreviewProduct } from "@/data/previewProducts";
import NotFound from "./NotFound";

/** Verborgen voorbeeldpagina voor een leveranciersquote. Niet te koop, noindex. */
const ProductPreview = () => {
  const { slug } = useParams();
  const product = getPreviewProduct(slug);
  const [active, setActive] = useState(0);
  if (!product) return <NotFound />;
  const image = product.images[active];

  return (
    <PageLayout seo={{ title: `${product.title} | SenseGlow`, description: product.intro, noindex: true, dutchOnly: true }}>
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <p className="mb-6 rounded-2xl bg-secondary/60 p-4 text-sm text-foreground">
          <strong>Supplier preview / voorbeeldpagina.</strong> {product.quoteNote}
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <img src={image.src} alt={image.alt} className="w-full rounded-2xl bg-secondary/40 object-contain" />
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={img.alt}
                  className={`overflow-hidden rounded-xl border-2 ${i === active ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img.src} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground">{product.title}</h1>
              <p className="text-sm text-muted-foreground">{product.titleEn}</p>
              <p className="text-base text-foreground/90">{product.intro}</p>
              <p className="text-base text-foreground">
                <span className="font-medium">Variant:</span> {product.variant}
              </p>
            </div>
            <SpecTiles rows={product.specs} />
            <SpecTiles rows={product.specsEn} id="specifications" title="Specifications (EN)" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductPreview;
