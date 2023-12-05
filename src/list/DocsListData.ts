namespace DocsDataStore {
  const fileId = "1qKBWWGhm_ssx-gy6C5jmogpPXkQy3PxIYGOmfdtYdTQ";

  export const write = (groceriesList: GroceriesList) => {
    const doc = DocumentApp.openById(fileId);
    const body = doc.getBody();
    body.setText("");
    for (const item of groceriesList) {
      body.appendListItem(item);
    }
    doc.saveAndClose();
  };
}
