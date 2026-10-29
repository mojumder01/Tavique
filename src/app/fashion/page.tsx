import { StorefrontHome, storefrontMetadata } from "@/components/storefront/StorefrontHome";

export const metadata = storefrontMetadata("fashion");

export default function Page() {
  return <StorefrontHome store="fashion" />;
}
