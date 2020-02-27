import React from 'react'

import './index.css'

export default function Navbar({
    onAppList,
    onAppRegister,
    onUserList,
    onUserRegister
}) {

    const appList = (e) => {
        e.preventDefault()
        onAppList()
    }

    const appRegister = (e) => {
        e.preventDefault()
        onAppRegister()
    }

    const userList = (e) => {
        e.preventDefault()
        onUserList()
    }

    const userRegister = (e) => {
        e.preventDefault()
        onUserRegister()
    }

    return <nav className="uk-navbar-container uk-navbar-transparent" data-uk-sticky data-uk-navbar data-uk-scrollspy="cls:uk-animation-fade">
        <div className="uk-navbar-center">
            <ul className="uk-navbar-nav">
                <div className='uk-padding'>
                    <li className='uk-active'>
                        <button className="uk-button uk-button-text uk-button-large" onClick={userRegister} data-uk-tooltip="title: Register User ; pos: bottom">
                            <span className="uk-icon" data-uk-icon="icon: user; ratio: 2"></span>
                        </button>
                    </li>
                </div>
                <div className='uk-padding'>
                    <li>
                    <button className="uk-button uk-button-text uk-button-large" onClick={userList} data-uk-tooltip="title: View User List ; pos: bottom">
                        <span className="uk-icon" data-uk-icon="icon: users; ratio: 2"></span>
                    </button>
                    </li>
                </div>
                <div className='uk-padding'>
                    <li>
                    <button className="uk-button uk-button-text uk-button-large" onClick={appRegister} data-uk-tooltip="title: Register App ; pos: bottom">
                        <span className="uk-icon" data-uk-icon="icon: file-edit; ratio: 2"></span>
                    </button>
                    </li>
                </div>
                <div className='uk-padding'>
                    <li>
                    <button className="uk-button uk-button-text uk-button-large" onClick={appList} data-uk-tooltip="title: View App List ; pos: bottom">
                        <span className="uk-icon" data-uk-icon="icon: album; ratio: 2"></span>
                    </button>
                    </li>
                </div>
            </ul>

        </div>
    </nav>
}
