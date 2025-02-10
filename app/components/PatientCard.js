import React from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';

const windowWidth = Dimensions.get('window').width;
const CARD_PADDING = 16;
const CARD_WIDTH = windowWidth - (CARD_PADDING * 2);

const PatientCard = ({ name, dateOfBirth, bloodType, phoneNumber, uniqueCode, profileImage, gender }) => {
  const formattedDate = dateOfBirth instanceof Date 
    ? moment(dateOfBirth).format('MMMM D, YYYY')
    : dateOfBirth;

  return (
    <LinearGradient
      colors={['#000000', '#999B9B', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardContainer}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.hospitalName}>HOSPITAL NAME</Text>
          <Icon name="plus" size={16} color="#fff" style={styles.plusIcon} />
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View style={styles.profileSection}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.defaultProfile}>
                <Icon name="account" size={40} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.idNumber}>ID: {uniqueCode}</Text>
            <Text style={styles.info}>DOB: {moment(dateOfBirth).format('DD/MM/YYYY')}</Text>
            <Text style={styles.info}>Gender: {gender}</Text>
            <Text style={styles.info}>Blood: {bloodType}</Text>
            <Text style={styles.info}>Tel: {phoneNumber}</Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Icon name="barcode" size={100} color="#000" style={styles.barcode} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: 200,
    margin: CARD_PADDING,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(0, 0, 0)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  plusIcon: {
    marginLeft: 4,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  leftSection: {
    flex: 2,
    flexDirection: 'row',
  },
  profileSection: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  defaultProfile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 13,
  },
  idNumber: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  info: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 2,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcode: {
    transform: [{ rotate: '90deg' }],
  },
});

export default PatientCard;
