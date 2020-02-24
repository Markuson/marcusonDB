import React, { useEffect, useState } from 'react'
import { Route, withRouter, Redirect, Switch } from 'react-router-dom'
import Login from '../Login'
import logic from '../../logic'
import Uikit from 'uikit/dist/js/uikit.min.js'

import './index.css';

function App() {

  const [error, setError] = useState(null)
  const [userOk, setUserOk] = useState(false)

  useEffect(() => {
    setError(false)
    logic.isUserLoggedIn ? setUserOk(true) : setUserOk(false)
    setUserOk(false)
  }, [])

  const handleLogin = async (email, password) => {
    try {
      await logic.login(email, password)
      setUserOk(true)
    } catch (error) {
      setError(true)
      Uikit.notification({ message: error.message, status: 'danger', timeout: 1000, pos:'top-right' })
    }

  }
  return (
    <Switch>
      <Route exact path="/" render={() =>
        logic.isUserLoggedIn ?
          <Redirect to="/home" />
          : <Login onLogin={handleLogin} />
      }
      />
      <Route path="/home" render={() =>
        logic.isUserLoggedIn ?
            <h1 style={{color: 'white'}}>HOME</h1>
            : <Redirect to="/" />}

      />
      <Redirect to="/" />
    </Switch>
  );
}

export default withRouter(App);
