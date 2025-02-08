import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Sample hospitals data with doctors
const hospitals = [
  {
    id: '1',
    name: 'KIMS Hospital',
    location: 'Kottakkal Main Road',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2940&auto=format&fit=crop',
    description: 'KIMS Hospital is a leading healthcare institution in Kottakkal, providing comprehensive medical services with state-of-the-art facilities.',
    workingHours: {
      regular: '9:00 AM - 9:00 PM',
      emergency: '24/7'
    },
    services: [
      'Emergency Care',
      'Surgery',
      'Pediatrics',
      'Cardiology',
      'Orthopedics',
      'Neurology',
      'Gynecology',
      'Dental Care'
    ],
    doctors: [
      {
        id: '101',
        name: 'Dr. Arun Kumar',
        specialty: 'Cardiology',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2940&auto=format&fit=crop',
        experience: '15 years',
        rating: 4.8
      },
      {
        id: '102',
        name: 'Dr. Priya Sharma',
        specialty: 'Pediatrics',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2940&auto=format&fit=crop',
        experience: '12 years',
        rating: 4.9
      },
      {
        id: '103',
        name: 'Dr. Mohammed Ali',
        specialty: 'Orthopedics',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2940&auto=format&fit=crop',
        experience: '10 years',
        rating: 4.7
      },
      {
        id: '104',
        name: 'Dr. Sara John',
        specialty: 'Neurology',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2940&auto=format&fit=crop',
        experience: '14 years',
        rating: 4.8
      }
    ],
    contact: {
      phone: '+91 1234567890',
      email: 'info@kimshospital.com'
    }
  },
  // ... add data for other hospitals similarly
];

const DoctorCard = ({ doctor, onPress }) => (
  <TouchableOpacity style={styles.doctorCard} onPress={onPress}>
    <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
    <View style={styles.doctorInfo}>
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
      <View style={styles.doctorStats}>
        <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
        <Text style={styles.doctorRating}>{doctor.rating}</Text>
        <Text style={styles.doctorExperience}>{doctor.experience}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function HospitalDetail() {
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
    <ScrollView style={styles.container}>
      <Image source={{ uri: hospital.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{hospital.name}</Text>
        
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
          <Text style={styles.infoText}>{hospital.location}</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{hospital.description}</Text>
        </View>

        {/* Working Hours Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Working Hours</Text>
          <View style={styles.workingHours}>
            <View style={styles.workingHoursRow}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
              <View style={styles.workingHoursInfo}>
                <Text style={styles.workingHoursLabel}>Regular Hours</Text>
                <Text style={styles.workingHoursText}>{hospital.workingHours.regular}</Text>
              </View>
            </View>
            <View style={[styles.workingHoursRow, styles.emergencyRow]}>
              <MaterialCommunityIcons name="ambulance" size={20} color="#ff4444" />
              <View style={styles.workingHoursInfo}>
                <Text style={[styles.workingHoursLabel, styles.emergencyLabel]}>Emergency</Text>
                <Text style={[styles.workingHoursText, styles.emergencyText]}>{hospital.workingHours.emergency}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesList}>
            {hospital.services.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <MaterialCommunityIcons name="circle-medium" size={24} color="#6B4EFF" />
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Doctors Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Doctors</Text>
            <TouchableOpacity 
              onPress={() => router.push(`/hospitals/${id}/doctors`)}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.doctorsScroll}
          >
            {hospital.doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onPress={() => router.push(`/doctors/${doctor.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TouchableOpacity style={styles.contactButton}>
            <MaterialCommunityIcons name="phone" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>{hospital.contact.phone}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <MaterialCommunityIcons name="email" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>{hospital.contact.email}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  workingHours: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  workingHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workingHoursInfo: {
    marginLeft: 12,
  },
  workingHoursLabel: {
    fontSize: 14,
    color: '#666',
  },
  workingHoursText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  emergencyRow: {
    marginBottom: 0,
  },
  emergencyLabel: {
    color: '#ff4444',
  },
  emergencyText: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
  servicesList: {
    marginTop: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  doctorsScroll: {
    marginLeft: -20,
  },
  doctorCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginLeft: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  doctorInfo: {
    padding: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  doctorStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorRating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 8,
  },
  doctorExperience: {
    fontSize: 14,
    color: '#666',
  },
  seeAllButton: {
    padding: 8,
  },
  seeAllText: {
    color: '#6B4EFF',
    fontSize: 14,
    fontWeight: '500',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B4EFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});
