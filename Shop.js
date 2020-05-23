import { includes } from 'lodash';
import React, { useEffect } from "react";
import { View, TouchableOpacity, Text } from 'react-native';

export default function Shop({ furnitures, addFurniture, removeFurnitures, money }) {

  const renderThingInShop = (name, displayName, cost) => (
    <TouchableOpacity
      style={{ height: 30 }}
      onPress={() => includes(furnitures, name) ? removeFurnitures(name, cost) : addFurniture(name, cost)}
    >
      <Text
        style={{ color: includes(furnitures, name) ? 'green' : money < cost ? 'red' : 'black' }}
      >{displayName} - {includes(furnitures, name) ? `sell $${cost/2}` : `buy $${cost}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      {renderThingInShop('bed', 'Bed', 50)}
      {renderThingInShop('tv', 'TV setup', 300)}
      {renderThingInShop('rug', 'Rugs', 75)}
      {renderThingInShop('plants', 'Plants', 100)}
      {renderThingInShop('radio', 'Radio', 150)}
      {renderThingInShop('office', 'Office', 500)}
      {renderThingInShop('sofa', 'Sofa', 250)}
    </View>
  );
}