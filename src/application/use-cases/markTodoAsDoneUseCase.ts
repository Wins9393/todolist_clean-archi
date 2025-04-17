import { TodoRepository } from "../../domain/repositories/TodoRepository";
import { syncDoneStatusParentUseCase } from "./syncDoneStatusParentUseCase";

export function markTodoAsDoneUseCase(todoRepository: TodoRepository) {
  const syncDoneStatusParent = syncDoneStatusParentUseCase(todoRepository);

  return async function markTodoAsDone(id: string) {
    const existingTodo = await todoRepository.findById(id);
    if (!existingTodo) throw new Error("Cette todo n'existe pas !");

    const parentId = existingTodo.getParentId();

    if (parentId !== null) {
      existingTodo.toggleDone(existingTodo.isDone());
      syncDoneStatusParent(parentId);
    } else {
      existingTodo.toggleDone(existingTodo.isDone());
    }

    await todoRepository.update(existingTodo);
  };
}
