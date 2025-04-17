import { TodoData } from "../../interfaces/Todo";
import { generateUniqueId } from "../services/generateUniqueId";

export class Todo {
  private id: string;
  private title: string;
  private done: boolean;
  private isParent: boolean;
  private parentId: string | null;
  private created_at: string;
  private updated_at: string;

  constructor(title: string) {
    this.id = generateUniqueId();
    this.title = title.trim();
    this.done = false;
    this.isParent = false;
    this.parentId = null;
    const now = new Date().toISOString();
    this.created_at = now;
    this.updated_at = now;
  }

  static fromData(data: TodoData): Todo {
    const todo = new Todo(data.title);
    todo.id = data.id;
    todo.done = data.done;
    todo.isParent = data.isParent;
    todo.parentId = data.parentId;
    todo.created_at = data.created_at;
    todo.updated_at = data.updated_at;
    return todo;
  }

  public getId() {
    return this.id;
  }

  public getTitle() {
    return this.title;
  }

  public isDone() {
    return this.done;
  }

  public getIsParent() {
    return this.isParent;
  }

  public getParentId() {
    return this.parentId;
  }

  public toggleDone(isDone: boolean): void {
    this.done = !isDone;
    this.updated_at = new Date().toISOString();
  }

  public markTodoAsDone(isDone: boolean): void {
    this.done = isDone;
    this.updated_at = new Date().toISOString();
  }

  public rename(newTitle: string): void {
    if (!newTitle || newTitle.trim() === "") throw new Error("Une todo doit avoir un titre !");
    if (this.done) throw new Error("Une todo 'Done' ne peut pas être modifiée !");
    this.title = newTitle;
    this.updated_at = new Date().toISOString();
  }

  public setIsParent(isParent: boolean) {
    this.isParent = isParent;
  }

  public addChildren(children: Todo) {
    if (this.parentId !== null)
      throw new Error("Une sous-tâche ne peut pas avoir de sous-tâches !");
    children.parentId = this.id;
    // this.setIsParent(true);
    this.updated_at = new Date().toISOString();
  }
}
