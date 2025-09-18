import { TodoRepository } from "../../domain/repositories/TodoRepository";
import { syncParentStatusUseCase } from "./syncParentStatusUseCase";

export function deleteTodoUseCase(todoRepository: TodoRepository) {
  const syncParentStatus = syncParentStatusUseCase(todoRepository);

  return async function deleteTodo(id: string): Promise<void> {
    if (!id) throw new Error("Aucun id renseigné !");

    const existingTodo = await todoRepository.findById(id);
    if (!existingTodo) throw new Error("Cette todo n'existe pas !");

    const childrens = await todoRepository.findChildrensByParentId(id);
    if (childrens.length > 0) {
      await Promise.all(childrens.map((children) => todoRepository.delete(children)));
    }

    const parentId = existingTodo.getParentId();

    await todoRepository.delete(existingTodo);

    if (parentId !== null) {
      await syncParentStatus(parentId);
    }
  };
}
