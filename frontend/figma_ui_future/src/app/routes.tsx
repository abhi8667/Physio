import { createBrowserRouter } from 'react-router';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { RecoverySetup } from './pages/RecoverySetup';
import { Session } from './pages/Session';
import { Progress } from './pages/Progress';
import { Exercises } from './pages/Exercises';
import { Reports } from './pages/Reports';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/recovery-setup',
    Component: RecoverySetup,
  },
  {
    path: '/session',
    Component: Session,
  },
  {
    path: '/progress',
    Component: Progress,
  },
  {
    path: '/exercises',
    Component: Exercises,
  },
  {
    path: '/reports',
    Component: Reports,
  },
]);
