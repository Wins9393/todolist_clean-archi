import { TodoRepository } from "../../domain/repositories/TodoRepository";

export function updateTodoUseCase(todoRepository: TodoRepository) {
  return async function updateTodo(id: string, title: string): Promise<void> {
    if (!id) throw new Error("Aucun id renseigné !");

    const existingTodo = await todoRepository.findById(id);
    if (!existingTodo) throw new Error("Cette todo n'existe pas !");

    existingTodo.rename(title);

    await todoRepository.update(existingTodo);
  };
}
