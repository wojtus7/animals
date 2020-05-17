import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Expo, { Notifications } from "expo";
import * as Permissions from 'expo-permissions';
import Scene from './Scene'

export default class App extends React.Component {

  
render() {
  return (
    <View style={styles.container}>
      <View style={{height: 800, width: 500}}>
        <Scene />
      </View>
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
      </TouchableOpacity>
    </View>
  );
      }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
