import { createContext, ReactNode, useEffect, useState } from "react";

interface INotificationsContext {
  notification: Notification | null;
  addNotification: (notification: Notification) => void;
  clearNotification: () => void;
}

export type TNotificationLevel = "info" | "error" | "success";

interface Notification {
  level: TNotificationLevel;
  message: string;
}

export const NotificationsContext = createContext<INotificationsContext | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    console.log("notification: ", notification);
  }, [notification]);

  function addNotification(notification: Notification) {
    clearNotification();
    setTimeout(() => {
      setNotification(notification);
    }, 100);
  }

  function clearNotification() {
    setNotification(null);
  }

  return (
    <NotificationsContext.Provider
      value={{
        notification,
        addNotification,
        clearNotification,
      }}>
      {children}
    </NotificationsContext.Provider>
  );
}
