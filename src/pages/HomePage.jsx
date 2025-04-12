import React from 'react'
import DateDisplay from '../components/DateDisplay'

const HomePage = () => {
    return (
        <>
            <title>
                {(`${process.env.REACT_APP_APP_NAME}`)}
            </title>

            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <h1 style={{ fontSize: '4em' }}>Hello world!</h1>
                <DateDisplay />
            </div>
        </>
    )
}

export default HomePage
