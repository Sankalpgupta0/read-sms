import { PermissionsAndroid, StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import SmsAndroid from "react-native-get-sms-android";

const App = () => {
  const [smsList, setSmsList] = useState([])

  //Lets get permission
  async function requestSmsPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "SMS Permission",
          message: "App needs access to your SMS ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      )

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("SMS Permission Granted");
        return true
      } else {
        console.log("SMS Permission Denied");
        return false
      }

    } catch (err) {
      console.log(err);
      return false;
    }

  }

  useEffect(() => {
    async function fetchSms() {
      const hasPermission = await requestSmsPermission()
      if (hasPermission) {
        SmsAndroid.list(
          JSON.stringify({
            box: "inbox",
            maxCount: 10
          }),
          (fail) => {
            console.log("Failed with this error: " + fail);
          },
          (count, smsList) => {
            const messages = JSON.parse(smsList);
            setSmsList(messages)
          }
        )
      }
    }

    fetchSms()
  }, [])

  const renderItem = ({ item }) => {
    return (
      <View style={{ margin: 10, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>{item.address}</Text>
        <Text style={{}}>{item.body} </Text>
        <Text style={{ color: 'gray', fontSize: 10, }}>{new Date(item.date).toLocaleString()}</Text>
      </View>
    )
  }
    
  return (
      <View style={{ flex: 1, padding: 20}}>
        <FlatList 
        data={smsList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text style={{padding: 10, fontSize: 20, textAlign: 'center'}}>No SMS Found</Text>}
        />
      </View>
    )
  }

  export default App

  const styles = StyleSheet.create({})