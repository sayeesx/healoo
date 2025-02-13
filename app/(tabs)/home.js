"use client"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Easing,
  Linking,
} from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { typography } from "../constants/fonts"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { BlurView } from "expo-blur"
import { useFonts, Inter_700Bold, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useShakeAnimation } from '../../hooks/useShakeAnimation';
import { useSirenAnimation } from '../../hooks/useSirenAnimation';
import { useSearchPlaceholder } from '../../hooks/useSearchPlaceholder';
import { useIntroAnimation } from '../../hooks/useIntroAnimation';
import { specialties, popularDoctors, hospitals, hospitalLogos } from '../data/constants';
import { supabase } from '../../lib/supabase';
import { SkeletonImage } from '../../hooks/SkeletonImage';
import Header from '../../components/header';

const { width } = Dimensions.get("window")

const safeStyleCreate = (baseStyle = {}, additionalStyle = {}) => {
  try {
    return { ...baseStyle, ...additionalStyle }
  } catch (error) {
    console.error("Error creating style:", error)
    return baseStyle
  }
}

const getSupabaseImageUrl = (path) => {
  if (!path) return null;
  return `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/hospitals/${path}`;
};

export default function Home() {
  const router = useRouter()
  const [fontsLoaded] = useFonts({ 
    Inter_400Regular,
    Inter_500Medium, 
    Inter_600SemiBold,
    Inter_700Bold 
  });
  
  // State hooks
  const [notifications, setNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false)
  const [userName, setUserName] = useState("Hello")
  const [isLoading, setIsLoading] = useState(true)
  const [hospitalData, setHospitalData] = useState([])

  // Custom hooks
  const bellAnim = useShakeAnimation()
  const sirenAnim = useSirenAnimation()
  const searchPlaceholder = useSearchPlaceholder()
  const { introBoxWidth, introBoxOpacity, introTextOpacity, introText } = useIntroAnimation(userName)
  const hospitalCardAnimations = useRef(hospitals.map(() => new Animated.Value(0))).current

  // Data fetching functions using useCallback
  const fetchHospitalData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // First try to fetch from local storage
      const cachedData = await AsyncStorage.getItem('hospitalData');
      if (cachedData) {
        setHospitalData(JSON.parse(cachedData));
      }

      // Then try to fetch from Supabase
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Supabase error:", error);
        // If network fails, use the constants data as fallback
        setHospitalData(hospitals);
        return;
      }

      if (data) {
        setHospitalData(data);
        // Cache the data
        await AsyncStorage.setItem('hospitalData', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Failed to fetch hospital data:", error);
      // Use constants data as fallback
      setHospitalData(hospitals);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserName(userData.name ? `Hello ${userData.name}` : "Hello");
      } else {
        setUserName("Hello");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setUserName("Hello");
    }
  }, []);

  // All useCallback hooks should be defined here, before any conditional returns
  const handleSeeAllHospitals = useCallback(() => {
    router.push('/hospitals');
  }, [router]);

  const createSafeAnimationStyle = useCallback((animValue, index) => {
    if (!animValue || typeof animValue.interpolate !== "function") {
      return {};
    }

    // First card doesn't animate
    if (index === 0) {
      return {
        opacity: 1,
        transform: [
          { translateY: 0 },
          { scale: 1 },
        ],
        shadowOpacity: 0.2,
      };
    }

    return {
      opacity: animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
        extrapolate: "clamp",
      }),
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0], // Cards come from bottom
            extrapolate: "clamp",
          }),
        },
        {
          scale: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
            extrapolate: "clamp",
          }),
        },
      ],
      shadowOpacity: animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 0.2],
        extrapolate: "clamp",
      }),
    };
  }, []);

  const renderHospitalCard = useCallback(
    (hospital, index) => {
      if (!hospital || typeof hospital !== "object") {
        console.warn("Invalid hospital data:", hospital);
        return null;
      }

      const animationStyle = createSafeAnimationStyle(hospitalCardAnimations[index], index) || {};
      const imageUrl = getSupabaseImageUrl(hospital.image_path);
      const logoUrl = getSupabaseImageUrl(hospital.logo_path);

      return (
        <Animated.View
          key={hospital.id || `hospital-${index}`}
          style={[styles.hospitalCardContainer, animationStyle]}
        >
          <TouchableOpacity
            style={[styles.hospitalCard]}
            onPress={() => router.push(`/hospitals/${hospital.id}`)}
          >
            <SkeletonImage 
              source={imageUrl ? { uri: imageUrl } : null}
              style={styles.hospitalImage}
              resizeMode="cover"
            />
            <BlurView 
              intensity={60}
              tint="light"
              style={[styles.hospitalInfoOverlay, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}
            >
              <View style={styles.hospitalInfo}>
                <View style={styles.nameContainer}>
                  <SkeletonImage 
                    source={logoUrl ? { uri: logoUrl } : null}
                    style={styles.hospitalLogo}
                    resizeMode="contain"
                  />
                  <View style={styles.textContainer}>
                    <Text style={[styles.hospitalName, { fontFamily: 'Inter_600SemiBold' }]}>{hospital.name}</Text>
                    <Text style={[styles.hospitalLocation, { fontFamily: 'Inter_900SemiBold' }]}>{hospital.location}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.bookNowButton}
                onPress={() => router.push(`/hospitals/${hospital.id}`)}
              >
                <Text style={[styles.bookNowText, { fontFamily: 'Inter_500Medium' }]}>Book now</Text>
              </TouchableOpacity>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [hospitalCardAnimations, createSafeAnimationStyle, router],
  )

  const renderHospitalCardsSection = useCallback(() => {
    if (isLoading) {
      return Array(3)
        .fill()
        .map((_, index) => <HospitalCardSkeleton key={`skeleton-${index}`} />)
    }

    if (!Array.isArray(hospitalData) || hospitalData.length === 0) {
      return (
        <View style={styles.noHospitalsContainer}>
          <Text style={styles.noHospitalsText}>No hospitals found</Text>
        </View>
      )
    }

    return hospitalData.map(renderHospitalCard)
  }, [isLoading, hospitalData, renderHospitalCard])

  const onScrollHandler = useCallback(
    (event) => {
      const scrollY = event.nativeEvent.contentOffset.y;
      hospitalData.forEach((_, index) => {
        // Skip the first card
        if (index === 0) return;

        const cardPosition = index * 220;
        const scrollThreshold = cardPosition - 400;
        
        if (scrollY > scrollThreshold) {
          Animated.spring(hospitalCardAnimations[index], {
            toValue: 1,
            tension: 35, // Reduced tension for slower animation
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      });
    },
    [hospitalData, hospitalCardAnimations],
  )

  // Effects
  useEffect(() => {
    fetchHospitalData()
  }, [fetchHospitalData])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  useEffect(() => {
    // Set first card's animation value to 1 immediately
    if (hospitalCardAnimations[0]) {
      hospitalCardAnimations[0].setValue(1);
    }
  }, [hospitalCardAnimations]);

  // Now we can safely return early if fonts aren't loaded
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const handleNotification = () => {
    console.log("Notification clicked")
  }

  const handleSearch = () => {
    console.log("Searching for:", searchQuery)
  }

  const handleSpecialtyPress = (specialty) => {
    router.push(`/specialty/${specialty.name.toLowerCase()}`)
  }

  const handleEmergency = () => {
    setShowEmergencyPopup(true)
  }

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`)
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const shimmerAnimation = () => {
    const shimmerTranslate = new Animated.Value(0)

    Animated.loop(
      Animated.timing(shimmerTranslate, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start()

    return {
      transform: [
        {
          translateX: shimmerTranslate.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, width],
          }),
        },
      ],
    }
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.scrollView} 
        onScroll={onScrollHandler} 
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontFamily: 'Inter_600SemiBold' }]}>Specialties</Text>
            <TouchableOpacity onPress={() => router.push("/all-specialties")}>
              <Text style={[styles.seeAll, { fontFamily: 'Inter_400Regular' }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialtyScroll}>
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty.id}
                style={styles.specialtyContainer}
                onPress={() => handleSpecialtyPress(specialty)}
              >
                <View style={styles.specialtyIconContainer}>
                  <Icon name={specialty.icon} size={24} color="#fff" />
                </View>
                <View style={styles.specialtyTextContainer}>
                  <Text style={[styles.specialtyName, { fontFamily: 'Inter_600SemiBold' }]}>{specialty.name}</Text>
                  <Text style={[styles.doctorsCount, { fontFamily: 'Inter_400Regular' }]}>{specialty.doctorsAvailable} Doctors</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Inter_600SemiBold' }]}>    Popular Doctors</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doctorsScroll}>
            {popularDoctors.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                <BlurView intensity={80} tint="light" style={styles.doctorCardContent}>
                  <View style={styles.doctorImageContainer}>
                    <Image source={doctor.image} style={styles.doctorImage} resizeMode="cover" />
                  </View>
                  <View style={styles.doctorInfo}>
                    <Text style={[styles.doctorName, { fontFamily: 'Inter_600SemiBold' }]} numberOfLines={1}>
                      {doctor.name}
                    </Text>
                    <View style={styles.specialtyChip}>
                      <Icon name={doctor.specialtyIcon} size={14} color="#3B39E4" />
                      <Text style={[styles.specialtyText, { fontFamily: 'Inter_400Regular' }]}>{doctor.specialty}</Text>
                    </View>
                    <Text style={[styles.fieldOfStudy, { fontFamily: 'Inter_400Regular' }]} numberOfLines={2}>
                      {doctor.fieldOfStudy}
                    </Text>
                    <TouchableOpacity style={styles.bookingButton}>
                      <Text style={[styles.bookingButtonText, { fontFamily: 'Inter_400Regular' }]}>Book Now</Text>
                      <Icon name="calendar-plus" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.hospitalSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontFamily: 'Inter_600SemiBold' }]}>Hospitals</Text>
            <TouchableOpacity onPress={handleSeeAllHospitals}>
              <Text style={[styles.seeAllText, { fontFamily: 'Inter_500Medium' }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hospitalCardContainer}>{renderHospitalCardsSection()}</View>
        </View>
      </ScrollView>

      {showEmergencyPopup && (
        <TouchableOpacity
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0, 0, 255, 0.5)", // Blue background with transparency
            color: "white", // White text
            backdropFilter: "blur(5px)", // Blur effect
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() => setShowEmergencyPopup(false)}
        >
          <View style={styles.emergencyPopup}>
            <View style={styles.emergencyHeader}>
              <Text style={[styles.emergencyTitle, { fontFamily: 'Inter_700Bold' }]}>Emergency Contacts</Text>
              <TouchableOpacity onPress={() => setShowEmergencyPopup(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.emergencyContent}>
              <View style={styles.emergencySection}>
                <Text style={[styles.emergencySectionTitle, { fontFamily: 'Inter_600SemiBold' }]}>Emergency Numbers</Text>
                <View style={styles.contactItem}>
                  <View style={styles.contactInfo}>
                    <Icon name="phone-alert" size={24} color="#FF0000" />
                    <Text style={[styles.contactText, { fontFamily: 'Inter_400Regular' }]}>Emergency Services</Text>
                  </View>
                  <TouchableOpacity style={styles.callButton} onPress={() => handleCall("112")}>
                    <Text style={[styles.callButtonText, { fontFamily: 'Inter_400Regular' }]}>112</Text>
                    <Icon name="phone" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.contactItem}>
                  <View style={styles.contactInfo}>
                    <Icon name="ambulance" size={24} color="#FF0000" />
                    <Text style={[styles.contactText, { fontFamily: 'Inter_400Regular' }]}>Ambulance</Text>
                  </View>
                  <TouchableOpacity style={styles.callButton} onPress={() => handleCall("102")}>
                    <Text style={[styles.callButtonText, { fontFamily: 'Inter_400Regular' }]}>102</Text>
                    <Icon name="phone" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.emergencySection}>
                <Text style={[styles.emergencySectionTitle, { fontFamily: 'Inter_600SemiBold' }]}>Family Contacts</Text>
                <View style={styles.contactItem}>
                  <View style={styles.contactInfo}>
                    <Icon name="account" size={24} color="#6C63FF" />
                    <View>
                      <Text style={[styles.contactName, { fontFamily: 'Inter_600SemiBold' }]}>John Doe</Text>
                      <Text style={[styles.contactRelation, { fontFamily: 'Inter_400Regular' }]}>Father</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.callButton} onPress={() => handleCall("9876543210")}>
                    <Icon name="phone" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

const HospitalCardSkeleton = memo(() => (
  <View style={styles.hospitalCardSkeleton}>
    <View style={styles.skeletonBackground}>
      <View style={styles.skeletonLine}></View>
      <View style={styles.skeletonLine}></View>
    </View>
  </View>
))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: "#000",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3B39E4",
  },
  specialtyScroll: {
    paddingHorizontal: 20,
  },
  specialtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    height: 60,
    width: 180,
    padding: 10,
    borderRadius: 30,
    marginBottom: 5,
    backgroundColor: "#F5F5F5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    justifyContent: "center",
  },
  specialtyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B39E4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  specialtyTextContainer: {
    flex: 1,
  },
  specialtyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  doctorsCount: {
    fontSize: 12,
    color: "#666",
  },
  doctorsScroll: {
    paddingHorizontal: 20,
  },
  doctorCard: {
    width: 300,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  doctorCardContent: {
    flexDirection: "row",
    padding: 12,
  },
  doctorImageContainer: {
    width: 100,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
  },
  doctorImage: {
    width: "100%",
    height: "100%",
  },
  doctorInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  specialtyChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 57, 228, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 12,
    color: "#3B39E4",
    marginLeft: 4,
  },
  fieldOfStudy: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  bookingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B39E4",
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  bookingButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  hospitalSection: {
    marginBottom: 24,
  },
  hospitalCardContainer: {
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  hospitalCard: {
    height: 180,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    transform: [
      { perspective: 1000 },
    ],
  },
  hospitalImage: {
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  hospitalInfoOverlay: {
    height: '25%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  hospitalInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    marginBottom: 4,
  },
  hospitalLocation: {
    fontSize: 12,
    fontFamily: 'Inter_900SemiBold',
    color: '#000',
  },
  bookNowButton: {
    backgroundColor: '#3B39E4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bookNowText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyPopup: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
  },
  emergencyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  emergencyContent: {
    maxHeight: "100%",
  },
  emergencySection: {
    marginBottom: 24,
  },
  emergencySectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: "#000",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  contactRelation: {
    fontSize: 14,
    color: "#666",
  },
  callButton: {
    backgroundColor: "#3B39E4",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF4949",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  hospitalCardSkeleton: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  skeletonBackground: {
    backgroundColor: "#E1E9EE",
    borderRadius: 10,
  },
  skeletonLine: {
    height: 20,
    backgroundColor: "#E1E9EE",
    marginVertical: 8,
    borderRadius: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: "#3B39E4",
  },
})
