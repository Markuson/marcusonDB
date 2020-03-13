import React from 'react'

import Loading from '../Loading'
import Uikit from 'uikit/dist/js/uikit.min.js'

export default function userList({
    appList,
    onUserAppDataAdd,
    onUserAppDataDelete,
    onUserDelete,
    selectedMail,
    setSelectedMail,
    userList
}) {

    const addUserAppdata = async (e) => {
        const {role:{value: role}, appId: {value: appId}} = e.target
        e.preventDefault()
        Uikit.modal('#appAdd-modal').hide()
        onUserAppDataAdd(selectedMail, appId, role )
    }

    const deleteUser = (appId) => {
        onUserDelete(appId)
    }

    const deleteUserAppdata = (email, appId) => {
        onUserAppDataDelete(email, appId)
    }

    return <div>
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
                                    userList.map(({ email, appData, userData: { name, surname, contact: { address1, address2, tel, city, province, postalCode, country } } }) => {
                                        return <tr key={email}>
                                            <td>{email}</td>
                                            <td>
                                                {!!appData.length &&
                                                    <table className='uk-table uk-table-divider'>
                                                        <thead>
                                                            <tr>
                                                                <th>App</th>
                                                                <th>Role</th>
                                                                <th>
                                                                    <button className='uk-button uk-button-text uk-button-large' onClick={() => {setSelectedMail(email); Uikit.modal('#appAdd-modal').show()}} data-uk-tooltip='title: add new App for this user ; pos: bottom'>
                                                                        <span className='uk-icon' data-uk-icon='icon: plus; ratio: 0.5'></span>
                                                                    </button>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                appData.map(({ _id: id, appId, role }) => {
                                                                    return <tr key={id}>
                                                                        <td className='uk-text-small'>{`${appId}`}</td>
                                                                        <td>{role}</td>
                                                                        <td>
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
                                            <td className='uk-visible@s'>
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
        <div id="appAdd-modal" data-uk-modal>
            <div className="uk-modal-dialog uk-modal-body">
                <form id='newUserForm' className='uk-form' onSubmit={addUserAppdata}>
                    <fieldset className='uk-fieldset'>
                        <legend className='uk-legend uk-text-emphasis'>Select App to add</legend>
                        <div className='uk-margin-small'>
                            <select name='appId' className='uk-select'>
                                <option value=''>Choose App</option>
                                {appList &&
                                    appList.map(({ appId }) => {
                                        return <option key={appId} value={appId}>{appId}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className='uk-margin-small'>
                            <div className='uk-margin-small uk-grid-small uk-child-width-auto uk-grid'>
                                <label className='uk-text-emphasis uk-width-1-3@s'>
                                    <input className='uk-radio' type='radio' name='role' value={'user'} defaultChecked /> user
                                </label>
                                <label className='uk-text-emphasis uk-width-1-3@s'>
                                    <input className='uk-radio' type='radio' name='role' value={'owner'} /> owner
                                </label>
                                <label className='uk-text-emphasis uk-width-1-3@s'>
                                    <input className='uk-radio' type='radio' name='role' value={'god'} /> GOD
                                </label>
                            </div>
                        </div>
                        <div className='uk-margin-small'>
                            <button className='uk-button uk-button-default uk-width-1-2 uk-text-emphasis' >Select App</button>
                            <button className="uk-modal-close uk-button uk-button-default uk-width-1-2 uk-text-emphasis" type="button">Cancel</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
}
