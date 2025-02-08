import { useState, useRef, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, Animated } from "react-native"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import Carousel from "react-native-reanimated-carousel"
import { LinearGradient } from "expo-linear-gradient"
import { typography } from "../constants/fonts"

const { width } = Dimensions.get("window")
const cardWidth = width - 40

const hospitals = [
  {
    id: "1",
    name: "KIMS Hospital",
    location: "Kottakkal Main Road",
    images: [
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2953&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2946&auto=format&fit=crop",
    ],
    timing: "9:00 AM - 9:00 PM",
    activeDoctors: 12,
  },
  {
    id: "2",
    name: "Moulana Hospital",
    location: "Near Bus Stand",
    images: [
      "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2953&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2946&auto=format&fit=crop",
    ],
    timing: "24/7",
    activeDoctors: 15,
  },
  {
    id: "3",
    name: "City Hospital",
    location: "MG Road",
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2953&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?q=80&w=2940&auto=format&fit=crop",
    ],
    timing: "8:00 AM - 10:00 PM",
    activeDoctors: 8,
  },
  {
    id: "4",
    name: "Al Shifa Hospital",
    location: "College Road",
    images: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2946&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?q=80&w=2940&auto=format&fit=crop",
    ],
    timing: "24/7",
    activeDoctors: 20,
  },
]

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

const RollingText = ({ text, delay }) => {
  const animatedValue = useRef(new Animated.Value(-50)).current

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 1000,
      delay,
      useNativeDriver: true,
    }).start()
  }, [animatedValue]) // Added animatedValue to dependencies

  return (
    <View style={{ height: 40, overflow: "hidden" }}>
      <Animated.Text
        style={[
          styles.rollingText,
          {
            transform: [
              {
                translateY: animatedValue,
              },
            ],
          },
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  )
}

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
        <Carousel
          loop
          width={cardWidth}
          height={180}
          autoPlay={true}
          data={hospital.images}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
        />
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
  const scrollY = useRef(new Animated.Value(0)).current
  const headerHeight = useRef(new Animated.Value(120)).current

  const handleHospitalPress = (hospitalId) => {
    router.push(`/hospitals/${hospitalId}`)
  }

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })

  useEffect(() => {
    scrollY.addListener(({ value }) => {
      if (value > 50) {
        Animated.timing(headerHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start()
      } else {
        Animated.timing(headerHeight, {
          toValue: 120,
          duration: 300,
          useNativeDriver: false,
        }).start()
      }
    })

    return () => {
      scrollY.removeAllListeners()
    }
  }, [])

  return (
    <View style={styles.container}>
      <AnimatedBlurView
        intensity={80}
        tint="light"
        style={[
          styles.headerContainer,
          {
            height: headerHeight,
            overflow: "hidden",
          },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <RollingText text="Discover" delay={0} />
          <RollingText text="Nearby" delay={200} />
          <RollingText text="Hospitals" delay={400} />
        </View>
      </AnimatedBlurView>

      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HospitalCard hospital={item} onPress={() => handleHospitalPress(item.id)} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F1EF",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  rollingText: {
    ...typography.h3,
    color: "#333",
    fontWeight: "800",
    fontSize: 32,
  },
  listContainer: {
    paddingTop: 140,
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
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
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
})

