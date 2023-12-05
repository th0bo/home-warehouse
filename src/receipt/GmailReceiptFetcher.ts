namespace GmailReceiptFetcher {
  const labelName = "receipts";

  const emailFrom = "contact@email.notification.supermarchesmatch.fr";
  const emailSubject = "Votre ticket de caisse";

  type GmailFetchedReceipt = FetchedReceipt & {
    thread: GoogleAppsScript.Gmail.GmailThread;
  };

  export const fetch: FetchReceipts<GmailFetchedReceipt> = () => {
    const receipts: GmailFetchedReceipt[] = [];
    for (const thread of GmailApp.getInboxThreads().reverse()) {
      const messages = thread.getMessages();
      for (const message of messages) {
        if (isReceipt(message)) {
          const data = message.getBody();
          const id = message.getId();
          receipts.push({ data, thread });
        }
      }
    }
    return receipts;
  };

  export const flagAsProcessed = (receipts: GmailFetchedReceipt[]) => {
    const label = GmailApp.getUserLabelByName(labelName);

    for (const { thread } of receipts) {
      archiveThread(thread, label);
    }
  };

  const isReceipt = (message: GoogleAppsScript.Gmail.GmailMessage) =>
    message.getFrom().includes(emailFrom) &&
    message.getSubject().includes(emailSubject);

  const archiveThread = (
    thread: GoogleAppsScript.Gmail.GmailThread,
    label: GoogleAppsScript.Gmail.GmailLabel
  ) => {
    thread.addLabel(label);
    thread.moveToArchive();
  };
}
