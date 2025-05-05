import React from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '../resources/routes-constants'

const NotFoundPage = () => {
    const navigate = useNavigate()

    /**
     * Call this function to redirect the user to the homepage.
     */
    const redirectToHomePage = () => {
        navigate(ROUTES.HOMEPAGE_ROUTE)
    }

    return (
        <>
            <title>
            {(`${process.env.REACT_APP_APP_NAME} - 404`)}
            </title>

            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <h1 style={{ fontSize: '4em' }}>Oops 404!</h1>
                <span style={{ cursor: 'pointer' }} onClick={() => redirectToHomePage()}>
                    &lt;&lt; Homepage
                </span>
            </div>
        </>
    )
}

export default NotFoundPage
