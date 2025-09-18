import { Todo } from "../../domain/entities/Todo";
import { TodoRepository } from "../../domain/repositories/TodoRepository";

export class InMemoryTodoRepository implements TodoRepository {
  private todos: Todo[] = [];

  async add(todo: Todo): Promise<void> {
    this.todos.push(todo);
  }

  async update(todo: Todo): Promise<void> {
    const index = this.todos.findIndex((t) => t.getId() === todo.getId());
    if (index !== -1) {
      this.todos[index] = todo;
    }
  }

  async delete(todo: Todo): Promise<void> {
    this.todos = this.todos.filter((t) => t.getId() !== todo.getId());
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this.todos.find((t) => t.getId() === id);
    return todo || null;
  }

  async findByTitle(title: string): Promise<Todo | null> {
    const todo = this.todos.find((t) => t.getTitle() === title);
    return todo || null;
  }

  async findAll(): Promise<Todo[]> {
    return [...this.todos];
  }

  async findChildrensByParentId(parentId: string): Promise<Todo[]> {
    const parentTodo = this.todos.find((todo) => todo.getId() === parentId);
    if (!parentTodo) return [];

    const childrens = this.todos.filter((todo) => todo.getParentId() === parentId);

    return childrens;
  }
}
