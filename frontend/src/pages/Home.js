import React from 'react'
import useStore from '../store/useStore'
export default function Home() {
    
    const {authenticated} = useStore()
    return (
        <div>
            Hi ! you are home.
            {authenticated ? <p>You are logged in</p>:<p>You are not logged in</p>}
        </div>
        
    )
}
