import React from 'react'
import Navbar from '../Navbar'

export default function userList({
    onAppList,
    onAppRegister,
    onUserList,
    onUserRegister
}) {
    return <div>
        <Navbar onAppList={onAppList} onAppRegister={onAppRegister} onUserList={onUserList} onUserRegister={onUserRegister} selected={'UserList'} />
        <div className=' uk-container uk-flex uk-flex-center '>
            <div className='card uk-width-expand' data-uk-scrollspy="cls:uk-animation-fade">
                <div className='uk-card-body '>
                        <table class="uk-table uk-table-striped">
                            <thead>
                                <tr>
                                    <th className='uk-text-emphasis'>Table Heading</th>
                                    <th className='uk-text-emphasis'>Table Heading</th>
                                    <th className='uk-text-emphasis'>Table Heading</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Table Data</td>
                                    <td>Table Data</td>
                                    <td>Table Data</td>
                                </tr>
                                <tr>
                                    <td>Table Data</td>
                                    <td>Table Data</td>
                                    <td>Table Data</td>
                                </tr>
                                <tr>
                                    <td>Table Data</td>
                                    <td>Table Data</td>
                                    <td>Table Data</td>
                                </tr>
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    </div>
}
