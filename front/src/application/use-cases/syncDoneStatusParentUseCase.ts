import { TodoRepository } from "../../domain/repositories/TodoRepository";

export function syncDoneStatusParentUseCase(todoRepository: TodoRepository) {
  return async function syncDoneStatusParent(parentId: string) {
    const parentTodo = await todoRepository.findById(parentId);
    if (!parentTodo) throw new Error("Cette todo n'existe pas !");

    const childrens = await todoRepository.findChildrensByParentId(parentId);

    if (childrens.length > 0) {
      const allDone = childrens.every((child) => child.isDone());
      parentTodo.markTodoAsDone(allDone);
      await todoRepository.update(parentTodo);
    }
  };
}
