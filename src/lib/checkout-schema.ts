import { z } from "zod";
import { commerceConfig } from "@/config/commerce.config";

const countries = commerceConfig.countries as readonly [string, ...string[]];
const paymentIds = commerceConfig.paymentMethods.map((p) => p.id) as [string, ...string[]];

const text = (min: number, message: string, max = 80) => z.string().trim().min(min, message).max(max, `Use ${max} characters or fewer`);

export const addressSchema = z.object({
  firstName: text(1, "Enter your first name", 60),
  lastName: text(1, "Enter your last name", 60),
  address1: text(3, "Enter your street address", 120),
  address2: z.string().trim().max(120).optional(),
  city: text(2, "Enter your town or city"),
  postalCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/, "Enter a valid postal code"),
  country: z.enum(countries, { message: "Choose a country" }),
});

/**
 * Checkout validation. There are deliberately no card fields: in production, card details belong in
 * a PCI-compliant provider's hosted fields (e.g. Stripe Payment Element), never in this form.
 */
export const checkoutSchema = z
  .object({
    email: z.string().trim().min(1, "Enter your email address").pipe(z.email("Enter a valid email address, like name@example.com")),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9 ().-]{7,20}$/, "Enter a valid phone number"),
    shipping: addressSchema,
    billingSame: z.boolean(),
    billing: addressSchema.partial().optional(),
    payment: z.enum(paymentIds, { message: "Choose a payment method" }),
    notes: z.string().trim().max(300, "Use 300 characters or fewer").optional(),
  })
  .superRefine((v, ctx) => {
    if (v.billingSame) return;
    const result = addressSchema.safeParse(v.billing ?? {});
    if (!result.success) {
      for (const issue of result.error.issues) ctx.addIssue({ code: "custom", message: issue.message, path: ["billing", ...issue.path] });
    }
  });

export type CheckoutValues = z.input<typeof checkoutSchema>;

export const demoCheckoutValues: CheckoutValues = {
  email: "alex.morgan@example.com",
  phone: "+1 555 014 2040",
  shipping: { firstName: "Alex", lastName: "Morgan", address1: "48 Mercer Street", address2: "Apt 3", city: "New York", postalCode: "10013", country: "United States" },
  billingSame: true,
  payment: "card",
  notes: "",
};
