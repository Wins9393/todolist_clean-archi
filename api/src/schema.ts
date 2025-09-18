export const typeDefs = `#graphql
  scalar DateTime

  type Todo {
    id: ID!
    title: String!
    done: Boolean!
    isParent: Boolean!
    parentId: ID
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    todos(parentId: ID): [Todo!]!
    todo(id: ID!): Todo
    allTodos: [Todo!]!
  }

  type Mutation {
    addTodo(title: String!, parentId: ID): Todo!
    updateTodo(id: ID!, title: String!, done: Boolean!, parentId: ID, isParent: Boolean!): Todo! 
    renameTodo(id: ID!, newTitle: String!): Todo!
    toggleTodo(id: ID!, isDone: Boolean): Todo!
    markTodoAsDone(id: ID!, isDone: Boolean!): Todo!
    deleteTodo(id: ID!): Boolean!
  }
`;
