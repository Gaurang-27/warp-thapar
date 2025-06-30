declare module "@cashfreepayments/cashfree-js" {
  export type Cashfree = {
    checkout: (options: {
      paymentSessionId: string;
      redirectTarget?: "_blank" | "_self" | "_parent" | "_top";
    }) => void;
  };

  export function load(options: { mode: "sandbox" | "production" }): Promise<Cashfree>;
}
