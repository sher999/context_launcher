// React
import React, { useEffect } from 'react'
// React Native
import { AppStateStatus, StatusBar, useColorScheme } from 'react-native'
// Redux
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
// Contexts wrappers
import GlobalContextWrapper from './contexts/GlobalContextWrapper'
import SearchContextWrapper from './contexts/SearchContextWrapper'
// Components
import Home from './Home'
import AppItemMenu from './components/AppItemMenu'
import SettingsBottomSheet from './components/SettingsBottomSheet'
// State
import { persistor, store } from './store'
// Gesture Handler
import { GestureHandlerRootView } from 'react-native-gesture-handler'
// Analytics
import analytics from '@react-native-firebase/analytics'
// Hooks
import { useAppState } from './hooks/useAppState'

const App = () => {
  const colorScheme = useColorScheme()

  const logAppOpen = async () => analytics().logAppOpen()

  useAppState((nextState: AppStateStatus) => {
    if (nextState !== 'active') return

    logAppOpen().catch(error => console.error('Error logging app open, error: ', error))
  })

  useEffect(() => {
    if (!colorScheme) StatusBar.setBarStyle('default', true)
    else StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content', true)
  }, [colorScheme])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GlobalContextWrapper>
          <SearchContextWrapper>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Home />
              <AppItemMenu />
              <SettingsBottomSheet />
            </GestureHandlerRootView>
          </SearchContextWrapper>
        </GlobalContextWrapper>
      </PersistGate>
    </Provider>
  )
}

export default App
