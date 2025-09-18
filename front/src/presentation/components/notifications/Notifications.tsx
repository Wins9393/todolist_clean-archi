import { useContext, useEffect, useState } from "react";
import { NotificationsContext } from "../../../contexts/NotificationsContext";
import { CloseOutlined } from "@ant-design/icons";
import "./notifications.css";

export function Notifications() {
  const [animate, setAnimate] = useState(false);
  const [show, setShow] = useState(false);

  const notificationsContext = useContext(NotificationsContext);
  if (!notificationsContext) return null;

  const { notification, clearNotification } = notificationsContext;

  useEffect(() => {
    if (!notification) {
      setShow(false);
      setAnimate(false);
      return;
    }

    setShow(true);

    const enterTimeout = setTimeout(() => {
      setAnimate(true);
    }, 10);

    const exitTimeout = setTimeout(() => {
      setAnimate(false);

      setTimeout(() => {
        setShow(false);
        clearNotification();
      }, 500);
    }, 5000);

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(exitTimeout);
    };
  }, [notification, clearNotification]);

  return (
    <div className="Notification__Container">
      {show && notification && (
        <div
          className={`Notification Notification--${notification.level} ${
            animate ? "animate" : ""
          }`}>
          {notification.message}
          <CloseOutlined onClick={() => clearNotification()} />
        </div>
      )}
    </div>
  );
}
