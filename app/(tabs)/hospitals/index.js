"use client";

import React, { useState, useMemo } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const hospitals = [
  {
    id: "1",
    name: "KIMS Hospital",
    location: "Kottakkal Main Road",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    type: "multi",
  },
  {
    id: "2",
    name: "Almas Hospital",
    location: "Near Bus Stand",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd81895907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    type: "ayurveda",
  },
  {
    id: "3",
    name: "HMS Hospital",
    location: "MG Road",
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    type: "clinic",
  },
];

const HospitalCard = ({ hospital, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(hospital.id)}>
      <Image source={{ uri: hospital.image }} style={styles.image} />
      <View style={styles.cardDetails}>
        <Text style={styles.hospitalName}>{hospital.name}</Text>
        <View style={styles.row}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{hospital.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function Hospitals() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleFilterPress = (filter) => {
    if (filter === "vet") {
      Alert.alert("Coming Soon", "This feature will be available soon");
      return;
    }
    setSelectedFilter(filter);
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover Hospitals</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for hospitals..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        {["all", "multi", "ayurveda", "clinic", "vet"].map((filter) => (
          <BlurView key={filter} intensity={30} tint="light" style={styles.filterButton}>
            <TouchableOpacity
              style={[
                styles.filterTouchable,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => handleFilterPress(filter)}
            >
              <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                {filter.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </BlurView>
        ))}
      </View>

      {filteredHospitals.length > 0 ? (
        <FlatList
          data={filteredHospitals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HospitalCard hospital={item} onPress={() => {}} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No results found</Text>
          <Text style={styles.suggestionText}>Suggested hospitals:</Text>
          {hospitals.map((hospital) => (
            <Text key={hospital.id} style={styles.suggestionItem}>{hospital.name}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: 20 },
  noResultsContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noResultsText: { fontSize: 18, fontWeight: "bold", color: "#666" },
  suggestionText: { fontSize: 16, color: "#333", marginTop: 10 },
  suggestionItem: { fontSize: 14, color: "#007BFF", marginTop: 5 },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 28,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginVertical: 10,
    marginTop: 10,
  },
  filterButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  filterTouchable: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: "#3B39E4",
  },
  filterText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    width: "100%",
    borderRadius: 15,
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardDetails: {
    padding: 12,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  infoText: {
    color: "#666",
    marginLeft: 6,
  },
 
});
