import { useContext, useState } from "react";
import { TodosContext } from "../../../contexts/TodosContext";
import { NotificationsContext } from "../../../contexts/NotificationsContext";
import "./create_todo_button.css";

export function CreateTodoButton() {
  const [title, setTitle] = useState<string>("");

  const todosContext = useContext(TodosContext);
  if (!todosContext) return null;

  const notificationsContext = useContext(NotificationsContext);
  if (!notificationsContext) return null;

  const { addTodo } = todosContext;
  const { addNotification } = notificationsContext;

  async function handleAddTodo(title: string) {
    try {
      await addTodo(title);
      setTitle("");
    } catch (error) {
      if (error instanceof Error) {
        addNotification({ level: "error", message: error.message });
      } else {
        addNotification({ level: "error", message: "Une erreur inconnue est survenue !" });
      }
    }
  }

  return (
    <div className="CreateTodo__Container">
      <input
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") handleAddTodo(title);
        }}
      />
      <button className="button" onClick={() => handleAddTodo(title)}>
        Créer
      </button>
    </div>
  );
}
