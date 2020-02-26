import React from 'react'
import logo from '../../assets/images/logo.png'

function Home({ }) {

    return <div className='card uk-flex uk-flex-center uk-position-center' data-uk-scrollspy="cls:uk-animation-fade">
        <div className='uk-card-body uk-width-large uk-padding uk-text-center'>
            <div className="uk-margin">
                <button className="uk-button uk-button-default">register user</button>
                <button className="uk-button uk-button-default">register app</button>
                <button className="uk-button uk-button-default">view user list</button>
                <button className="uk-button uk-button-default">view app list</button>
            </div>
        </div>
    </div>
}

export default Home