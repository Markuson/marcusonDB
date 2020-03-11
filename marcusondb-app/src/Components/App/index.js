import React, { useEffect, useState } from 'react'
import { Route, withRouter, Redirect, Switch } from 'react-router-dom'
import Uikit from 'uikit/dist/js/uikit.min.js'

import Loading from '../Loading'
import Login from '../Login'
import Home from '../Home'
import AppList from '../AppList'
import AppRegister from '../AppRegister'
import UserList from '../UserList'
import UserRegister from '../UserRegister'

import logic from '../../logic'
import './index.css'

function App(props) {

  const [loading, setLoading] = useState(false)
  const [appList, setAppList] = useState(undefined)

  useEffect(() => {
    if(appList===undefined) retrieveAppList()
  }, [])

  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      await logic.login(email, password)
      setLoading(false)
      props.history.push('/home')
    } catch (error) {
      setLoading(false)
      Uikit.notification({ message: error.message, status: 'danger', timeout: 1000, pos: 'top-right' })
    }
  }

  const handleAppList = () => {
    props.history.push('/applist')
  }

  const handleAppRegister = () => {
    props.history.push('/appregister')
  }

  const handleUserList = () => {
    props.history.push('/userlist')
  }

  const handleUserRegister = () => {
    props.history.push('/userregister')
  }

  const retrieveAppList = async () => {
    try {
      const result = await logic.adminRetrieveAllApps()
      setAppList(result)
    } catch (error) {
      Uikit.notification({ message: error.message, status: 'danger', timeout: 1000, pos: 'top-right' })
    }
  }
  const submitNewUser = async (email, password, userData,appData) => {
    try {
      await logic.userRegister(email, password, userData, appData)
      Uikit.notification({ message: 'User successfully registered', status: 'success', timeout: 1000, pos: 'top-right' })
      props.history.push('/home')
    } catch (error) {
      Uikit.notification({ message: error.message, status: 'danger', timeout: 1000, pos: 'top-right' })
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
          <Home onAppList={handleAppList} onAppRegister={handleAppRegister} onUserList={handleUserList} onUserRegister={handleUserRegister} />
          : <Redirect to="/" />}

      />
      <Route path="/applist" render={() =>
        logic.isUserLoggedIn ?
          <AppList onAppList={handleAppList} onAppRegister={handleAppRegister} onUserList={handleUserList} onUserRegister={handleUserRegister} />
          : <Redirect to="/" />}

      />
      <Route path="/appregister" render={() =>
        logic.isUserLoggedIn ?
          <AppRegister onAppList={handleAppList} onAppRegister={handleAppRegister} onUserList={handleUserList} onUserRegister={handleUserRegister} />
          : <Redirect to="/" />}
      />
      <Route path="/userlist" render={() =>
        logic.isUserLoggedIn ?
          <UserList onAppList={handleAppList} onAppRegister={handleAppRegister} onUserList={handleUserList} onUserRegister={handleUserRegister} />
          : <Redirect to="/" />}

      />
      <Route path="/userregister" render={() =>
        logic.isUserLoggedIn ?
          <UserRegister appList={appList} onAppList={handleAppList} onAppRegister={handleAppRegister} onUserList={handleUserList} onUserRegister={handleUserRegister} onUserSubmit={submitNewUser}/>
          : <Redirect to="/" />}

      />
      <Redirect to="/" />
    </Switch>
  );
}

export default withRouter(App);
