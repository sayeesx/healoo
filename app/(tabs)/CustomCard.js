import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements'; // Import Card from react-native-elements

const CustomCard = ({ title, children }) => {
  return (
    <Card containerStyle={cardStyles.container}>
      {title && <Text style={cardStyles.title}>{title}</Text>}
      {children}
    </Card>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    borderRadius: 10,
    elevation: 5, // for shadow on Android
    shadowColor: '#000', // for shadow on iOS
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 10,
    margin: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  
});

export default CustomCard;
