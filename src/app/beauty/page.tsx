import { StoreShell } from "@/components/layout/StoreShell";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getStoreConfig } from "@/config/stores";
import { summariesFor } from "@/data/products";

export default function Page() {
  const config = getStoreConfig("beauty");
  return (
    <StoreShell store="beauty">
      <div className="page py-12">
        <ProductGrid products={summariesFor("beauty")} card={config.productCard} />
      </div>
    </StoreShell>
  );
}
