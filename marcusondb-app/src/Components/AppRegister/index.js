import React from 'react'
import Navbar from '../Navbar'

export default function AppRegister({
    onAppSubmit,
    onNavigateAppList,
    onNavigateAppRegister,
    onNavigateUserList,
    onNavigateUserRegister,
}) {
    const handleSubmit = (e) => {
        const appData = {
            appId: e.target.appId.value,
            role: e.target.role.value
        }
        console.log(appData)
    }

    return <div>
        <Navbar onNavigateAppList={onNavigateAppList} onNavigateAppRegister={onNavigateAppRegister} onNavigateUserList={onNavigateUserList} onNavigateUserRegister={onNavigateUserRegister} selected={'AppRegister'} />
        <div className=' uk-container uk-flex uk-flex-center '>
            <div className='card uk-width-large ' data-uk-scrollspy="cls:uk-animation-fade">
                <div className='uk-card-body '>
                    <div className='uk-flex uk-flex-center uk-margin-small'>
                        <form id='newAppForm' className='uk-form' onSubmit={handleSubmit}>
                            <fieldset className='uk-fieldset'>
                                <legend className='uk-legend uk-text-emphasis'>App Data</legend>

                                <div className=''>
                                    <input className='uk-input' type='text' name='appId' placeholder='appId' />
                                </div>

                                <div className='uk-margin-small'>
                                    <input className='uk-input' type='text' name='owner' placeholder='owner' />
                                </div>
                                <div className='uk-margin-small'>
                                    <button className='uk-button uk-button-default uk-width-1-1 uk-text-emphasis' >Register New App</button>
                                </div>
                            </fieldset>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
