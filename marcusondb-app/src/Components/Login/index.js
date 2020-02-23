import React from 'react'
import logo from '../../assets/images/logo.png'

function Login({ onLogin }) {

    function handleSubmit(e) {
        e.preventDefault()

        const username = e.target.username.value
        const password = e.target.password.value

        onLogin(username, password)
    }

    return <div className='card uk-flex uk-flex-center uk-position-center' data-uk-scrollspy="cls:uk-animation-fade">
        <div className='uk-card-body uk-width-large uk-padding uk-text-center'>
            <div>
                <img alt='WOTcon logo' width="220" height="220" src={logo} />
                <p className="select-none subtitle"> The marcusonDB</p>
            </div >
            <form className="uk-form-stacked" onSubmit={handleSubmit} >
                <div>
                    <input className="uk-input uk-form-small uk-form-width-medium" type="text" name="username" placeholder="email" />
                </div>
                <div>
                    <input className="uk-input uk-form-small uk-form-width-medium" type="password" name="password" placeholder="password" />
                </div>
                <div className="uk-margin">
                    <button className="uk-button uk-button-default">Sign In</button>
                </div>
            </form>
        </div>
    </div>
}

export default Login