/// <reference types="drive-sheets" />

declare const DriveSheets: DriveSheetsLibrary;

namespace SheetsReceiptLineData {
  const fileId = "1x_uln6FPZ2cvUlhar8wk-ZmrlaxECgQSOH_pqQs221I";
  const receiptLinesRange = "ReceiptLine!A2:F";
  const mapRange = "Map!A1:B";

  export const write = (receiptLines: FormattedReceiptLine[]) => {
    return DriveSheets.save({
      fileId,
      range: receiptLinesRange,
      values: receiptLines,
    });
  };

  export const read = () => {
    return DriveSheets.load({ fileId, range: receiptLinesRange }).map(
      (values) => parseReceiptLine(values as UnformattedReceiptLine)
    );
  };

  export const getMap = () => {
    const values = DriveSheets.load({
      fileId,
      range: mapRange,
    }) as Array<[string, string] | [string]>;
    return values.map((tuple) =>
      tuple.length > 1 ? tuple : [...tuple, ""]
    ) as Array<[string, string]>;
  };

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
