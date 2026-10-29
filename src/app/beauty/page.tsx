import { StorefrontHome, storefrontMetadata } from "@/components/storefront/StorefrontHome";

export const metadata = storefrontMetadata("beauty");

export default function Page() {
  return <StorefrontHome store="beauty" />;
}
