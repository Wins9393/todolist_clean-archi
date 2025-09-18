import { Todo } from "../../domain/entities/Todo";
import { TodoRepository } from "../../domain/repositories/TodoRepository";
import { syncParentStatusUseCase } from "./syncParentStatusUseCase";

export function createChildrenUseCase(todoRepository: TodoRepository) {
  const syncParentStatus = syncParentStatusUseCase(todoRepository);

  return async function addChildren(parent: Todo, title: string): Promise<void> {
    if (!title || title.trim() === "") throw new Error("Une todo doit avoir un titre !");

    const existingTodo = await todoRepository.findById(parent.getId());
    if (!existingTodo) throw new Error("Cette todo n'existe pas !");

    const children = new Todo(title);
    parent.addChildren(children);
    await todoRepository.update(parent);
    await todoRepository.add(children);

    await syncParentStatus(parent.getId());
  };
}
