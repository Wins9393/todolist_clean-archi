import { Todo } from "../../domain/entities/Todo";
import { TodoRepository } from "../../domain/repositories/TodoRepository";

export function createTodoUseCase(todoRepository: TodoRepository) {
  return async function createTodo(title: string): Promise<Todo> {
    if (!title || title.trim() === "") throw new Error("Une todo doit avoir un titre !");

    const existingTodo = await todoRepository.findByTitle(title);
    if (existingTodo) throw new Error("Cette todo existe déjà !");

    const newTodo = new Todo(title);
    await todoRepository.add(newTodo);

    return newTodo;
  };
}
