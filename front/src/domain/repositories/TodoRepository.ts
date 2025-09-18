import { Todo } from "../entities/Todo";

export interface TodoRepository {
  add(todo: Todo): Promise<void>;
  update(todo: Todo): Promise<void>;
  delete(todo: Todo): Promise<void>;
  findById(id: string): Promise<Todo | null>;
  findByTitle(title: string): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  findChildrensByParentId(parentId: string): Promise<Todo[]>;
}
