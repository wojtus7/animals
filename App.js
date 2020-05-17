import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Expo, { Notifications } from "expo";
import * as Permissions from 'expo-permissions';
import Scene from './Scene'
import { Dimensions } from 'react-native';

export default class App extends React.Component {

  
render() {
  return (
    <View style={styles.container}>
      <View style={{height: Math.round(Dimensions.get('window').height), width: Math.round(Dimensions.get('window').width), position: 'absolute'}}>
        <Scene />
      </View>
      <View style={{height: 50, paddingTop: 150}}>
      <TouchableOpacity
        onPress={async () => {
          const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS,
          );
          console.log(status);
          if (status === 'granted') {
            const lol = await Notifications.scheduleLocalNotificationAsync(
              { title: "title", body: "aezakmi to nowe uzumymw" },
              { time: new Date().getTime() + 5000 }
            );
            console.log(lol);
          }
        }}
      >
        <Text style={{paddingBottom: 20}}>Send Notification</Text>
        <Text style={{paddingBottom: 20}}>Open menu</Text>
        <Text style={{paddingBottom: 20}}>Do some shit IDK</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
      }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
});
