type Currency = "€" | "$";

interface Amount {
  value: number;
  currency: Currency;
}

interface ReceiptLine {
  itemLabel: string;
  quantity: number;
  vat: string;
  unitPrice: number;
  amount: number;
  date: number;
}

interface MatchedReceiptLine extends ReceiptLine {
  commonLabel: string;
}

interface ListItem {
  commonLabel: string;
  weight: number;
}

/** label, quantity, vat, unitPrice, amount */
type ParsedReceiptLine = [string, string, string, string, string];
/** label, quantity, vat, unitPrice, amount, date */
type FormattedReceiptLine = [...ParsedReceiptLine, string];
/** label, quantity, vat, unitPrice, amount, date */
type UnformattedReceiptLine = [string, number, string, number, number, number];

interface ParsedReceipt {
  lines: ParsedReceiptLine[];
  date: string;
}

type ParseReceipt = (receipt: string) => ParsedReceipt;

interface FetchedReceipt {
  data: string;
}

type FetchReceipts<T extends FetchedReceipt> = () => T[];

type GroceriesList = string[];
