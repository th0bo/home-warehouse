namespace GmailReceiptParser {
  const receiptLineRegExp =
    /<tr.*?>.*?<td.*?>\s*([^a-z<>]*?)\s*<\/td>.*?<td.*?>\s*(\d+)\s*<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<td.*?>(.*?)<\/td>.*?<\/tr>/;
  const dateRegExp = /(\d{2})\/(\d{2})\/(\d{4})/;

  export const parse: ParseReceipt = (messageBody) => {
    const dateMatcher = messageBody.match(dateRegExp) as RegExpMatchArray;
    const date = `${dateMatcher[3]}-${dateMatcher[2]}-${dateMatcher[1]}`;
    const lines = (
      messageBody
        .split("\n")
        .map((messageBodyLine) => messageBodyLine.match(receiptLineRegExp))
        .filter((matcher) => matcher !== null) as RegExpMatchArray[]
    ).map(
      ([line, ...parsedReceiptItemLine]: [string, ...ParsedReceiptLine]) =>
        parsedReceiptItemLine.map(str => str.replace(/&nbsp;/g, " ")) as ParsedReceiptLine
    );
    return { lines, date };
  };
}
