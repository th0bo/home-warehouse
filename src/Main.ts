const storeDriveReceipts = () => {
  for (const receipt of DriveReceiptFetcher.fetch().map(({ data }) =>
    DriveReceiptParser.parse(data)
  )) {
  }
};

const processGmailReceipts = () => {
  const gmailReceipts = GmailReceiptFetcher.fetch();

  SheetsReceiptLineData.write(
    gmailReceipts
      .map(({ data }) =>
        ReceiptLineBuilder.build(GmailReceiptParser.parse(data))
      )
      .flat()
  );

  GmailReceiptFetcher.flagAsProcessed(gmailReceipts);
};

const testDriveGmailReceipts = () => {
  console.log(SheetsReceiptLineData.read());
}

const storeListToTasks = () => {
  TasksGroceriesList.write([
    "bananes",
    "avoine",
    "oeufs",
    "lait",
    "yahourts",
    "pommes",
    "carottes",
  ]);
};

const storeListToDocs = () => {
  DocsDataStore.write([
    "bananes",
    "avoine",
    "oeufs",
    "lait",
    "yahourts",
    "pommes",
    "carottes",
  ]);
};
