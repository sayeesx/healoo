import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const countryCodes = [
  { code: '+1', country: 'US/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+61', country: 'Australia' },
  { code: '+64', country: 'New Zealand' },
  // Add more country codes as needed
];

export default function PhoneInput({ value, onChangeText }) {
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+1');

  const handleCodeSelect = (code) => {
    setSelectedCode(code);
    setShowCountryPicker(false);
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleCodeSelect(item.code)}
    >
      <Text style={styles.countryCode}>{item.code}</Text>
      <Text style={styles.countryName}>{item.country}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.codeButton}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text style={styles.codeText}>{selectedCode}</Text>
          <Icon name="chevron-down" size={20} color="#666666" />
        </TouchableOpacity>
        <TextInput
          mode="outlined"
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          style={styles.input}
          outlineColor="#E5E5EA"
          activeOutlineColor="#007AFF"
          dense
        />
      </View>

      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country Code</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={countryCodes}
              renderItem={renderCountryItem}
              keyExtractor={item => item.code}
              style={styles.countryList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  codeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  codeText: {
    fontSize: 16,
    color: '#000000',
    marginRight: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  modalClose: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  countryList: {
    padding: 8,
  },
  countryItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  countryCode: {
    fontSize: 16,
    color: '#000000',
    width: 60,
  },
  countryName: {
    fontSize: 16,
    color: '#666666',
  },
}); 