import { Todo } from "../../domain/entities/Todo";
import type { TodoRepository } from "../../domain/repositories/TodoRepository";
import type { TodoData } from "../../interfaces/Todo";

const GQL_ENDPOINT = import.meta.env.VITE_API_URL ?? "http://localhost:4000/todolist";

async function gql<TData>(query: string, variables?: Record<string, unknown>): Promise<TData> {
  const res = await fetch(GQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GraphQL HTTP error ${res.status}: ${txt}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "GraphQL error");
  }
  return json.data;
}

function toTodoData(api: any): TodoData {
  return {
    id: api.id,
    title: api.title,
    done: api.done,
    isParent: api.isParent,
    parentId: api.parentId ?? null,
    created_at: api.createdAt,
    updated_at: api.updatedAt,
  };
}

const Q_ALL_TODOS = /* GraphQL */ `
  query AllTodos {
    allTodos {
      id
      title
      done
      isParent
      parentId
      createdAt
      updatedAt
    }
  }
`;

const Q_TODOS = /* GraphQL */ `
  query Todos($parentId: ID) {
    todos(parentId: $parentId) {
      id
      title
      done
      isParent
      parentId
      createdAt
      updatedAt
    }
  }
`;

const Q_TODO_BY_ID = /* GraphQL */ `
  query Todo($id: ID!) {
    todo(id: $id) {
      id
      title
      done
      isParent
      parentId
      createdAt
      updatedAt
    }
  }
`;

const M_ADD_TODO = /* GraphQL */ `
  mutation AddTodo($title: String!, $parentId: ID) {
    addTodo(title: $title, parentId: $parentId) {
      id
    }
  }
`;

const M_UPDATE_TODO = /* GraphQL */ `
  mutation UpdateTodo($id: ID!, $title: String!, $done: Boolean!, $parentId: ID, $isParent: Boolean!) {
    updateTodo(id: $id, title: $title, done: $done, parentId: $parentId, isParent: $isParent) {
      id
    }
  }
`;

const M_DELETE_TODO = /* GraphQL */ `
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export class GraphQLTodoRepository implements TodoRepository {
  async add(todo: Todo): Promise<void> {
    await gql(M_ADD_TODO, {
      title: todo.getTitle(),
      parentId: todo.getParentId() ?? null,
    });
  }

  async update(todo: Todo): Promise<void> {
    await gql(M_UPDATE_TODO, {
      id: todo.getId(),
      title: todo.getTitle(),
      done: todo.isDone(),
      parentId: todo.getParentId() ?? null,
      isParent: todo.getIsParent(),
    });
  }

  async delete(todo: Todo): Promise<void> {
    await gql(M_DELETE_TODO, { id: todo.getId() });
  }

  async findById(id: string): Promise<Todo | null> {
    const data = await gql<{ todo: any }>(Q_TODO_BY_ID, { id });
    if (!data.todo) return null;
    return Todo.fromData(toTodoData(data.todo));
  }

  async findByTitle(title: string): Promise<Todo | null> {
    const all = await this.findAll();
    const found = all.find((t) => t.getTitle() === title);
    return found ?? null;
  }

  async findAll(): Promise<Todo[]> {
    const data = await gql<{ allTodos: any[] }>(Q_ALL_TODOS);
    return data.allTodos.map((t) => Todo.fromData(toTodoData(t)));
  }

  async findChildrensByParentId(parentId: string): Promise<Todo[]> {
    const data = await gql<{ todos: any[] }>(Q_TODOS, { parentId });
    return data.todos.map((t) => Todo.fromData(toTodoData(t)));
  }
}
