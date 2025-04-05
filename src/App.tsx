import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import RootComponent from './RootComponent'
import { persistor, store } from './store/reducers/store'
import './styles/App.css'
import { setupGlobalInputSanitizer } from './utility/inputSanitizer'

const App: React.FC = () => {
    useEffect(() => {
        setupGlobalInputSanitizer();
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RootComponent />
            </PersistGate>
        </Provider>
    )
}

export default App
