import type { Item } from "./catalogue";
export type Line = Item & {
  id: string;
  quantity: number;
  clientDirect: boolean;
};
export type Draft = {
  id: string;
  number: string;
  client: string;
  email: string;
  address: string;
  issued: string;
  due: string;
  period: string;
  next: string;
  lines: Line[];
  discount: number;
  tax: number;
  paid: number;
  request: string;
  paymentDate: string;
  instructions: string;
  notes: string;
};

export function calculate(draft: Draft) {
  const lineTotal = (line: Line) => (line.price ?? 0) * line.quantity;
  const oneTime = draft.lines
    .filter((x) => x.frequency === "one-time" && !x.clientDirect)
    .reduce((s, x) => s + lineTotal(x), 0);
  const monthly = draft.lines
    .filter((x) => x.frequency === "monthly" && !x.clientDirect)
    .reduce((s, x) => s + lineTotal(x), 0);
  const discount = Math.min(draft.discount, oneTime + monthly);
  const tax = Math.round((oneTime + monthly - discount) * draft.tax) / 100;
  const total = Math.round((oneTime + monthly - discount + tax) * 100) / 100;
  const balance = Math.max(0, total - draft.paid);
  const requested =
    draft.request === ""
      ? balance
      : Math.min(Math.max(0, Number(draft.request) || 0), balance);
  const unresolved = draft.lines.some(
    (x) => x.price === null && !x.clientDirect,
  );
  return {
    lineTotal,
    oneTime,
    monthly,
    discount,
    tax,
    total,
    balance,
    requested,
    unresolved,
  };
}

export function validatePayments(draft: Draft) {
  const { oneTime, monthly, total, balance } = calculate(draft);
  const request = Number(draft.request);
  const format = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  return {
    discount:
      draft.discount > oneTime + monthly
        ? `Discount cannot exceed the subtotal (${format(oneTime + monthly)}).`
        : "",
    paid:
      draft.paid > total
        ? `Payment received cannot exceed the invoice total (${format(total)}).`
        : "",
    request:
      draft.request !== "" && (!Number.isFinite(request) || request < 0)
        ? "Enter an amount of zero or more."
        : draft.request !== "" && request > balance
          ? `Amount requested cannot exceed the remaining balance (${format(balance)}).`
          : "",
  };
}
