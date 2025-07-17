import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Notifications.scss'; // Same custom styling as before

const Notifications = () => {
  return (
      <ToastContainer 
        className="journal-notification-container"
        toastClassName="journal-notification"
        position="bottom-right"
        progressClassName="journal-notification-progress"
        closeButton
      />
  );
}

export default Notifications;