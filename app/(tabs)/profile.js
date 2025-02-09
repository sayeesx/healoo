"use client"
import { useState } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Dimensions, Alert } from "react-native"
import { useRouter } from "expo-router"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import PatientCard from '../components/PatientCard'
import { useUser } from '../context/UserContext'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'

const windowWidth = Dimensions.get("window").width

export default function Profile() {
  const router = useRouter()
  const { userData } = useUser()
  const [profileImage, setProfileImage] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)

  const sections = [
    {
      id: 'personal',
      title: "Personal Information",
      icon: "account-details",
      description: "View and edit your personal details",
      onPress: () => router.push("/personal-info")
    },
    {
      id: 'medical',
      title: "Medical Information",
      icon: "medical-bag",
      onPress: () => router.push("/medical-info"),
      description: "View your medical details"
    },
    {
      id: 'emergency',
      title: "Emergency Contact",
      icon: "phone-alert",
      onPress: () => router.push("/emergency-contacts"),
      description: "Manage emergency contacts"
    },
    {
      id: 'appointments',
      title: "My Appointments",
      icon: "calendar-clock",
      onPress: () => router.push("/appointments"),
      description: "View and manage your appointments"
    },
    {
      id: 'records',
      title: "Medical Records",
      icon: "file-document-outline",
      onPress: () => router.push("/records"),
      description: "Access your health documents"
    },
    {
      id: 'prescriptions',
      title: "Prescriptions",
      icon: "pill",
      onPress: () => router.push("/prescriptions"),
      description: "View your medications"
    },
    {
      id: 'lab',
      title: "Lab Results",
      icon: "flask-outline",
      onPress: () => router.push("/lab-results"),
      description: "Check your test results"
    },
    {
      id: 'help',
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => router.push("/help"),
      description: "Get help and contact support"
    },
    {
      id: 'logout',
      title: "Logout",
      icon: "logout",
      onPress: () => {
        Alert.alert(
          "Logout",
          "Are you sure you want to logout?",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Logout", 
              style: "destructive",
              onPress: () => router.replace("/login")
            }
          ]
        )
      },
      description: "Sign out of your account"
    }
  ];

  const handleUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Camera roll permissions required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      router.replace('./(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const menuItems = [
    { 
      icon: 'account-edit-outline', 
      text: 'Edit Profile',
      onPress: () => router.push('/(tabs)/editProfile')
    },
    { 
      icon: 'cog-outline', 
      text: 'Settings',
      onPress: () => router.push('/settings')
    },
    { 
      icon: 'bell-outline', 
      text: 'Notifications',
      onPress: () => router.push('/notifications')
    },
    { 
      icon: 'clipboard-text-outline', 
      text: 'Transaction History',
      onPress: () => router.push('/transactions')
    },
    { 
      icon: 'help-circle-outline', 
      text: 'FAQ',
      onPress: () => router.push('/faq')
    },
    { 
      icon: 'information-outline', 
      text: 'About App',
      onPress: () => router.push('/about')
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/settings")}
        >
          <Icon name="cog" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <PatientCard
          name={userData.name}
          dateOfBirth={userData.dateOfBirth}
          bloodType={userData.bloodType}
          phoneNumber={userData.phone}
          uniqueCode={userData.patientId}
          profileImage={userData.profileImage}
          gender={userData.gender}
        />

        <View style={styles.sectionsContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.section}
              onPress={item.onPress}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={styles.itemIconContainer}>
                    <Icon name={item.icon} size={24} color="#007AFF" />
                  </View>
                  <View style={styles.sectionContent}>
                    <Text style={styles.sectionTitle}>{item.text}</Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={24} color="#C7C7CC" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  defaultProfile: {
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 2,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
  profileId: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  sectionsContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  logoutIcon: {
    backgroundColor: '#FFF2F2',
  },
  logoutText: {
    color: '#FF3B30',
  },
})
