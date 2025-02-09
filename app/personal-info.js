import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  Image, 
  StatusBar,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-paper';
import moment from 'moment';
import { useUser } from './context/UserContext';
import { Picker } from '@react-native-picker/picker';
import PhoneInput from './components/PhoneInput';

export default function PersonalInfo() {
  const router = useRouter();
  const { userData: contextUserData, updateUserData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(contextUserData.profileImage);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);
  
  const [editedData, setEditedData] = useState({...contextUserData});

  const personalDetails = [
    { icon: "account", label: "Full Name", key: "name" },
    { icon: "email", label: "Email", key: "email" },
    { icon: "phone", label: "Phone", key: "phone" },
    { icon: "cake-variant", label: "Date of Birth", key: "dateOfBirth" },
    { icon: "map-marker", label: "Address", key: "address" },
    { icon: "gender-male-female", label: "Gender", key: "gender", options: ["Male", "Female", "Other"] },
    { icon: "human-male-height", label: "Height (cm)", key: "height" },
    { icon: "weight", label: "Weight (kg)", key: "weight" },
    { icon: "water", label: "Blood Type", key: "bloodType", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] }
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEditedData({...editedData, dateOfBirth: selectedDate});
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const renderEditField = (item) => {
    switch (item.key) {
      case 'name':
      case 'email':
        return (
          <TextInput
            mode="outlined"
            value={editedData[item.key]}
            onChangeText={(text) => setEditedData({...editedData, [item.key]: text})}
            style={styles.textInput}
            keyboardType={item.key === 'email' ? 'email-address' : 'default'}
            autoCapitalize={item.key === 'email' ? 'none' : 'words'}
            multiline={item.key === 'address'}
            numberOfLines={item.key === 'address' ? 3 : 1}
            outlineColor="#E5E5EA"
            activeOutlineColor="#007AFF"
          />
        );

      case 'phone':
        return (
          <PhoneInput
            value={editedData.phone.replace(/^\+\d+\s*/, '')}
            onChangeText={(text) => {
              const selectedCode = text.includes('+') ? '' : selectedCode;
              setEditedData({...editedData, phone: `${selectedCode} ${text}`.trim()});
            }}
          />
        );

      case 'dateOfBirth':
        return (
          <View>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>
                {moment(editedData.dateOfBirth).format('MMMM D, YYYY')}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (Platform.OS === 'ios' ? (
              <Modal
                transparent={true}
                animationType="slide"
                visible={showDatePicker}
                onRequestClose={() => setShowDatePicker(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setShowDatePicker(false)}
                >
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.modalCancel}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowDatePicker(false);
                        }}
                      >
                        <Text style={styles.modalDone}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={editedData.dateOfBirth}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setEditedData({...editedData, dateOfBirth: selectedDate});
                        }
                      }}
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                      textColor="black"
                      themeVariant="light"
                      style={styles.datePicker}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
            ) : (
              <DateTimePicker
                value={editedData.dateOfBirth}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setEditedData({...editedData, dateOfBirth: selectedDate});
                  }
                }}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            ))}
          </View>
        );

      case 'gender':
        return (
          <View style={styles.genderContainer}>
            {item.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.genderOption,
                  editedData.gender === option && styles.genderOptionSelected
                ]}
                onPress={() => setEditedData({...editedData, gender: option})}
              >
                <Text style={[
                  styles.genderOptionText,
                  editedData.gender === option && styles.genderOptionTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'height':
      case 'weight':
        const isPicker = item.key === 'height' ? showHeightPicker : showWeightPicker;
        const setIsPicker = item.key === 'height' ? setShowHeightPicker : setShowWeightPicker;
        const minValue = 0;
        const maxValue = item.key === 'height' ? 300 : 200;
        const unit = item.key === 'height' ? 'cm' : 'kg';
        
        return (
          <View>
            <TouchableOpacity
              onPress={() => setIsPicker(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>
                {editedData[item.key]} {unit}
              </Text>
            </TouchableOpacity>
            {isPicker && (Platform.OS === 'ios' ? (
              <Modal
                transparent={true}
                animationType="slide"
                visible={isPicker}
                onRequestClose={() => setIsPicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <TouchableOpacity onPress={() => setIsPicker(false)}>
                        <Text style={styles.modalCancel}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setIsPicker(false)}>
                        <Text style={styles.modalDone}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={editedData[item.key].toString()}
                        onValueChange={(value) => 
                          setEditedData({...editedData, [item.key]: value})
                        }
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                      >
                        {Array.from(
                          { length: maxValue + 1 },
                          (_, i) => i.toString()
                        ).map((value) => (
                          <Picker.Item 
                            key={value} 
                            label={`${value} ${unit}`} 
                            value={value}
                            color="black"
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
              </Modal>
            ) : (
              <Picker
                selectedValue={editedData[item.key].toString()}
                onValueChange={(value) => {
                  setEditedData({...editedData, [item.key]: value});
                  setIsPicker(false);
                }}
                mode="dropdown"
              >
                {Array.from(
                  { length: maxValue + 1 },
                  (_, i) => i.toString()
                ).map((value) => (
                  <Picker.Item 
                    key={value} 
                    label={`${value} ${unit}`} 
                    value={value}
                  />
                ))}
              </Picker>
            ))}
          </View>
        );

      case 'address':
        return (
          <TextInput
            mode="outlined"
            value={editedData.address}
            onChangeText={(text) => setEditedData({...editedData, address: text})}
            style={[styles.textInput, { height: 60 }]}
            multiline={true}
            numberOfLines={2}
            outlineColor="#E5E5EA"
            activeOutlineColor="#007AFF"
            dense={true}
          />
        );

      default:
        return null;
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validation
      if (!editedData.name.trim()) {
        Alert.alert('Error', 'Name is required');
        return;
      }
      if (!editedData.email.includes('@')) {
        Alert.alert('Error', 'Please enter a valid email');
        return;
      }

      // Generate new patient ID based on name and DOB
      const nameParts = editedData.name.split(' ');
      const initials = nameParts.map(part => part[0]).join('');
      const dobDate = new Date(editedData.dateOfBirth);
      const dobString = moment(dobDate).format('DDMMYY');
      const newPatientId = `${initials}${dobString}`;

      const updatedData = {
        ...editedData,
        profileImage: profileImage,
        patientId: newPatientId.toUpperCase()
      };

      setUserData(updatedData);
      updateUserData(updatedData);
      setIsEditing(false);

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={pickImage}
            disabled={!isEditing}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfile}>
                <Icon name="account" size={50} color="#FFFFFF" />
              </View>
            )}
            {isEditing && (
              <View style={styles.editOverlay}>
                <Icon name="camera" size={20} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
          {isEditing && (
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          )}
        </View>

        <View style={styles.section}>
          {personalDetails.map((item, index) => (
            <View key={index} style={[
              styles.detailItem,
              index === personalDetails.length - 1 && styles.lastDetailItem
            ]}>
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={24} color="#007AFF" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.label}>{item.label}</Text>
                {isEditing ? (
                  renderEditField(item)
                ) : (
                  <Text style={styles.value}>
                    {item.key === 'dateOfBirth' 
                      ? moment(contextUserData[item.key]).format('MMMM D, YYYY')
                      : item.key === 'height'
                      ? `${contextUserData[item.key]} cm`
                      : item.key === 'weight'
                      ? `${contextUserData[item.key]} kg`
                      : contextUserData[item.key]}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  profileImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  defaultProfile: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  lastDetailItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    paddingRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000000',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    height: 40,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
  },
  picker: {
    height: 200,
    width: '100%',
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginTop: 4,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  iosDatePicker: {
    height: 250,
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  genderOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  genderOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F6FF',
  },
  genderOptionText: {
    fontSize: 14,
    color: '#666666',
  },
  genderOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
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
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalCancel: {
    color: '#FF3B30',
    fontSize: 17,
  },
  modalDone: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  datePicker: {
    height: 200,
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width,
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    height: 200,
    overflow: 'hidden',
  },
  pickerItem: {
    fontSize: 20,
    color: 'black',
  },
}); 