import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import styles from './Layout.module.css';

export default function AppLayout({ children }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
