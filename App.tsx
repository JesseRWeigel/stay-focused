import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  AsyncStorage,
  Vibration,
  Platform,
} from 'react-native'
import { Notion } from '@neurosity/notion'

export default function App() {
  const [notion, setNotion] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deviceId, setDeviceId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focus, setFocus] = useState(0)
  const [bgColor, setBgColor] = useState<'#fff' | 'red'>('#fff')
  const [intervalId, setIntervalId] = useState(null)
  const [notifications, setNotifications] = useState(false)

  useEffect(() => {
    if (!user || !notion) {
      return
    }

    const subscription = notion.focus().subscribe((focus) => {
      setFocus(Number(focus.probability.toFixed(2)))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user, notion])

  useEffect(() => {
    ;(async () => {
      const id = await AsyncStorage.getItem('deviceId')
      if (id) {
        setDeviceId(id)
      }
    })()
    if (Platform.OS === 'web') {
      notificationInit()
    }
  }, [])

  useEffect(() => {
    if (deviceId) {
      const notion = new Notion({ deviceId })
      setNotion(notion)
    } else {
      setLoading(false)
    }
  }, [deviceId])

  const init = () => {
    if (deviceId === 'test') {
      initDemo()
    }
    AsyncStorage.setItem('deviceId', deviceId)
    const thisNotion = new Notion({ deviceId })
    setNotion(thisNotion)
  }

  const initDemo = () => {
    setUser(true)
    setIntervalId(
      setInterval(() => {
        setFocus(Math.random())
      }, 1000)
    )
  }

  useEffect(() => {
    if (!notion) {
      return
    }

    const subscription = notion.onAuthStateChanged().subscribe((user) => {
      if (user) {
        setUser(user)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [notion])

  function resetState() {
    setNotion(null)
    setUser(null)
    setDeviceId('')
  }

  useEffect(() => {
    if (!user && notion && email && password) {
      login()
    }
    async function login() {
      const auth = await notion.login({ email, password }).catch((error) => {
        console.log(error)
      })

      if (auth) {
        setUser(auth.user)
      }
    }
  }, [email, notion])

  useEffect(() => {
    if (user) {
      if (focus < 0.2) {
        setBgColor('red')
        Vibration.vibrate(10000)
        if (notifications) {
          new Notification('Stay focused!')
        }
      } else {
        setBgColor('#fff')
        Vibration.cancel()
      }
    }
  }, [focus, user])

  const notificationInit = () => {
    // Let's check if the browser supports notifications
    if ('Notification' in window) {
      // Let's check whether notification permissions have already been granted
      if (Notification.permission === 'granted') {
        // If it's okay let's create a notification
        setNotifications(true)
      }

      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === 'granted') {
            setNotifications(true)
          } else {
            setNotifications(false)
          }
        })
      }
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }

  const logout = () => {
    notion.logout()
    setUser(null)
    clearInterval(intervalId)
    setFocus(0)
    setBgColor('#fff')
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: bgColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading: {
      fontSize: 24,
      marginBottom: 16,
    },
    input: {
      height: 40,
      width: '100%',
      maxWidth: 260,
      borderColor: 'gray',
      borderWidth: 1,
      marginVertical: 8,
      paddingHorizontal: 4,
    },
    focusText: {
      fontSize: 18,
      marginBottom: 8,
    },
  })

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.heading}>Notion Linked!</Text>
          <Text style={styles.focusText}>{`Focus: ${(focus * 100).toFixed(
            0
          )}%`}</Text>
          <Button title="Logout" onPress={() => logout()} />
        </>
      ) : (
        <>
          <Text style={styles.heading}>Link your Notion</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setDeviceId(text)}
            value={deviceId}
            placeholder="Device ID"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Password"
            textContentType="password"
            autoCompleteType="password"
            secureTextEntry={true}
          />
          <Button
            title="Submit"
            onPress={() => init()}
            accessibilityLabel="Submit"
          />
        </>
      )}
    </View>
  )
}
