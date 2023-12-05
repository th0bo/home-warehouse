namespace TasksGroceriesList {
  const tasksListName = "Courses";

  export const write = (groceriesList: GroceriesList) => {
    const tasksList = obtainTasksList(tasksListName);
    const tasksListId = tasksList.id;

    if (tasksListId === undefined) {
      throw new Error(`No ID found fo tasks list ${JSON.stringify(tasksList)}.`)
    }

    const existingItems = getExistingTasks(tasksListId);

    let previousTaskId: string | undefined;

    const patchTask = Tasks.Tasks?.patch;
    const insertTask = Tasks.Tasks?.insert;
    const moveTask = Tasks.Tasks?.move;

    if (patchTask === undefined || insertTask === undefined || moveTask === undefined) {
      throw new Error(`Tasks API unavailable.`);
    }

    groceriesList.forEach((itemLabel, pos) => {
      const task = {
        title: itemLabel,
        status: "needsAction",
        hidden: false,
        position: pos.toString().padStart(20, "0"),
      };
      let currentTaskId = existingItems.get(itemLabel)?.id;
      if (currentTaskId !== undefined) {
        patchTask(task, tasksListId, currentTaskId);
        Logger.log(`Patched task ${itemLabel} - ${currentTaskId}.`);
      } else {
        currentTaskId = insertTask(task, tasksListId).id as string;
        Logger.log(`Created task ${itemLabel} - ${currentTaskId}.`);
      }
      moveTask(tasksListId, currentTaskId, { previous: previousTaskId });
      Logger.log(`Moved task ${currentTaskId} just after ${previousTaskId}.`);
      previousTaskId = currentTaskId;
    });
  };

  const obtainTasksList = (tasksListName) => {
    const listTasksLists = Tasks.Tasklists?.list;
    const insertTasksList = Tasks.Tasklists?.insert;
    if (listTasksLists === undefined || insertTasksList === undefined) {
      throw new Error(`Tasks API unavailable.`);
    }
    for (const tasksList of listTasksLists().items ?? []) {
      if (tasksList.title === tasksListName) {
        Logger.log(`Found tasks list ${tasksListName}.`);
        return tasksList;
      }
    }
    const tasksList = insertTasksList({ title: tasksListName });
    Logger.log(`Created tasks list ${tasksListName}.`);
    return tasksList;
  };

  const getExistingTasks = (taskListId: string) => {
    const listTasks = Tasks.Tasks?.list;
    if (listTasks === undefined) {
      throw new Error(`Tasks API unavailable.`);
    }
    const tasks =
      listTasks(taskListId, {
        showCompleted: true,
        showHidden: true,
      }).items ?? [];

    const result = new Map<string, GoogleAppsScript.Tasks.Schema.Task>();
    for (const task of tasks) {
      result.set(task.title as string, task);
    }

    return result;
  };
}