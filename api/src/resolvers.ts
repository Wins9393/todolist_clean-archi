import { GraphQLScalarType, Kind } from "graphql";
import { Pool } from "pg";

const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "DateTime scalar type pour les dates-heures au format ISO-8601",
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === "string") {
      return new Date(value).toISOString();
    }
    throw new Error("Invalid DateTime value");
  },
  parseValue(value: unknown): Date {
    if (typeof value === "string" || typeof value === "number") {
      return new Date(value);
    }
    throw new Error("Invalid DateTime value");
  },
  parseLiteral(ast): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error("Invalid DateTime literal");
  },
});

function mapTodoRow(row: any) {
  return {
    id: row.id,
    title: row.title,
    done: row.done,
    isParent: row.is_parent,
    parentId: row.parent_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

interface TodoInput {
  title: string;
  parentId?: string;
}
interface RenameTodoInput {
  id: string;
  newTitle: string;
}
interface ToggleTodoInput {
  id: string;
  isDone?: boolean;
}
interface MarkTodoInput {
  id: string;
  isDone: boolean;
}
interface DeleteTodoInput {
  id: string;
}

interface Context {
  db: Pool;
}

export const resolvers = {
  DateTime: DateTimeScalar,

  Query: {
    todos: async (_parent: unknown, args: { parentId?: string }, context: Context) => {
      const { db } = context;
      if (args.parentId) {
        const result = await db.query("SELECT * FROM todos WHERE parent_id = $1", [args.parentId]);
        return result.rows.map(mapTodoRow);
      } else {
        const result = await db.query("SELECT * FROM todos WHERE parent_id IS NULL");
        return result.rows.map(mapTodoRow);
      }
    },
    todo: async (_parent: unknown, args: { id: string }, context: Context) => {
      const { db } = context;
      const result = await db.query("SELECT * FROM todos WHERE id = $1", [args.id]);
      if (result.rows.length === 0) {
        return null;
      }
      return mapTodoRow(result.rows[0]);
    },

    allTodos: async (_parent: unknown, _args: unknown, context: Context) => {
      const { db } = context;
      const result = await db.query("SELECT * FROM todos ORDER BY created_at DESC");
      return result.rows.map(mapTodoRow);
    },
  },

  Mutation: {
    addTodo: async (_parent: unknown, args: TodoInput, context: Context) => {
      const { db } = context;
      if (args.parentId) {
        const parentRes = await db.query("SELECT * FROM todos WHERE id = $1", [args.parentId]);
        if (parentRes.rows.length === 0) {
          throw new Error("Parent todo not found");
        }
        const parent = parentRes.rows[0];
        if (parent.parent_id) {
          throw new Error("Cannot add a subtask to a subtask");
        }
      }
      const insertRes = await db.query("INSERT INTO todos (title, done, is_parent, parent_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *", [
        args.title,
        false,
        false,
        args.parentId || null,
      ]);
      return mapTodoRow(insertRes.rows[0]);
    },

    updateTodo: async (_p: unknown, args: { id: string; title: string; done: boolean; parentId?: string | null; isParent: boolean }, { db }: Context) => {
      if (args.parentId) {
        const p = await db.query("SELECT parent_id FROM todos WHERE id = $1", [args.parentId]);
        if (!p.rows[0]) throw new Error("Parent introuvable");
        if (p.rows[0].parent_id) throw new Error("Une sous-tâche ne peut pas avoir de sous-tâches !");
      }

      const cur = await db.query("SELECT title, done FROM todos WHERE id = $1", [args.id]);
      if (!cur.rows[0]) throw new Error("Todo introuvable");
      if (cur.rows[0].done && cur.rows[0].title !== args.title && args.done) {
        throw new Error("Une todo 'Done' ne peut pas être renommée !");
      }

      const { rows } = await db.query(
        `UPDATE todos
           SET title = $2,
               done = $3,
               parent_id = $4,
               is_parent = $5,
               updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [args.id, args.title.trim(), args.done, args.parentId ?? null, args.isParent]
      );
      if (!rows[0]) throw new Error("Todo introuvable");
      return mapTodoRow(rows[0]);
    },

    toggleTodo: async (_parent: unknown, args: ToggleTodoInput, context: Context) => {
      const { db } = context;
      const result = await db.query("SELECT * FROM todos WHERE id = $1", [args.id]);
      if (result.rows.length === 0) {
        throw new Error("Todo not found");
      }
      const todo = result.rows[0];
      const currentDone = todo.done;

      const newDone = args.isDone !== undefined ? args.isDone : !currentDone;
      const updateRes = await db.query("UPDATE todos SET done = $1, updated_at = NOW() WHERE id = $2 RETURNING *", [newDone, args.id]);
      return mapTodoRow(updateRes.rows[0]);
    },

    markTodoAsDone: async (_parent: unknown, args: MarkTodoInput, context: Context) => {
      const { db } = context;
      const result = await db.query("SELECT * FROM todos WHERE id = $1", [args.id]);
      if (result.rows.length === 0) {
        throw new Error("Todo not found");
      }
      const updateRes = await db.query("UPDATE todos SET done = $1, updated_at = NOW() WHERE id = $2 RETURNING *", [args.isDone, args.id]);
      return mapTodoRow(updateRes.rows[0]);
    },

    deleteTodo: async (_parent: unknown, args: DeleteTodoInput, context: Context) => {
      const { db } = context;
      const result = await db.query("DELETE FROM todos WHERE id = $1", [args.id]);
      if (result.rowCount !== null) return result.rowCount > 0;
    },
  },
};
