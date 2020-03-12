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

function App(props) {

  const [appList, setAppList] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState(undefined)

  useEffect(() => {
    if (appList === undefined) retrieveAppList()
    if (userList === undefined) retrieveUserList()
  })

  const handleAppDelete = (appId) => {
    Uikit.modal.confirm(`Do you really want to delete the app ${appId}?`).then(function () {
      (async () => {
        try {
          await logic.appDelete(appId)
          retrieveAppList()
        } catch (error) {
          Uikit.notification({ message: error.message, status: 'danger', timeout: 1000, pos: 'top-right' })
        }
      })()
    })
  }

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

  const handleNavigateAppList = () => {
    props.history.push('/applist')
  }

  const handleNavigateAppRegister = () => {
    props.history.push('/appregister')
  }

  const handleNavigateUserList = () => {
    props.history.push('/userlist')
  }

  const handleNavigateUserRegister = () => {
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

  const retrieveUserList = async () => {
    try {
      const result = await logic.retrieveAllUsers()
      setUserList(result)
    } catch (error) {
      Uikit.notification({ message: error.message, status: 'danger', timeout: 1000, pos: 'top-right' })
    }
  }

  const submitNewUser = async (email, password, userData, appData) => {
    try {
      await logic.userRegister(email, password, userData, appData)
      Uikit.notification({ message: 'User successfully registered', status: 'success', timeout: 1000, pos: 'top-right' })
      props.history.push('/home')
      const result = await logic.retrieveAllUsers()
      setUserList(result)
    } catch (error) {
      Uikit.notification({ message: error.message, status: 'danger', timeout: 1000, pos: 'top-right' })
    }
  }

  const userAppDataDelete = async (email, appId) => {
    Uikit.modal.confirm(`Do you really want to delete the app ${appId} for user ${email}?`).then(function () {
      (async () => {
        try {
          await logic.adminDeleteUserAppData(email, appId)
          Uikit.notification({ message: 'app successfully deleted', status: 'success', timeout: 1000, pos: 'top-right' })
          retrieveUserList()
        } catch (error) {
          Uikit.notification({ message: error.message, status: 'danger', timeout: 1000, pos: 'top-right' })
        }
      })()
    })
  }

  const userDelete = async (email) => {
    Uikit.modal.confirm(`Do you really want to delete the user ${email}?`).then(function () {
      (async () => {
        try {
          await logic.adminDeleteUser(email)
          Uikit.notification({ message: 'User successfully deleted', status: 'success', timeout: 1000, pos: 'top-right' })
          retrieveUserList()
        } catch (error) {
          Uikit.notification({ message: error.message, status: 'danger', timeout: 1000, pos: 'top-right' })
        }
      })()
    })
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
          <Home onNavigateAppList={handleNavigateAppList} onNavigateAppRegister={handleNavigateAppRegister} onNavigateUserList={handleNavigateUserList} onNavigateUserRegister={handleNavigateUserRegister} />
          : <Redirect to="/" />}

      />
      <Route path="/applist" render={() =>
        logic.isUserLoggedIn ?
          <AppList appList={appList} onAppDelete={handleAppDelete} onNavigateAppList={handleNavigateAppList} onNavigateAppRegister={handleNavigateAppRegister} onNavigateUserList={handleNavigateUserList} onNavigateUserRegister={handleNavigateUserRegister} />
          : <Redirect to="/" />}

      />
      <Route path="/appregister" render={() =>
        logic.isUserLoggedIn ?
          <AppRegister onNavigateAppList={handleNavigateAppList} onNavigateAppRegister={handleNavigateAppRegister} onNavigateUserList={handleNavigateUserList} onNavigateUserRegister={handleNavigateUserRegister} />
          : <Redirect to="/" />}
      />
      <Route path="/userlist" render={() =>
        logic.isUserLoggedIn ?
          <UserList onNavigateAppList={handleNavigateAppList} onNavigateAppRegister={handleNavigateAppRegister} onNavigateUserList={handleNavigateUserList} onNavigateUserRegister={handleNavigateUserRegister} onUserDelete={userDelete} onUserAppDataDelete={userAppDataDelete} userList={userList} />
          : <Redirect to="/" />}

      />
      <Route path="/userregister" render={() =>
        logic.isUserLoggedIn ?
          <UserRegister appList={appList} onNavigateAppList={handleNavigateAppList} onNavigateAppRegister={handleNavigateAppRegister} onNavigateUserList={handleNavigateUserList} onNavigateUserRegister={handleNavigateUserRegister} onUserSubmit={submitNewUser} />
          : <Redirect to="/" />}

      />
      <Redirect to="/" />
    </Switch>
  );
}

export default withRouter(App);
