import { StoreShell } from "@/components/layout/StoreShell";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getStoreConfig } from "@/config/stores";
import { summariesFor } from "@/data/products";

export default function Page() {
  const config = getStoreConfig("electronics");
  return (
    <StoreShell store="electronics">
      <div className="page py-12">
        <ProductGrid products={summariesFor("electronics")} card={config.productCard} />
      </div>
    </StoreShell>
  );
}
