import { MouseEvent, useContext, useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, CheckOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Todo } from "../../../domain/entities/Todo";
import { TodosContext } from "../../../contexts/TodosContext";
import { NotificationsContext } from "../../../contexts/NotificationsContext";
import "./todo_element.css";

interface ITodoElement {
  todo: Todo;
  selected?: boolean;
  childrens?: Promise<Todo[]>;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
}

export function TodoElement({ todo, selected, childrens, onClick }: ITodoElement) {
  const [onUpdate, setOnUpdate] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(todo.getTitle());
  const [childs, setChilds] = useState<Todo[]>([]);

  const todosContext = useContext(TodosContext);
  if (!todosContext) return null;

  const notificationsContext = useContext(NotificationsContext);
  if (!notificationsContext) return null;

  const { deleteTodo, updateTodo, markTodoAsDone } = todosContext;
  const { addNotification } = notificationsContext;

  useEffect(() => {
    fetchChildrens();
  }, [childrens]);

  async function fetchChildrens() {
    if (childrens) {
      const childsArray = await childrens;
      setChilds(childsArray);
    }
  }

  function handleToggleTodo(e: MouseEvent, id: string) {
    e.stopPropagation();
    markTodoAsDone(id);
  }

  function handleUpdateClick(e: MouseEvent, todo: Todo) {
    e.stopPropagation();
    try {
      if (todo.isDone()) {
        addNotification({
          level: "info",
          message: "Vous ne pouvez pas éditer une todo déjà faite !",
        });
      } else {
        setOnUpdate(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        addNotification({ level: "error", message: error.message });
      } else {
        addNotification({ level: "error", message: "Une erreur inconnue est survenu !" });
      }
    }
  }

  async function handleValidateUpdateClick(e: MouseEvent) {
    e.stopPropagation();
    try {
      await updateTodo(todo.getId(), title);
      setOnUpdate(false);
    } catch (error) {
      if (error instanceof Error) {
        addNotification({ level: "error", message: error.message });
      } else {
        addNotification({ level: "error", message: "Une erreur inconnue est survenu !" });
      }
    }
  }

  async function handleDeleteClick(e: MouseEvent, todoId: string) {
    e.stopPropagation();
    try {
      await deleteTodo(todoId);
    } catch (error) {
      if (error instanceof Error) {
        addNotification({ level: "error", message: error.message });
      } else {
        addNotification({ level: "error", message: "Une erreur inconnue est survenu !" });
      }
    }
  }

  return (
    <li
      className={`TodoElement ${todo.isDone() ? "done" : ""} ${selected ? "selected" : ""}`}
      key={todo.getId()}
      onClick={onClick}>
      <div className="TodoElement__MainContainer">
        {onUpdate === false && (
          <div className="TodoElement--Title">
            <span>{todo.getTitle()}</span>
          </div>
        )}
        {onUpdate && (
          <textarea
            defaultValue={todo.getTitle()}
            onChange={(e) => setTitle(e.target.value)}></textarea>
        )}
        {onUpdate === false && todo.getIsParent() === false && (
          <div className="TodoElement--Options__Container">
            <label
              htmlFor="done"
              className={`button button--todoElement button--toggleDone ${
                todo.isDone() ? "undo" : ""
              }`}
              onClick={(e) => handleToggleTodo(e, todo.getId())}>
              <input type="checkbox" id="done" />
            </label>

            <button
              className="button button--todoElement button--edit"
              onClick={(e) => handleUpdateClick(e, todo)}>
              <EditOutlined />
            </button>
            <button
              className="button button--todoElement button--delete"
              onClick={(e) => handleDeleteClick(e, todo.getId())}>
              <DeleteOutlined />
            </button>
          </div>
        )}
        {onUpdate === false && todo.getIsParent() === true && (
          <div className="TodoElement--Options__Container">
            <button
              className="button button--todoElement button--edit"
              onClick={(e) => handleUpdateClick(e, todo)}>
              <EditOutlined />
            </button>
            <button
              className="button button--todoElement button--delete"
              onClick={(e) => handleDeleteClick(e, todo.getId())}>
              <DeleteOutlined />
            </button>
          </div>
        )}
        {onUpdate && (
          <div className="TodoElement--Options__Container">
            <button
              className="button button--todoElement button--validate"
              onClick={(e) => handleValidateUpdateClick(e)}>
              <CheckOutlined />
            </button>
            <button
              className="button button--todoElement button--back"
              onClick={() => setOnUpdate(false)}>
              <ArrowRightOutlined />
            </button>
          </div>
        )}
      </div>

      <div className="TodoElement__Footer">
        {todo.getIsParent() && (
          <span>{`${childs.length} sous-tâche${childs.length > 1 ? "s" : ""}`}</span>
        )}
      </div>
    </li>
  );
}
