import { TodoRepository } from "../../domain/repositories/TodoRepository";

export function syncParentStatusUseCase(todoRepository: TodoRepository) {
  return async function syncParentStatus(parentId: string): Promise<void> {
    const parentTodo = await todoRepository.findById(parentId);
    if (!parentTodo) throw new Error("La todo n'existe pas !");

    const childrens = await todoRepository.findChildrensByParentId(parentId);

    if (childrens.length === 0) {
      parentTodo.setIsParent(false);
    } else {
      parentTodo.setIsParent(true);
    }
    await todoRepository.update(parentTodo);
  };
}
