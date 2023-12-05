namespace SheetsReceiptLineData {
  const sheetName = "ReceiptLine";
  const spreadsheetId = "1x_uln6FPZ2cvUlhar8wk-ZmrlaxECgQSOH_pqQs221I";
  const mapSheetName = "Map";

  export const write = (receiptLines: FormattedReceiptLine[]) => {
    const append = Sheets.Spreadsheets?.Values?.append;
    if (append === undefined) {
      throw new Error("Drive API unavailable.");
    }
    append({ values: receiptLines }, spreadsheetId, sheetName, {
      valueInputOption: "USER_ENTERED",
    });
  };

  export const read = () => {
    const get = Sheets.Spreadsheets?.Values?.get;
    if (get === undefined) {
      throw new Error("Drive API unavailable.");
    }
    const values = get(spreadsheetId, "ReceiptLine!A2:F", {
      valueRenderOption: "UNFORMATTED_VALUE",
    }).values as UnformattedReceiptLine[];
    return values.map(parseReceiptLine);
  };

  export const getMap = () => {
    const get = Sheets.Spreadsheets?.Values?.get;
    if (get === undefined) {
      throw new Error("Drive API unavailable.");
    }
    const values = get(spreadsheetId, "Map!A1:B", {
      valueRenderOption: "UNFORMATTED_VALUE",
    }).values as Array<[string, string] | [string]>;
    return values.map(tuple => tuple.length > 1 ? tuple : [...tuple, ""]) as Array<[string, string]>;
  }

  type ParseReceiptLine = (line: UnformattedReceiptLine) => ReceiptLine;

  const parseReceiptLine: ParseReceiptLine = ([
    itemLabel,
    quantity,
    vat,
    unitPrice,
    amount,
    date,
  ]) => ({
    itemLabel,
    quantity,
    vat,
    unitPrice,
    amount,
    date,
  });
}