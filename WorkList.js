import { includes } from 'lodash';
import React, { useEffect } from "react";
import { View, TouchableOpacity, Text } from 'react-native';

export default function Shop({ isAtWork, experience, startWork }) {

  const renderAvailableJob = (name, time, profit, neededExperience) => (
    <TouchableOpacity
      style={{ height: 30 }}
      onPress={() => neededExperience <= experience && !isAtWork ? startWork(name, time, profit) : null}
    >
      <Text
        style={{ color: neededExperience <= experience ? 'black' : 'red' }}
      >{name} - {time/60}min - ${profit}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      {renderAvailableJob('Fishing', 60, 5, 0)}
      {renderAvailableJob('Selling lemonade', 120, 15, 1)}
      {renderAvailableJob('Work in factory', 360, 50, 3)}
      {renderAvailableJob('Being CEO', 600, 100, 5)}
    </View>
  );
}