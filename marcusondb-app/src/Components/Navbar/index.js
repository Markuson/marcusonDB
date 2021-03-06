import React from 'react'

export default function Navbar({
    onLogout,
    onNavigateAppList,
    onNavigateAppRegister,
    onNavigateUserList,
    onNavigateUserRegister,
    selected = undefined
}) {

    const appList = (e) => {
        e.preventDefault()
        onNavigateAppList()
    }

    const appRegister = (e) => {
        e.preventDefault()
        onNavigateAppRegister()
    }

    const userList = (e) => {
        e.preventDefault()
        onNavigateUserList()
    }

    const userRegister = (e) => {
        e.preventDefault()
        onNavigateUserRegister()
    }

    return <div data-uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky uk-background-secondary; top: 100; animation: uk-animation-slide-top; bottom: #sticky-on-scroll-up " >
        <nav className="uk-navbar-container uk-light uk-navbar-transparent" data-uk-navbar data-uk-scrollspy="cls:uk-animation-fade ">
            <div className="uk-navbar-center">
                <ul className="uk-navbar-nav">
                    <div className='uk-padding'>
                        <li>
                            <button className="uk-button uk-button-text uk-button-large" onClick={userRegister} disabled={selected === 'UserRegister' ? true : false } data-uk-tooltip="title: Register User ; pos: bottom">
                                <span className="uk-icon" data-uk-icon="icon: user; ratio: 2"></span>
                            </button>
                        </li>
                    </div>
                    <div className='uk-padding'>
                        <li>
                            <button className="uk-button uk-button-text uk-button-large" onClick={userList} disabled={selected === 'UserList' ? true : false } data-uk-tooltip="title: View User List ; pos: bottom">
                                <span className="uk-icon" data-uk-icon="icon: users; ratio: 2"></span>
                            </button>
                        </li>
                    </div>
                    <div className='uk-padding'>
                        <li>
                            <button className="uk-button uk-button-text uk-button-large" onClick={appRegister} disabled={selected === 'AppRegister' ? true : false } data-uk-tooltip="title: Register App ; pos: bottom">
                                <span className="uk-icon" data-uk-icon="icon: file-edit; ratio: 2"></span>
                            </button>
                        </li>
                    </div>
                    <div className='uk-padding'>
                        <li>
                            <button className="uk-button uk-button-text uk-button-large" onClick={appList} disabled={selected === 'AppList' ? true : false } data-uk-tooltip="title: View App List ; pos: bottom">
                                <span className="uk-icon" data-uk-icon="icon: album; ratio: 2"></span>
                            </button>
                        </li>
                    </div>
                </ul>
            </div>
        </nav>
    </div>
}
