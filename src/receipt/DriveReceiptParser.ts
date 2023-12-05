namespace DriveReceiptParser {
  const receiptLineRegExp =
    /([^a-z=]*?)  (\d+)  TVA=C2=A0(\d+,\d+)=C2=A0%  (\d+,\d+)=C2=A0=E2=82=AC  (\d+,\d+)=C2==A0=E2=82=AC(.+)/;
  const dateRegExp = /(\d{2})\/(\d{2})\/(\d{4})/;

  export const parse: ParseReceipt = (receipt: string) => {
    const dateMatcher = receipt.match(dateRegExp) as RegExpMatchArray;
    const date = `${dateMatcher[3]}-${dateMatcher[2]}-${dateMatcher[1]}`;
    let content = receipt
      .split("MES ARTICLES")[1]
      .split(/[\n\r]/)
      .join("");
    let matcher: RegExpMatchArray | null = null;
    const lines: ParsedReceiptLine[] = [];
    do {
      matcher = content.match(receiptLineRegExp);
      if (matcher) {
        content = matcher[6];
        lines.push([
          matcher[1],
          matcher[2],
          `TVA ${matcher[3]} %`,
          `${matcher[4]} €`,
          `${matcher[5]} €`,
        ]);
      }
    } while (matcher);
    return { lines, date };
  };
}
