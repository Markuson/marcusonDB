import React from 'react'


export default function Home({
    onNavigateAppList,
    onNavigateAppRegister,
    onNavigateUserList,
    onNavigateUserRegister
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

    return <div className='card uk-flex uk-flex-center uk-position-center' data-uk-scrollspy="cls:uk-animation-fade">
        <div className='uk-card-body'>
            <div className="uk-flex uk-margin">
                <div className="uk-padding-small">
                    <button className="uk-button uk-button-default uk-button-large" onClick={userRegister} data-uk-tooltip="Register User">
                        <span className="uk-icon" data-uk-icon="icon: user; ratio: 3"></span>
                    </button>
                </div>
                <div className="uk-padding-small">
                    <button className="uk-button uk-button-default uk-button-large" onClick={userList} data-uk-tooltip="View User List">
                        <span className="uk-icon" data-uk-icon="icon: users; ratio: 3"></span>
                    </button>
                </div>
                <div className="uk-padding-small">
                    <button className="uk-button uk-button-default uk-button-large" onClick={appRegister} data-uk-tooltip="Register App">
                        <span className="uk-icon" data-uk-icon="icon: file-edit; ratio: 3"></span>
                    </button>
                </div>
                <div className="uk-padding-small">
                    <button className="uk-button uk-button-default uk-button-large" onClick={appList} data-uk-tooltip="View App List">
                        <span className="uk-icon" data-uk-icon="icon: album; ratio: 3"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
}