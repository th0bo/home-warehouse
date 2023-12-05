const logReceipts = <T extends FetchedReceipt>(
  fetch: FetchReceipts<T>,
  parse: ParseReceipt
) => {
  for (const receipt of fetch().map(({ data }) => parse(data))) {
    Logger.log(JSON.stringify(receipt));
  }
};

const logGmailReceipts = () => {
  logReceipts(GmailReceiptFetcher.fetch, GmailReceiptParser.parse);
};

const logDriveReceipts = () => {
  logReceipts(DriveReceiptFetcher.fetch, DriveReceiptParser.parse);
};

const logRegressions = () => {
  const receiptLabelToListLabel = new Map(SheetsReceiptLineData.getMap());
  for (const item of Stats.computeRegressions(
    ReceiptLineMapper.map(SheetsReceiptLineData.read())
  )
    .filter(
      ({ diff, meanDy }) =>
        typeof diff === "number" && typeof meanDy === "number"
    )
    .map((elem) => ({
      ...elem,
      coeff: (elem.diff as number) / (elem.meanDy as number),
    }))
    .sort(({ coeff: coeff0 }, { coeff: coeff1 }) => coeff1 - coeff0)) {
    // Logger.log(JSON.stringify(item));
    Logger.log(`${item.label} ${item.diff} / ${item.meanDy}`);
  }
};

const logLabelledThreadsIds = () => {
  Logger.log(
    JSON.stringify(
      GmailApp.getInboxThreads()
        .filter((thread) =>
          thread
            .getLabels()
            .map((label) => label.getName())
            .includes("scripting")
        )
        .map((thread) => thread.getId())
    )
  );
};

const logStoredReceiptLines = () => {
  Logger.log(JSON.stringify(SheetsReceiptLineData.read()));
};

const logDriveFileId = () => {
  const fileName = "Liste de courses";
  const i = DriveApp.getFilesByName(fileName);
  const ids: string[] = [];
  while (i.hasNext()) {
    ids.push(i.next().getId());
  }
  Logger.log(JSON.stringify(ids));
};

const logDriveFileContent = () => {
  const doc = DocumentApp.openById("1qKBWWGhm_ssx-gy6C5jmogpPXkQy3PxIYGOmfdtYdTQ");
  const body = doc.getBody();
  Logger.log(body.asText().getText());
}
