namespace DriveReceiptFetcher {
  const folderName = "Receipts";

  const dateRegExp = /(\d{2})\/(\d{2})\/(\d{4})/;

  const formatFileNameWithDate = (fileName: string) =>
    (fileName.match(dateRegExp) as RegExpMatchArray)
      .slice(1)
      .reverse()
      .join("");

  export const fetch: FetchReceipts<FetchedReceipt> = () => {
    const folder = DriveApp.getFoldersByName(folderName).next();
    const fileIterator = folder.getFiles();
    const fileNames: string[] = [];

    while (fileIterator.hasNext()) {
      const file = fileIterator.next();
      if (file.getName().startsWith("Votre ticket de caisse du")) {
        fileNames.push(file.getName());
      }
    }

    fileNames.sort((a, b) =>
      formatFileNameWithDate(a).localeCompare(formatFileNameWithDate(b))
    );

    return fileNames.map(fileName => {
      const file = folder.getFilesByName(fileName).next();
      const data = file.getBlob().getDataAsString();
      return { data };
    });
  };
}
