"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { SvgUri } from 'react-native-svg';
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const images = {
  mims: 'https://www.asterhospitals.in/sites/default/files/styles/optimize_images/public/2021-01/hospital-image_1.png.webp?itok=7qR8Hcp7',
  almas: require("../../../assets/hospital/almas.png"),
  hms: "https://lh3.googleusercontent.com/p/AF1QipOyRNyXCNKsv7oGheU53iKTxotmy2NHf5rT4IRi=s680-w680-h510",
};
const hospitals = [
  {
    id: "1",
    name: "ASTER MIMS HOSPITAL",
    location: "Kottakkal Main Road",
    image: images.mims,
    logo: require("../../../assets/hospital-logos/aster.png"),
    doctors: [
      {
        id: '101',
        name: 'Dr. Thejus Kallarikkandi',
        specialty: 'Critical Care Medicine',
        image: 'https://www.asterhospitals.in/sites/default/files/2024-01/Dr.%20Thejus%20Kallarikkandi.jpg',
        experience: '15+ years',
        rating: 4.8,
        designation: 'Senior Consultant & HOD - Critical Care Medicine'
      },
      {
        name: "Dr. Tahsin Neduvanchery",
        role: "Sr. Consultant - Interventional Cardiology",
        speciality: "Cardiology",
        image: "https://www.asterhospitals.in/sites/default/files/2024-01/famous%20cardiologist%20in%20kerala_0.jpg"
      },
      {
        name: "Dr. Faizal M Iqbal",
        role: "Sr. Consultant - Orthopaedic & Spine Surgery",
        qualifications: "MBBS, MS, FRIEBERG",
        speciality: "Orthopaedics",
        image: "https://www.asterhospitals.in/sites/default/files/2021-01/dr-faizal.jpg"
      },
      {
        name: "Dr. Mahesh Menon",
        role: "Senior Consultant – Gastroenterology",
        qualifications: "MBBS, MD, DM (Gastroenterology)",
        speciality: "Gastro Science",
        image: "https://www.asterhospitals.in/sites/default/files/2021-01/dr-mahesh.jpg"
      }
    ],
    specialities: [
      "Critical Care Medicine",
      "Orthopaedics",
      "Gastroenterology",
      "Cardiology",
      "Neurology",
      "Pediatrics",
      "Emergency Medicine"
    ],
    contact: {
      phone: ["0483-2809100", "0483-3509100"],
      emergency: "0483-2809640",
      email: "info@astermims.com"
    }
  },
  {
    id: "2",
    name: "ALMAS HOSPITAL",
    location: "Near Bus Stand",
    image: images.almas,
    logo: require("../../../assets/hospital-logos/almas.png"),
    doctors: [
      {
        name: "Dr. P A Kabeer",
        role: "Chief Physician, Chairman & Managing Director",
        speciality: "General Medicine",
        image: "https://www.almashospital.com/images/doctors/dr-kabeer.jpg"
      },
    ]
  },
  {
    id: "3",
    name: "HMS HOSPITAL",
    location: "MG Road",
    image: images.hms,
    logo: require("../../../assets/hospital-logos/hms.png"),
    doctors: [
      {
        name: "DR. BYJU CHERIYA KACHERY",
        role: "CHAIRMAN & MANAGING DIRECTOR",
        speciality: "Cardiology",
        image: "https://www.heartsmalabar.com/images/doctors/dr-byju.jpg"
      },
    ]
  },
];

const preloadImages = async () => {
  const images = [
    require("../../../assets/hospital-logos/almas.png"),
    require("../../../assets/hospital-logos/hms.png"),
    require("../../../assets/hospital-logos/aster.png"),
  ];

  const cacheImages = images.map(image => {
    return Asset.fromModule(image).downloadAsync();
  });

  return Promise.all(cacheImages);
};

const AnimatedCard = Animated.createAnimatedComponent(TouchableOpacity);

const HospitalCard = React.memo(({ hospital, onPress, index }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100), // Stagger effect
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <AnimatedCard 
      style={[
        styles.card,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]} 
      onPress={() => onPress(hospital)}
      activeOpacity={0.9}
    >
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 350 }}
        style={styles.cardInner}
      >
        <Image 
          source={typeof hospital.image === 'string' ? { uri: hospital.image } : hospital.image}
          style={[styles.image, !imageLoaded && styles.hiddenImage]} 
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="eager"
        />
        <BlurView intensity={80} tint="light" style={styles.cardOverlay}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.hospitalInfo}>
                <View style={styles.logoContainer}>
                  <Image 
                    source={hospital.logo}
                    style={styles.logo}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.hospitalName}>{hospital.name}</Text>
                  <View style={styles.locationContainer}>
                    <MaterialCommunityIcons name="map-marker" size={16} color="#FF4757" />
                    <Text style={styles.locationText}>{hospital.location}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{hospital.type}</Text>
              </View>
            </View>
          </View>
        </BlurView>
      </MotiView>
    </AnimatedCard>
  );
});

export default function Hospitals() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await preloadImages();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const handleFilterPress = (filter) => {
    if (filter === "vet") {
      Alert.alert("Coming Soon", "This feature will be available soon");
      return;
    }
    setSelectedFilter(filter);
  };

  const handleHospitalPress = (hospital) => {
    router.push(`/hospitals/${hospital.id}`);
  };

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(
      (hospital) =>
        (selectedFilter === "all" || hospital.type === selectedFilter) &&
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedFilter, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Hospitals</Text>
        <Text style={styles.headerSubtitle}>Discover healthcare near you</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hospitals..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        {["all", "multi", "ayurveda", "clinic", "vet"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterPress(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredHospitals.length > 0 ? (
        <FlatList
          data={filteredHospitals}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <HospitalCard 
              hospital={item} 
              onPress={handleHospitalPress}
              index={index}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={3}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <MaterialCommunityIcons name="hospital-building" size={64} color="#ddd" />
          <Text style={styles.noResultsText}>No hospitals found</Text>
          <Text style={styles.suggestionText}>Try adjusting your search</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#F8F9FA",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 4,
    letterSpacing: 0.2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    marginBottom: 10,
    padding: 12,
    height: 56,
    borderRadius: 16,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1E293B",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 8,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: "#3B39E4",
    shadowColor: "#3B39E4",
    shadowOpacity: 0.25,
  },
  filterText: {
    color: "black",
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },
  listContainer: {
    padding: 10,
    paddingTop: 5,
  },
  card: {
    height: 180,
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  cardInner: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    opacity: 1,
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "45%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hospitalInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
    zIndex: 3,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
    padding: 6,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  nameContainer: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    color: "#64748B",
    fontSize: 14,
  },
  typeBadge: {
    
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7,
  },
  typeText: {
    color: "black",
    fontSize: 10,
    fontWeight: "600",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 16,
  },
  suggestionText: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 8,
  },
  hiddenImage: {
    opacity: 0,
  },
});