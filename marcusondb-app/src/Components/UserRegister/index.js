import React from 'react'

export default function UserRegister({
    appList,
    onUserSubmit
}) {
    const handleSubmit = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        const userData = {
            name: e.target.name.value,
            surname: e.target.surname.value,
            contact: {
                tel: e.target.phone.value,
                address1: e.target.address1.value,
                address2: e.target.address2.value,
                city: e.target.city.value,
                province: e.target.province.value,
                postalCode: e.target.postalcode.value,
                country: e.target.country.value
            }
        }
        const appData = e.target.appId.value ? {
            appId: e.target.appId.value,
            role: e.target.role.value
        } : undefined
        onUserSubmit(email, password, userData, appData)
    }

    return <div className=' uk-container uk-flex uk-flex-center '>
        <div className='card uk-width-large ' data-uk-scrollspy="cls:uk-animation-fade">
            <div className='uk-card-body '>
                <div className='uk-flex uk-flex-center uk-margin-small'>
                    <form id='newUserForm' className='uk-form' onSubmit={handleSubmit}>
                        <fieldset className='uk-fieldset'>
                            <legend className='uk-legend uk-text-emphasis'>Basic Data</legend>

                            <div className=''>
                                <input className='uk-input' type='text' name='email' placeholder='email' />
                            </div>

                            <div className='uk-margin-small'>
                                <input className='uk-input' type='password' name='password' placeholder='password' />
                            </div>

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
                        </fieldset>

                        <fieldset className='uk-fieldset'>
                            <legend className='uk-legend uk-text-emphasis'>Additional Data</legend>
                            <div className='uk-grid-small uk-grid'>
                                <div className='uk-width-1-2@s'>
                                    <input className='uk-input' type='text' name='name' placeholder='name' />
                                </div>
                                <div className='uk-width-1-2@s'>
                                    <input className='uk-input' type='text' name='surname' placeholder='surname' />
                                </div>
                                <div className='uk-width-1-1 uk-margin-small-top'>
                                    <input className='uk-input' type='text' name='phone' placeholder='Phone Number' />
                                </div>
                                <div className='uk-width-1-1  uk-margin-small-top'>
                                    <input className='uk-input' type='text' name='address1' placeholder='Address 1' />
                                </div>
                                <div className='uk-width-1-1  uk-margin-small-top'>
                                    <input className='uk-input' type='text' name='address2' placeholder='Address 2' />
                                </div>
                                <div className='uk-width-1-2@s uk-margin-small-top'>
                                    <input className='uk-input' type='text' name='city' placeholder='City' />
                                </div>
                                <div className='uk-width-1-2@s uk-margin-small-top'>
                                    <input className='uk-input' type='text' name='province' placeholder='Province' />
                                </div>
                                <div className='uk-width-1-2@s uk-margin-small-top'>
                                    <input className='uk-input' type='text' name='postalcode' placeholder='Postal Code' />
                                </div>
                                <div className='uk-width-1-2@s uk-margin-small-top'>
                                    <input className='uk-input' type='text' name='country' placeholder='Country' />
                                </div>
                            </div>

                            <div className='uk-margin-small'>
                                <button className='uk-button uk-button-default uk-width-1-1 uk-text-emphasis' >Register New User</button>
                            </div>
                        </fieldset>


                    </form>
                </div>
            </div>
        </div>
    </div>
}
