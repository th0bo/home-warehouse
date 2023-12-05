type BuildReceiptLines = (receipt: ParsedReceipt) => FormattedReceiptLine[];

namespace ReceiptLineBuilder {
  export const build: BuildReceiptLines = ({ lines, date }) =>
    lines.map(([itemLabel, quantity, vat, unitPrice, amount]) => [
      itemLabel,
      quantity,
      vat,
      unitPrice,
      amount,
      date,
    ]);
}
