import React from 'react'
import Navbar from '../Navbar'

export default function UserRegister({
    onAppList,
    onAppRegister,
    onUserList,
    onUserRegister
}) {
    return <div>
            <Navbar onAppList={onAppList} onAppRegister={onAppRegister} onUserList={onUserList} onUserRegister={onUserRegister} />
        </div>
}
