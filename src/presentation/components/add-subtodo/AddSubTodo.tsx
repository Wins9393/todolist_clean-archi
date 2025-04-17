import { useContext, useEffect, useState } from "react";
import { Todo } from "../../../domain/entities/Todo";
import { TodosContext } from "../../../contexts/TodosContext";
import { NotificationsContext } from "../../../contexts/NotificationsContext";
import "./add_subtodo.css";

interface IAddSubTodo {
  currentTodo: Todo | null;
}

export function AddSubTodo({ currentTodo }: IAddSubTodo) {
  const [title, setTitle] = useState<string>("");

  const todosContext = useContext(TodosContext);
  if (!todosContext) return null;

  const notificationsContext = useContext(NotificationsContext);
  if (!notificationsContext) return null;

  const { addChildren } = todosContext;
  const { addNotification } = notificationsContext;

  useEffect(() => {
    console.log("currentTodo: ", currentTodo);
  }, [currentTodo]);

  async function handleCreateChildren(title: string) {
    try {
      if (currentTodo) {
        await addChildren(currentTodo, title);
        setTitle("");
      }
    } catch (error) {
      if (error instanceof Error) {
        addNotification({ level: "error", message: error.message });
      } else {
        addNotification({ level: "error", message: "Une erreur inconnue est survenue !" });
      }
    }
  }

  return (
    <div className="AddSubTodo__Container">
      <input
        type="text"
        name="title"
        placeholder={`Ajouter une sous-tâche pour ${currentTodo?.getTitle() ?? "..."} `}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") handleCreateChildren(title);
        }}
      />
      <button className="button" onClick={() => handleCreateChildren(title)}>
        Créer
      </button>
    </div>
  );
}
