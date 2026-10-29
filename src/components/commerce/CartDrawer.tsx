"use client";

import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { commerceConfig } from "@/config/commerce.config";
import { useCartTotals } from "@/hooks/useCartTotals";
import { formatMoney, toCents } from "@/lib/money";
import { storeHome } from "@/lib/routes";
import { useUI } from "@/store/ui";
import type { StoreId } from "@/types/catalog";
import { CartItem } from "./CartItem";
import { FreeShippingProgress } from "./FreeShippingProgress";

const threshold = toCents(commerceConfig.shippingMethods.find((m) => "freeOver" in m)?.freeOver ?? 0);

export function CartDrawer({ store }: { store: StoreId }) {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const lastAdded = useUI((s) => s.lastAdded);
  const { totals } = useCartTotals();
  const close = () => setOpen(false);
  const blocking = totals.lines.some((l) => l.issue === "unavailable" || l.issue === "invalid-options");

  return (
    <Modal
      open={open}
      onClose={close}
      placement="right"
      title={`Your bag${totals.itemCount ? ` (${totals.itemCount})` : ""}`}
      footer={
        totals.lines.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between text-[0.9375rem]">
              <span>Subtotal</span>
              <span className="font-medium tabular-nums">{formatMoney(totals.subtotal)}</span>
            </div>
            <p className="text-xs text-fg-muted">Shipping, discounts and estimated tax are calculated at checkout.</p>
            {blocking ? (
              <Button className="w-full" disabled>
                Checkout
              </Button>
            ) : (
              <ButtonLink href="/checkout" onClick={close} className="w-full">
                Checkout
              </ButtonLink>
            )}
            {blocking && <p className="text-xs text-sale">Remove unavailable items to check out.</p>}
            <ButtonLink href="/cart" onClick={close} variant="outline" className="w-full">
              View bag
            </ButtonLink>
          </div>
        ) : undefined
      }
    >
      {totals.lines.length === 0 ? (
        <EmptyState icon={<ShoppingBag />} title="Your bag is empty" body="Pieces you add will appear here.">
          <ButtonLink href={storeHome(store)} onClick={close}>
            Continue shopping
          </ButtonLink>
        </EmptyState>
      ) : (
        <div className="px-5">
          {lastAdded && (
            <p role="status" className="mt-4 flex items-start gap-2 rounded-card bg-muted px-3 py-2.5 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {lastAdded}
            </p>
          )}
          {threshold > 0 && (
            <div className="border-b border-line py-4">
              <FreeShippingProgress remaining={totals.freeShippingRemaining} threshold={threshold} />
            </div>
          )}
          <ul className="divide-y divide-line">
            {totals.lines.map((line) => (
              <CartItem key={line.key} line={line} compact onNavigate={close} />
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
