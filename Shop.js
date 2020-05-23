import { includes } from 'lodash';
import React, { useEffect } from "react";
import { View, TouchableOpacity, Text } from 'react-native';

export default function Shop({ furnitures, addFurniture, removeFurnitures }) {

  const renderThingInShop = (name, displayName) => (
    <TouchableOpacity
      style={{ height: 30 }}
      onPress={() => includes(furnitures, name) ? removeFurnitures(name) : addFurniture(name)}
    >
      <Text
        style={{ color: includes(furnitures, name) ? 'green' : 'black' }}
      >{displayName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      {renderThingInShop('bed', 'Bed')}
      {renderThingInShop('tv', 'TV setup')}
      {renderThingInShop('rug', 'Rugs')}
      {renderThingInShop('plants', 'Plants')}
      {renderThingInShop('radio', 'Radio')}
      {renderThingInShop('office', 'Office')}
      {renderThingInShop('sofa', 'Sofa')}
    </View>
  );
}