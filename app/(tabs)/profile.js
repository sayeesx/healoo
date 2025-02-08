import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import PatientCard from '../components/PatientCard';

export default function Profile() {
  const navigation = useNavigation(); // Use useNavigation hook
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Default avatar image
  const defaultAvatar = require('../../assets/default-avatar.png');

  // Handle profile picture upload from library
  const handleUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Camera roll permissions required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  // Handle camera capture
  const handleCameraCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Camera permissions required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  // Handle logout
  const handleLogout = () => {
    setShowLogoutModal(false);
    // Use navigation.navigate or replace based on your routing setup
    navigation.navigate('(auth)/Login'); // or navigation.replace('Login')
  };

  // Image selection method
  const selectProfileImage = () => {
    Alert.alert(
      'Choose Profile Picture',
      'Select image source',
      [
        { 
          text: 'Take Photo', 
          onPress: handleCameraCapture 
        },
        { 
          text: 'Choose from Library', 
          onPress: handleUploadImage 
        },
        { 
          text: 'Cancel', 
          style: 'cancel' 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header with Gradient */}
        <LinearGradient
          colors={['#6B4EFF', '#8A6EFF']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={selectProfileImage}>
              <Image 
                source={profileImage || defaultAvatar}
                style={styles.avatar}
              />
              <View style={styles.cameraIcon}>
                <Icon name="camera" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.name}>Siyam Ahamed</Text>
            <Text style={styles.email}>siyam@example.com</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Icon name="pencil" size={16} color="#6B4EFF" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Patient Card Component */}
        <PatientCard 
          profileImage={profileImage || defaultAvatar}
          name="Siyam Ahamed"
          age={28}
          dateOfBirth="15/06/1995"
          bloodType="A+"
          phoneNumber="+1 (555) 123-4567"
          uniqueCode="PAT-2024-0001"
        />

        {/* Profile Menu */}
        <View style={styles.menuSection}>
          {[
            { icon: 'bell-outline', text: 'Notifications' },
            { icon: 'security', text: 'Security' },
            { icon: 'credit-card-outline', text: 'Payment Methods' },
            { icon: 'theme-light-dark', text: 'Appearance' },
            { icon: 'help-circle-outline', text: 'Help & Support' },
            { icon: 'information-outline', text: 'About App' },
          ].map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.menuItem}
              onPress={() => {/* Add navigation for each item */}}
            >
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={24} color="#6B4EFF" />
              </View>
              <Text style={styles.menuText}>{item.text}</Text>
              <Icon name="chevron-right" size={24} color="#D1D1D6" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
        >
          <Icon name="logout" size={20} color="#FF4B4B" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>

        {/* Logout Confirmation Modal */}
        <Modal
          visible={showLogoutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Log Out</Text>
              <Text style={styles.modalText}>Are you sure you want to log out?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleLogout}
                >
                  <Text style={styles.confirmButtonText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FB',
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#6B4EFF',
    borderRadius: 20,
    padding: 6,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  editButtonText: {
    marginLeft: 8,
    color: '#6B4EFF',
    fontWeight: '600',
  },
  menuSection: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(107,78,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4B4B',
  },
  version: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
    fontSize: 12,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#FF4B4B',
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: '500',
  },
});