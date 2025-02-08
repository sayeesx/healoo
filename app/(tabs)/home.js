import { useState, useRef, useEffect } from "react"
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
import { typography } from "../constants/fonts"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { BlurView } from "expo-blur"
import { handleScroll } from "../../components/CustomTabBar"

const { width } = Dimensions.get("window")

const specialties = [
  {
    id: 1,
    name: "Cardiology     ",
    icon: "heart-pulse",
    doctorsAvailable: 17,
  },
  {
    id: 2,
    name: "Neurology     ",
    icon: "brain",
    doctorsAvailable: 22,
  },
  {
    id: 3,
    name: "Dentist        ",
    icon: "tooth-outline",
    doctorsAvailable: 15,
  },
  {
    id: 4,
    name: "General       ",
    icon: "stethoscope",
    doctorsAvailable: 19,
  },
]

const popularDoctors = [
  {
    id: "1",
    name: "Dr. Tahsin Neduvanchery",
    specialty: "Cardiology",
    specialtyIcon: "heart-pulse",
    experience: 5,
    fieldOfStudy: "MBBS, MD, DM, MRCP, FRCP, FACC",
    image: require("../../assets/doctors/tahsin.png"),
  },
  {
    id: "2",
    name: "Dr. Faizal M Iqbal",
    specialty: " Orthopaedic Surgeon",
    specialtyIcon: "bone",
    experience: 8,
    fieldOfStudy: "MBBS, MS, FRIEBERG",
    image: require("../../assets/doctors/faizal.png"),
  },
  {
    id: "3",
    name: "Dr. Chandrasekhar J",
    specialty: "Neurology",
    specialtyIcon: "brain",
    experience: 6,
    fieldOfStudy: "MBBS, DCH",
    image: require("../../assets/doctors/chandru.png"),
  },
]

const hospitals = [
  {
    id: "1",
    name: "KIMS Hospital",
    location: "Kottakkal Main Road",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2940&auto=format&fit=crop",
    timing: "9:00 AM - 9:00 PM",
    activeDoctors: 12,
    color: "#4DABF7",
  },
  {
    id: "2",
    name: "Moulana Hospital",
    location: "Near Bus Stand, Kottakkal",
    image: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?q=80&w=2940&auto=format&fit=crop",
    timing: "24/7",
    activeDoctors: 15,
    color: "#FF6B6B",
  },
  {
    id: "3",
    name: "City Hospital",
    location: "MG Road, Kottakkal",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2953&auto=format&fit=crop",
    timing: "8:00 AM - 10:00 PM",
    activeDoctors: 8,
    color: "#69DB7C",
  },
]

export default function Home() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false)
  const [searchPlaceholder, setSearchPlaceholder] = useState("")
  const bellAnim = useRef(new Animated.Value(0)).current
  const sirenAnim = useRef(new Animated.Value(0)).current
  const introBoxWidth = useRef(new Animated.Value(32)).current
  const introBoxOpacity = useRef(new Animated.Value(0)).current
  const introTextOpacity = useRef(new Animated.Value(0)).current
  const [introText, setIntroText] = useState("")

  useEffect(() => {
    const shakeAnimation = Animated.sequence([
      Animated.timing(bellAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(bellAnim, {
        toValue: -1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(bellAnim, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ])

    const intervalId = setInterval(() => {
      shakeAnimation.start()
    }, 3000)

    return () => clearInterval(intervalId)
  }, [bellAnim])

  useEffect(() => {
    const animateSiren = () => {
      Animated.sequence([
        Animated.timing(sirenAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(sirenAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => animateSiren())
    }

    animateSiren()
  }, [sirenAnim])

  useEffect(() => {
    const phrase = "Search for hospitals and doctors."
    let animationFrame
    let startTime = Date.now()
    const letterDuration = 150
    const pauseDuration = 2000

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const totalDuration = phrase.length * letterDuration

      if (elapsed < totalDuration) {
        const numLetters = Math.floor(elapsed / letterDuration)
        setSearchPlaceholder(phrase.substring(0, numLetters))
        animationFrame = requestAnimationFrame(animate)
      } else if (elapsed < totalDuration + pauseDuration) {
        setSearchPlaceholder(phrase)
        animationFrame = requestAnimationFrame(animate)
      } else {
        startTime = Date.now()
        setSearchPlaceholder("")
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      setSearchPlaceholder("")
    }
  }, [])

  useEffect(() => {
    const animateIntroBox = () => {
      Animated.sequence([
        // Fade in and expand the box
        Animated.parallel([
          Animated.timing(introBoxOpacity, { toValue: 1, duration: 300, useNativeDriver: false }),
          Animated.timing(introBoxWidth, { toValue: 200, duration: 500, useNativeDriver: false }),
        ]),
        // Show "Hello Raees"
        Animated.timing(introTextOpacity, { toValue: 1, duration: 300, useNativeDriver: false }),
        // Wait for 2 seconds
        Animated.delay(2000),
        // Hide text
        Animated.timing(introTextOpacity, { toValue: 0, duration: 300, useNativeDriver: false }),
        // Expand box further
        Animated.timing(introBoxWidth, { toValue: 250, duration: 300, useNativeDriver: false }),
        // Show "How are you feeling today?"
        Animated.timing(introTextOpacity, { toValue: 1, duration: 300, useNativeDriver: false }),
        // Wait for 3 seconds
        Animated.delay(3000),
        // Shrink back slowly with fade out effect
        Animated.parallel([
          Animated.timing(introBoxWidth, { toValue: 32, duration: 1000, useNativeDriver: false }),
          Animated.timing(introBoxOpacity, { toValue: 0, duration: 1000, useNativeDriver: false }),
          Animated.timing(introTextOpacity, { toValue: 0, duration: 500, useNativeDriver: false }),
        ]),
      ]).start()
    }

    animateIntroBox()

    // Change text after delay
    setTimeout(() => setIntroText("Hello Raees"), 800)
    setTimeout(() => setIntroText("How are you feeling today?"), 3400)
  }, [introBoxWidth, introBoxOpacity, introTextOpacity])

  const handleNotification = () => {
    console.log("Notification clicked")
  }

  const handleSearch = () => {
    console.log("Searching for:", searchQuery)
  }

  const handleSpecialtyPress = (specialty) => {
    router.push(`/specialty/${specialty.name.toLowerCase()}`)
  }

  const handleHospitalPress = (hospital) => {
    router.push(`/hospitals/${hospital.id}`)
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

  return (
    <SafeAreaView style={[styles.container, typography.inter]}>
      <ScrollView style={styles.scrollView} onScroll={handleScroll} scrollEventThrottle={16}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.topRow}>
              <TouchableOpacity onPress={handleEmergency}>
                <View style={styles.ambulanceButton}>
                  <Animated.View
                    style={{
                      opacity: sirenAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                    }}
                  >
                    <Icon name="ambulance" size={24} color="#FF0000" />
                  </Animated.View>
                </View>
              </TouchableOpacity>
              <View style={styles.rightIcons}>
                <Animated.View
                  style={[
                    styles.introBox,
                    {
                      width: introBoxWidth,
                      opacity: introBoxOpacity,
                    },
                  ]}
                >
                  <Animated.Text style={[styles.introText, { opacity: introTextOpacity }]}>{introText}</Animated.Text>
                </Animated.View>
                <TouchableOpacity onPress={handleProfile} style={styles.profileContainer}>
                  <View style={styles.profileIcon}>
                    <Icon name="account-circle" size={32} color="#3B39E4" />
                  </View>
                  <TouchableOpacity style={styles.notificationButton} onPress={handleNotification}>
                    <Animated.View
                      style={[
                        styles.notificationIcon,
                        {
                          transform: [
                            {
                              rotate: bellAnim.interpolate({
                                inputRange: [-1, 1],
                                outputRange: ["-20deg", "20deg"],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Icon name="bell-outline" size={24} color="#000" />
                      {notifications.length > 0 && (
                        <View style={styles.notificationBadge}>
                          <Text style={styles.notificationCount}>{notifications.length}</Text>
                        </View>
                      )}
                    </Animated.View>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.title}>Find your desired specialist</Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Icon name="magnify" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <TouchableOpacity onPress={() => router.push("/all-specialties")}>
              <Text style={styles.seeAll}>See All</Text>
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
                  <Text style={styles.specialtyName}>{specialty.name}</Text>
                  <Text style={styles.doctorsCount}>{specialty.doctorsAvailable} Doctors</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Doctors</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doctorsScroll}>
            {popularDoctors.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                <BlurView intensity={80} tint="light" style={styles.doctorCardContent}>
                  <View style={styles.doctorImageContainer}>
                    <Image source={doctor.image} style={styles.doctorImage} resizeMode="cover" />
                  </View>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName} numberOfLines={1}>
                      {doctor.name}
                    </Text>
                    <View style={styles.specialtyChip}>
                      <Icon name={doctor.specialtyIcon} size={14} color="#3B39E4" />
                      <Text style={styles.specialtyText}>{doctor.specialty}</Text>
                    </View>
                    <Text style={styles.fieldOfStudy} numberOfLines={2}>
                      {doctor.fieldOfStudy}
                    </Text>
                    <TouchableOpacity style={styles.bookingButton}>
                      <Text style={styles.bookingButtonText}>Book Now</Text>
                      <Icon name="calendar-plus" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Hospitals</Text>
            <TouchableOpacity onPress={() => router.push("/hospitals")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hospitalsContainer}>
            {hospitals.map((hospital) => (
              <TouchableOpacity
                key={hospital.id}
                style={styles.hospitalCard}
                onPress={() => handleHospitalPress(hospital)}
              >
                <Image source={{ uri: hospital.image }} style={styles.hospitalImage} />
                <View style={[styles.hospitalGradient, { backgroundColor: `${hospital.color}15` }]}>
                  <View style={styles.hospitalContent}>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    <View style={styles.infoContainer}>
                      <BlurView intensity={80} tint="light" style={styles.infoBlur}>
                        <View style={styles.infoRow}>
                          <Icon name="map-marker" size={16} color={hospital.color} />
                          <Text style={styles.infoText}>{hospital.location}</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Icon name="clock-outline" size={16} color={hospital.color} />
                          <Text style={styles.infoText}>{hospital.timing}</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Icon name="doctor" size={16} color={hospital.color} />
                          <Text style={styles.infoText}>{hospital.activeDoctors} Active Doctors</Text>
                        </View>
                      </BlurView>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {showEmergencyPopup && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowEmergencyPopup(false)}>
          <View style={styles.emergencyPopup}>
            <View style={styles.emergencyHeader}>
              <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
              <TouchableOpacity onPress={() => setShowEmergencyPopup(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.emergencyContent}>
              <View style={styles.emergencySection}>
                <Text style={styles.emergencySectionTitle}>Emergency Numbers</Text>
                <View style={styles.contactItem}>
                  <View style={styles.contactInfo}>
                    <Icon name="phone-alert" size={24} color="#FF0000" />
                    <Text style={styles.contactText}>Emergency Services</Text>
                  </View>
                  <TouchableOpacity style={styles.callButton} onPress={() => handleCall("112")}>
                    <Text style={styles.callButtonText}>112</Text>
                    <Icon name="phone" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.contactItem}>
                  <View style={styles.contactInfo}>
                    <Icon name="ambulance" size={24} color="#FF0000" />
                    <Text style={styles.contactText}>Ambulance</Text>
                  </View>
                  <TouchableOpacity style={styles.callButton} onPress={() => handleCall("102")}>
                    <Text style={styles.callButtonText}>102</Text>
                    <Icon name="phone" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.emergencySection}>
                <Text style={styles.emergencySectionTitle}>Family Contacts</Text>
                <View style={styles.contactItem}>
                  <View style={styles.contactInfo}>
                    <Icon name="account" size={24} color="#6C63FF" />
                    <View>
                      <Text style={styles.contactName}>John Doe</Text>
                      <Text style={styles.contactRelation}>Father</Text>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
    marginBottom: 20,
  },
  header: {
    padding: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  ambulanceButton: {
    padding: 8,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    marginRight: 8,
  },
  notificationIcon: {
    padding: 8,
  },
  introBox: {
    height: 32,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 10,
    position: "absolute",
    right: 45,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  introText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    paddingLeft: 16,
    overflow: "hidden",
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#000",
  },
  searchButton: {
    backgroundColor: "#3B39E4",
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
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
    fontWeight: "bold",
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
    gap: 8,
  },
  bookingButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  hospitalsContainer: {
    paddingHorizontal: 20,
  },
  hospitalCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
  },
  hospitalImage: {
    width: "100%",
    height: "100%",
  },
  hospitalGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  hospitalContent: {
    gap: 8,
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  infoContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  infoBlur: {
    padding: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#000",
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
})

