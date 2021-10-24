import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './store/auth-context';

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn &&
          <Route Route path='/auth'>
            <AuthPage />
          </Route>
        }
        {/* We can use conditionally rendering the component */}
        <Route path='/profile'>
          {authCtx.isLoggedIn && <UserProfile /> }
          {!authCtx.isLoggedIn && <Redirect to="/auth" /> }
        </Route>
        {/* Anything the user is trying to write that is not part of the router path can be for example  404 page */}
        <Route path='*'>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
