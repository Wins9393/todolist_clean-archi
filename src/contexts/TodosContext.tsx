import { createContext, ReactNode, useEffect, useState } from "react";
import { Todo } from "../domain/entities/Todo";
import { InLocalStorageTodoRepository } from "../infrastructure/repositories/InLocalStorageTodoRepository";
import { getAllTodosUseCase } from "../application/use-cases/getAllTodosUseCase";
import { createTodoUseCase } from "../application/use-cases/createTodoUseCase";
import { updateTodoUseCase } from "../application/use-cases/updateTodoUseCase";
import { deleteTodoUseCase } from "../application/use-cases/deleteTodoUseCase";
import { markTodoAsDoneUseCase } from "../application/use-cases/markTodoAsDoneUseCase";
import { createChildrenUseCase } from "../application/use-cases/createChildrenUseCase";
import { getChildrensByParentIdUseCase } from "../application/use-cases/getChildrensByParentIdUseCase";

interface ITodosContext {
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
  updateTodo: (id: string, title: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  markTodoAsDone: (id: string) => Promise<void>;
  getChildrensByParentId: (parentId: string) => Promise<Todo[]>;
  addChildren: (parent: Todo, titile: string) => Promise<void>;
}

const repository = new InLocalStorageTodoRepository();
const getAllTodos = getAllTodosUseCase(repository);
const createTD = createTodoUseCase(repository);
const updateTD = updateTodoUseCase(repository);
const deleteTD = deleteTodoUseCase(repository);
const markTDAsDone = markTodoAsDoneUseCase(repository);
const addChildrenToParent = createChildrenUseCase(repository);
const getChildrens = getChildrensByParentIdUseCase(repository);

export const TodosContext = createContext<ITodosContext | null>(null);

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos(): Promise<void> {
    try {
      const todos = await getAllTodos();
      setTodos(todos);
    } catch (error: unknown) {
      console.log(error);
    }
  }

  async function addTodo(title: string): Promise<void> {
    await createTD(title);
    await getTodos();
  }

  async function updateTodo(id: string, title: string): Promise<void> {
    await updateTD(id, title);
    await getTodos();
  }

  async function deleteTodo(id: string): Promise<void> {
    await deleteTD(id);
    await getTodos();
  }

  async function markTodoAsDone(id: string): Promise<void> {
    await markTDAsDone(id);
    await getTodos();
  }

  async function getChildrensByParentId(parentId: string): Promise<Todo[]> {
    const childrens = await getChildrens(parentId);
    return childrens;
  }

  async function addChildren(parent: Todo, title: string): Promise<void> {
    await addChildrenToParent(parent, title);
    await getTodos();
  }

  return (
    <TodosContext.Provider
      value={{
        todos,
        addTodo,
        updateTodo,
        deleteTodo,
        markTodoAsDone,
        getChildrensByParentId,
        addChildren,
      }}>
      {children}
    </TodosContext.Provider>
  );
}
