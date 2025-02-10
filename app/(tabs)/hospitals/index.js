"use client"

import { useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Carousel from "react-native-reanimated-carousel"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { typography } from "../../constants/fonts"

const { width } = Dimensions.get("window")
const cardWidth = width - 40

const hospitalLogos = {
  "1": require("../../../assets/hospital-logos/avs.png"),
  "2": require("../../../assets/hospital-logos/almas.png"),
  "3": require("../../../assets/hospital-logos/aster.png"),
  "4": require("../../../assets/hospital-logos/hms.png"),
}

const hospitals = [
  {
    id: "1",
    name: "KIMS Hospital",
    location: "Kottakkal Main Road",
    images: [
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2353&q=80",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2373&q=80",
    ],
    timing: "9:00 AM - 9:00 PM",
    activeDoctors: 12,
    type: "multi",
  },
  {
    id: "2",
    name: "Almas Hospital",
    location: "Near Bus Stand",
    images: [
      "https://images.unsplash.com/photo-1516549655669-df668f3652ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2353&q=80",
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2352&q=80",
    ],
    timing: "24/7",
    activeDoctors: 15,
    type: "unani",
  },
  {
    id: "3",
    name: "Hms Hospital",
    location: "MG Road",
    images: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2373&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2353&q=80",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    ],
    timing: "8:00 AM - 10:00 PM",
    activeDoctors: 8,
    type: "clinic",
  },
  {
    id: "4",
    name: "Al Shifa Hospital",
    location: "College Road",
    images: [
      "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2353&q=80",
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2352&q=80",
      "https://images.unsplash.com/photo-1516549655669-df668f3652ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    ],
    timing: "24/7",
    activeDoctors: 20,
    type: "vet",
  },
]

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

const HospitalCard = ({ hospital, onPress }) => {
  const [animation] = useState(new Animated.Value(1))

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: animation }] }]}>
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
        <View style={styles.imageContainer}>
          <Carousel
            loop
            width={cardWidth}
            height={200}
            autoPlay={true}
            data={hospital.images}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
          />
          {hospitalLogos[hospital.id] && <Image source={hospitalLogos[hospital.id]} style={styles.logo} />}
        </View>

        <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]} style={styles.gradient} />
        <View style={styles.infoContainer}>
          <Text style={styles.hospitalName}>{hospital.name}</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color="#fff" />
            <Text style={styles.infoText}>{hospital.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#fff" />
            <Text style={styles.infoText}>{hospital.timing}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="doctor" size={16} color="#fff" />
            <Text style={styles.infoText}>{hospital.activeDoctors} Active Doctors</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function Hospitals() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("all")

  const handleHospitalPress = (hospitalId) => {
    router.push(`/hospitals/${hospitalId}`)
  }

  const filteredHospitals =
    activeFilter === "all" ? hospitals : hospitals.filter((hospital) => hospital.type === activeFilter)

  const handleFilterPress = (type) => {
    setActiveFilter(type)
  }

  const filters = ["all", "multi", "unani", "clinic", "vet"]

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Nearby Hospitals</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toggleContainer}>
        {filters.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.toggleButton, activeFilter === type && styles.toggleButtonActive]}
            onPress={() => handleFilterPress(type)}
          >
            <Text style={[styles.toggleText, activeFilter === type && styles.toggleTextActive]}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredHospitals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HospitalCard hospital={item} onPress={() => handleHospitalPress(item.id)} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: "#333",
    fontWeight: "700",
    fontSize: 24,
  },
  listContainer: {
    paddingTop: 180,
    padding: 20,
  },
  card: {
    width: cardWidth,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  logo: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 8,
    zIndex: 2,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  hospitalName: {
    ...typography.h6,
    color: "#fff",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    ...typography.body2,
    marginLeft: 8,
    color: "#fff",
  },
  toggleContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 80,
    marginBottom: 10,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    marginRight: 10,
  },
  toggleButtonActive: {
    backgroundColor: "#1E3A8A",
  },
  toggleText: {
    color: "#333",
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#fff",
  },
})

