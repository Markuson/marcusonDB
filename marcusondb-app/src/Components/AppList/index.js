import React from 'react'
import Navbar from '../Navbar'

export default function AppList({
    onAppList,
    onAppRegister,
    onUserList,
    onUserRegister
}) {
    return <div>
        <Navbar onAppList={onAppList} onAppRegister={onAppRegister} onUserList={onUserList} onUserRegister={onUserRegister} selected={'AppList'} />
        <div className=' uk-container uk-flex uk-flex-center '>
            <div className='card uk-width-expand' data-uk-scrollspy="cls:uk-animation-fade">
                <div className='uk-card-body '>
                <table class="uk-table uk-table-striped">
                            <thead>
                                <tr>
                                    <th className='uk-text-emphasis'>App Id</th>
                                    <th className='uk-text-emphasis'>Owner</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Table Data1</td>
                                    <td>Table Data2</td>
                                    <td>Table Data3</td>
                                    <td>Table Data1</td>
                                    <td>Table Data2</td>
                                    <td>Table Data3</td>
                                    <td>Table Data1</td>
                                    <td>Table Data2</td>
                                    <td>Table Data3</td>
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
