import React, { Suspense, useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import HOST_URL from '../../constants/';

import ErrorBoundary from "./ErrorBoundary";
import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

function DefaultLayout(props) {
  let history = useHistory();

  useEffect(() => {
    if(!isAuthenticated()) history.push('/login');
  });

  const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  const isAuthenticated = () => {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  };

  const signOut = (e) => {
    e.preventDefault();
    let token = localStorage.getItem('access_token');
    if(isAuthenticated() && token) {
      fetch(HOST_URL +'/api/userSessions', {
        method: 'DELETE',
        headers: {
          'Accept': '*/*',
          'Authorization': 'Bearer ' + token
        },
      }).then((result) => {
        if (result.status === 200) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('expires_at');
          history.push('/login');
        }
      })
    } else {
      history.push('/login');
    }
  };

    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={loading()}>
            <DefaultHeader onLogout={e=>signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            <AppSidebarNav navConfig={navigation} {...props} router={router}/>
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router}/>
            <Container fluid>
              <Suspense fallback={loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <ErrorBoundary>
                            <route.component {...props} />
                          </ErrorBoundary>
                        )} />
                    ) : null;
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
}

export default DefaultLayout;
