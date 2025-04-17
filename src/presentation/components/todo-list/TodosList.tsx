import { MouseEvent, useContext, useEffect, useState } from "react";
import { TodosContext } from "../../../contexts/TodosContext";
import { TodoElement } from "../todo-element/TodoElement";
import { Todo } from "../../../domain/entities/Todo";
import { AddSubTodo } from "../add-subtodo/AddSubTodo";
import { Splitter } from "antd";
import "./todo_list.css";
import { ScreenSizeContext } from "../../../contexts/ScreenSizeContext";

export function TodosList() {
  const [childrens, setChildrens] = useState<Todo[]>([]);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  const todosContext = useContext(TodosContext);
  if (!todosContext) return null;

  const sizeContext = useContext(ScreenSizeContext);
  if (!sizeContext) return null;

  const { todos, getChildrensByParentId } = todosContext;
  const { width } = sizeContext;

  useEffect(() => {
    getChildrensByTodo();
  }, [currentTodo, todos]);

  useEffect(() => {
    const firstParentTodo = todos.filter((todo) => todo.getParentId() === null)[0];
    if (firstParentTodo !== null) {
      setCurrentTodo(firstParentTodo);
    }
  }, [todos]);

  async function getChildrensByTodo() {
    if (currentTodo) {
      const childs = await getChildrensByParentId(currentTodo.getId());
      setChildrens(childs);
    }
  }

  function handleOnClick(e: MouseEvent, todo: Todo) {
    e.stopPropagation();
    setCurrentTodo(todo);
  }

  if (todos.length === 0)
    return (
      <div className="Todolist__Container">
        <p>Aucune todos</p>
      </div>
    );

  return (
    <div className="Todolist__MainContainer">
      <Splitter
        layout={width <= 840 ? "vertical" : "horizontal"}
        style={{ flex: 1, color: "inherit" }}>
        <Splitter.Panel defaultSize="70%" min="30%" max="80%">
          <section className="Todolist__Wrapper">
            <ul>
              {todos.map((todo) =>
                todo.getParentId() === null ? (
                  <TodoElement
                    key={todo.getId()}
                    todo={todo}
                    selected={todo.getId() === currentTodo?.getId()}
                    childrens={getChildrensByParentId(todo.getId())}
                    onClick={(e: MouseEvent) => handleOnClick(e, todo)}
                  />
                ) : null
              )}
            </ul>
          </section>
        </Splitter.Panel>
        <Splitter.Panel>
          <section className="Todolist--subtasks__Wrapper">
            <AddSubTodo currentTodo={currentTodo} />
            <ul>
              {childrens.map((children) =>
                children.getIsParent() === false && children.getParentId() !== null ? (
                  <TodoElement key={children.getId()} todo={children} />
                ) : null
              )}
            </ul>
          </section>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}
