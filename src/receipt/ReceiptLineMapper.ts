namespace ReceiptLineMapper {
  export const map = (receiptLines: ReceiptLine[]) => {
    const mapper = loadMapper();
    const mappedResult = new Map<string, MatchedReceiptLine[]>();

    for (const receiptLine of receiptLines) {
      const commonLabel = mapper.get(receiptLine.itemLabel);
      if (commonLabel !== undefined) {
        (mappedResult.get(commonLabel) ?? (() => {
          const receiptLinesSet = [];
          mappedResult.set(commonLabel, receiptLinesSet);
          return receiptLinesSet;
        })()).push({ ...receiptLine, commonLabel });
      }
    }

    return mappedResult;
  };

  const loadMapper = () => new Map(SheetsReceiptLineData.getMap());
}