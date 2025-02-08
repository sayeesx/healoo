import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomTabBar, { handleScroll } from '../../../../components/CustomTabBar';

// Sample hospitals data (same as in [id].js)
const hospitals = [
  {
    id: '1',
    name: 'KIMS Hospital',
    doctors: [
      {
        id: '101',
        name: 'Dr. Arun Kumar',
        specialty: 'Cardiology',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2940&auto=format&fit=crop',
        experience: '15 years',
        rating: 4.8,
        qualifications: 'MBBS, MD (Cardiology)',
        languages: ['English', 'Malayalam', 'Hindi'],
        consultationFee: '₹800'
      },
      {
        id: '102',
        name: 'Dr. Priya Sharma',
        specialty: 'Pediatrics',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2940&auto=format&fit=crop',
        experience: '12 years',
        rating: 4.9,
        qualifications: 'MBBS, MD (Pediatrics)',
        languages: ['English', 'Malayalam', 'Tamil'],
        consultationFee: '₹700'
      },
      {
        id: '103',
        name: 'Dr. Mohammed Ali',
        specialty: 'Orthopedics',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2940&auto=format&fit=crop',
        experience: '10 years',
        rating: 4.7,
        qualifications: 'MBBS, MS (Orthopedics)',
        languages: ['English', 'Malayalam', 'Arabic'],
        consultationFee: '₹900'
      },
      {
        id: '104',
        name: 'Dr. Sara John',
        specialty: 'Neurology',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2940&auto=format&fit=crop',
        experience: '14 years',
        rating: 4.8,
        qualifications: 'MBBS, DM (Neurology)',
        languages: ['English', 'Malayalam'],
        consultationFee: '₹1000'
      },
      {
        id: '105',
        name: 'Dr. Rajesh Kumar',
        specialty: 'General Medicine',
        image: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=2940&auto=format&fit=crop',
        experience: '8 years',
        rating: 4.6,
        qualifications: 'MBBS, MD (General Medicine)',
        languages: ['English', 'Malayalam', 'Hindi'],
        consultationFee: '₹600'
      },
      {
        id: '106',
        name: 'Dr. Lakshmi Nair',
        specialty: 'Gynecology',
        image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=2940&auto=format&fit=crop',
        experience: '16 years',
        rating: 4.9,
        qualifications: 'MBBS, MD (Gynecology)',
        languages: ['English', 'Malayalam', 'Tamil'],
        consultationFee: '₹800'
      }
    ]
  }
  // ... add data for other hospitals
];

const DoctorCard = ({ doctor, onPress }) => (
  <TouchableOpacity style={styles.doctorCard} onPress={onPress}>
    <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
    <View style={styles.doctorInfo}>
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
      
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
        <Text style={styles.infoText}>{doctor.rating}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{doctor.experience}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="school" size={16} color="#666" />
        <Text style={styles.infoText}>{doctor.qualifications}</Text>
      </View>
      
      <View style={styles.bottomRow}>
        <Text style={styles.consultationFee}>Consultation: {doctor.consultationFee}</Text>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => router.push(`/appointment/${doctor.id}`)}
        >
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

export default function DoctorsList() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const hospital = hospitals.find(h => h.id === id);

  if (!hospital) {
    return (
      <View style={styles.container}>
        <Text>Hospital not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Doctors at {hospital.name}</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {hospital.doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onPress={() => router.push(`/doctors/${doctor.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  doctorImage: {
    width: '100%',
    height: 200,
  },
  doctorInfo: {
    padding: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  consultationFee: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
