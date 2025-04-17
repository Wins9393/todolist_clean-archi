import { Todo } from "../../domain/entities/Todo";
import { TodoRepository } from "../../domain/repositories/TodoRepository";

export function getAllTodosUseCase(todoRepository: TodoRepository) {
  return async function getAllTodos(): Promise<Todo[]> {
    return await todoRepository.findAll();
  };
}
