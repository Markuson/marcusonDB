import React from 'react'
import Navbar from '../Navbar'
import Loading from '../Loading'

export default function AppList({
    appList,
    onAppDelete,
    onNavigateAppList,
    onNavigateAppRegister,
    onNavigateUserList,
    onNavigateUserRegister
}) {

    const deleteApp = (appId) => {
        onAppDelete(appId)
    }

    const editApp = (appId) => {
        console.log(`edit app: ${appId}`)
    }

    return <div >
        <Navbar onNavigateAppList={onNavigateAppList} onNavigateAppRegister={onNavigateAppRegister} onNavigateUserList={onNavigateUserList} onNavigateUserRegister={onNavigateUserRegister} selected={'AppList'} />
        <div className='uk-container uk-container-expand uk-flex uk-flex-center '>
            {appList &&
                <div className='card uk-width-expand' data-uk-scrollspy='cls:uk-animation-fade'>
                    <div className='uk-card-body '>
                        <table className='uk-table uk-table-striped'>
                            <thead>
                                <tr>
                                    <th className='uk-text-emphasis'>App Id</th>
                                    <th className='uk-text-emphasis'>Owner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appList &&
                                    appList.map((app) => {
                                        return <tr key={app.appId}>
                                            <td>{app.appId}</td>
                                            <td>{app.owner}</td>
                                            <td className='uk-visible@s'>
                                                <button className='uk-button uk-button-text uk-button-large' onClick={() => editApp(app.appId)} data-uk-tooltip='title: Edit App ; pos: bottom'>
                                                    <span className='uk-icon' data-uk-icon='icon: pencil; ratio: 1'></span>
                                                </button>
                                            </td>
                                            <td className='uk-visible@s'>
                                                <button className='uk-button uk-button-text uk-button-large' onClick={() => deleteApp(app.appId)} data-uk-tooltip='title: Delete App ; pos: bottom'>
                                                    <span className='uk-icon' data-uk-icon='icon: trash; ratio: 1'></span>
                                                </button>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            }
            {!appList &&
                <Loading />
            }
        </div>
    </div>
}
