import "./App.css";
import { CreateTodoButton } from "./presentation/components/buttons/CreateTodoButton";
import { TodosList } from "./presentation/components/todo-list/TodosList";
import { Home } from "./presentation/containers/home/Home";
import { Notifications } from "./presentation/components/notifications/Notifications";
import { Header } from "./presentation/components/header/Header";

function App() {
  return (
    <Home>
      <Header>
        <Notifications />
      </Header>
      <TodosList />
      <CreateTodoButton />
    </Home>
  );
}

export default App;
