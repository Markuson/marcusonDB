import React from 'react'
import ReactLoading from 'react-loading'

import './index.css'

export default function Loading() {
    return (
        <div className='container'>
            <ReactLoading type={'bubbles'} color={'#FFFFFF'} height={'100px'} width={'100px'} /> 
        </div>
    )
}
