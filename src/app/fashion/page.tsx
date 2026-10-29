import { StoreShell } from "@/components/layout/StoreShell";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getStoreConfig } from "@/config/stores";
import { summariesFor } from "@/data/products";

export default function Page() {
  const config = getStoreConfig("fashion");
  return (
    <StoreShell store="fashion">
      <div className="page py-12">
        <ProductGrid products={summariesFor("fashion")} card={config.productCard} />
      </div>
    </StoreShell>
  );
}
