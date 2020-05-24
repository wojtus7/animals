import { includes } from 'lodash';
import React, { useEffect } from "react";
import { View, TouchableOpacity, Text } from 'react-native';

export default function Shop({ isAtWork, experience, startWork, money }) {

  const renderAvailableJob = (name, time, profit, neededExperience) => (
    <TouchableOpacity
      style={{ height: 30 }}
      onPress={() => neededExperience <= experience && !isAtWork ? startWork(name, time, profit) : null}
    >
      <Text
        style={{ color: neededExperience <= experience ? 'green' : money < cost ? 'red' : 'black' }}
      >{name} - {time/60}min - ${profit}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      {renderAvailableJob('Łowienie ryb', 60, 70, 0)}
    </View>
  );
}