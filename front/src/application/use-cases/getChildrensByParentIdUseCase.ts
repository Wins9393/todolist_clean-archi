import { Todo } from "../../domain/entities/Todo";
import { TodoRepository } from "../../domain/repositories/TodoRepository";

export function getChildrensByParentIdUseCase(todoRepository: TodoRepository) {
  return async function getChildrensByParentId(parentId: string): Promise<Todo[]> {
    return await todoRepository.findChildrensByParentId(parentId);
  };
}
