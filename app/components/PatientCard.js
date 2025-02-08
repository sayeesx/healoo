import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PatientCard = ({ 
  profileImage, 
  name = 'Patient Name', 
  age = 0, 
  dateOfBirth = 'N/A', 
  bloodType = 'N/A', 
  phoneNumber = 'N/A', 
  uniqueCode = 'N/A' 
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.profileSection}>
          <Image 
            source={profileImage || require('../../assets/default-avatar.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.nameText}>{name}</Text>
            <View style={styles.infoRow}>
              <Icon name="cake-variant" size={16} color="#6B4EFF" />
              <Text style={styles.infoText}>{age} Years | {dateOfBirth}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Icon name="water" size={20} color="#6B4EFF" />
            <Text style={styles.detailText}>Blood Type: {bloodType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="phone" size={20} color="#6B4EFF" />
            <Text style={styles.detailText}>{phoneNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="identifier" size={20} color="#6B4EFF" />
            <Text style={styles.detailText}>{uniqueCode}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
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
  cardContent: {
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#1A1A1A',
  },
});

export default PatientCard;