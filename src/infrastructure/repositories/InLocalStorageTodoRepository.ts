import { Todo } from "../../domain/entities/Todo";
import { TodoRepository } from "../../domain/repositories/TodoRepository";

export class InLocalStorageTodoRepository implements TodoRepository {
  private loadAllFromLS(): Todo[] {
    const todosStringify = localStorage.getItem("todos");
    if (!todosStringify) return [];

    const parsedTodos = JSON.parse(todosStringify);
    return parsedTodos.map((parsedTodo: any) => Todo.fromData(parsedTodo));
  }

  private saveAllInLS(todos: Todo[]): void {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  async add(todo: Todo): Promise<void> {
    const todos = this.loadAllFromLS();
    todos.push(todo);
    this.saveAllInLS(todos);
  }

  async update(todo: Todo): Promise<void> {
    const todos = this.loadAllFromLS();
    const index = todos.findIndex((t) => t.getId() === todo.getId());
    if (index !== -1) {
      todos[index] = todo;
      this.saveAllInLS(todos);
    }
  }

  async delete(todo: Todo): Promise<void> {
    const todos = this.loadAllFromLS();
    const newTodos = todos.filter((t) => t.getId() !== todo.getId());
    console.log("newTodos: ", newTodos);
    this.saveAllInLS(newTodos);
  }

  async findById(id: string): Promise<Todo | null> {
    const todos = this.loadAllFromLS();
    const foundedTodo = todos.find((t) => t.getId() === id);
    if (!foundedTodo) return null;

    return foundedTodo;
  }

  async findByTitle(title: string): Promise<Todo | null> {
    const todos = this.loadAllFromLS();
    const foundedTodo = todos.find((t) => t.getTitle() === title);
    if (!foundedTodo) return null;

    return foundedTodo;
  }

  async findAll(): Promise<Todo[]> {
    const todos = this.loadAllFromLS();
    return todos;
  }

  async findChildrensByParentId(parentId: string): Promise<Todo[]> {
    const todos = this.loadAllFromLS();
    const foundedTodo = todos.find((t) => t.getId() === parentId);
    if (!foundedTodo) return [];

    const childrens = todos.filter((todo) => todo.getParentId() === parentId);

    return childrens;
  }
}
