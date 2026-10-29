import { StorefrontHome, storefrontMetadata } from "@/components/storefront/StorefrontHome";

export const metadata = storefrontMetadata("electronics");

export default function Page() {
  return <StorefrontHome store="electronics" />;
}
