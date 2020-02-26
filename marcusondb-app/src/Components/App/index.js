import React, { useEffect, useState } from 'react'
import { Route, withRouter, Redirect, Switch } from 'react-router-dom'
import Uikit from 'uikit/dist/js/uikit.min.js'

import Loading from '../Loading'
import Login from '../Login'
import Home from '../Home'

import logic from '../../logic'
import './index.css'

function App() {

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setError(false)
  }, [])

  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      await logic.login(email, password)
      setLoading(false)
    } catch (error) {
      setError(true)
      setLoading(false)
      Uikit.notification({ message: error.message, status: 'danger', timeout: 1000, pos:'top-right' })
    }

  }
  return (
    <Switch>
      <Route exact path="/" render={() =>
        logic.isUserLoggedIn ?
          <Redirect to="/home" />
          : loading ? <Loading />
          : <Login onLogin={handleLogin} />
      }
      />
      <Route path="/home" render={() =>
        logic.isUserLoggedIn ?
            <Home />
            : <Redirect to="/" />}

      />
      <Redirect to="/" />
    </Switch>
  );
}

export default withRouter(App);
