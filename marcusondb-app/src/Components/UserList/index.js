import React from 'react'
import Navbar from '../Navbar'
import Loading from '../Loading'

export default function userList({
    onNavigateAppList,
    onNavigateAppRegister,
    onNavigateUserList,
    onNavigateUserRegister,
    onUserAppDataDelete,
    onUserDelete,
    userList
}) {

    const deleteUser = (appId) => {
        onUserDelete(appId)
    }

    const deleteUserAppdata = (email, appId) => {
        onUserAppDataDelete(email, appId)
    }

    return <div>
        <Navbar onNavigateAppList={onNavigateAppList} onNavigateAppRegister={onNavigateAppRegister} onNavigateUserList={onNavigateUserList} onNavigateUserRegister={onNavigateUserRegister} selected={'UserList'} />
        <div className='uk-container uk-container-expand uk-flex uk-flex-center '>
            {userList &&
                <div className='card uk-width-expand' data-uk-scrollspy='cls:uk-animation-fade'>
                    <div className='uk-card-body '>
                        <table className='uk-table uk-table-striped uk-table-responsive'>
                            <thead>
                                <tr>
                                    <th className='uk-text-emphasis uk-table-shrink'>Email</th>
                                    <th className='uk-text-emphasis '>Linked Apps</th>
                                    <th className='uk-text-emphasis uk-table-expand'>Additional Information</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList &&
                                    userList.map(({ _id: id, email, appData, userData: { name, surname, contact: { address1, address2, tel, city, province, postalCode, country } } }) => {


                                        return <tr key={email}>
                                            <td>{email}</td>
                                            <td>
                                                {!!appData.length &&
                                                    <table className='uk-table uk-table-divider uk-table-responsive'>
                                                        <thead>
                                                            <tr>
                                                                <th>App</th>
                                                                <th>Role</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                appData.map(({ _id: id, appId, role }) => {
                                                                    return <tr key={id}>
                                                                        <td className='uk-text-small'>{`${appId}`}</td>
                                                                        <td>{role}</td>
                                                                        <td className='uk-visible@s'>
                                                                            <button className='uk-button uk-button-text uk-button-large' onClick={() => deleteUserAppdata(email, appId)} data-uk-tooltip='title: Delete App for this user ; pos: bottom'>
                                                                                <span className='uk-icon' data-uk-icon='icon: trash; ratio: 0.5'></span>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                }
                                            </td>
                                            <td>
                                                {name &&
                                                    <dl className='uk-description-list'>
                                                        <dt> Name:</dt>
                                                        <dd>{`${name} ${surname}`}</dd>
                                                    </dl>
                                                }
                                                {tel &&
                                                    <dl className='uk-description-list'>
                                                        <dt>Phone:</dt>
                                                        <dd>{`${tel}`}</dd>
                                                    </dl>
                                                }
                                                {address1 &&
                                                    <dl className='uk-description-list'>
                                                        <dt >Address: </dt>
                                                        <dd key={address1}>{`${address1} ${address2}`}</dd>
                                                        <dd key={postalCode}>{`${postalCode} ${city} ${province} ${country}`}</dd>
                                                    </dl>
                                                }
                                            </td>
                                            <td className='uk-visible@s'>
                                                <button className='uk-button uk-button-text uk-button-large' onClick={() => deleteUser(email)} data-uk-tooltip='title: Delete User ; pos: bottom'>
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
            {!userList &&
                <Loading />
            }
        </div>
    </div>
}
