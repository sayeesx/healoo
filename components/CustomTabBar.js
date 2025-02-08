import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Create shared animated values
const translateY = new Animated.Value(0);
const opacity = new Animated.Value(1);
let lastScrollY = 0;
let isAnimating = false;

const showTabBar = () => {
  isAnimating = true;
  Animated.parallel([
    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    })
  ]).start(() => {
    isAnimating = false;
  });
};

const hideTabBar = () => {
  isAnimating = true;
  Animated.parallel([
    Animated.timing(translateY, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    })
  ]).start(() => {
    isAnimating = false;
  });
};

// Shared scroll handler
export const handleScroll = (event) => {
  const currentScrollY = event.nativeEvent.contentOffset.y;
  const scrollVelocity = currentScrollY - lastScrollY;
  
  // Always show at top of page
  if (currentScrollY <= 0) {
    showTabBar();
    lastScrollY = currentScrollY;
    return;
  }

  // Don't trigger new animation if one is in progress
  if (!isAnimating) {
    // Hide on scroll down, show on scroll up
    if (scrollVelocity > 5) {
      hideTabBar();
    } else if (scrollVelocity < -5) {
      showTabBar();
    }
  }
  
  lastScrollY = currentScrollY;
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isRouteActive = (route) => {
    return pathname.startsWith(`/${route}`);
  };

  return (
    <Animated.View 
      style={[
        styles.tabBarContainer,
        {
          transform: [{
            translateY: translateY.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 100],
              extrapolate: 'clamp'
            })
          }],
          opacity: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp'
          })
        }
      ]}
    >
      {/* Left side buttons */}
      <View style={styles.sideContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push('/appointment/index')}
        >
          <MaterialCommunityIcons
            name="calendar-clock"
            size={32}
            color={isRouteActive('appointment') ? '#6B4EFF' : '#9E9E9E'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push('/hospitals')}
        >
          <MaterialCommunityIcons
            name="hospital-building"
            size={32}
            color={isRouteActive('hospitals') ? '#6B4EFF' : '#9E9E9E'}
          />
        </TouchableOpacity>
      </View>

      {/* Center home button */}
      <View style={styles.centerContainer}>
        <TouchableOpacity
          style={[
            styles.homeButton, 
            (pathname === '/home' || pathname === '/') && styles.homeButtonActive
          ]}
          onPress={() => router.replace('/home')}
        >
          <MaterialCommunityIcons
            name="home"
            size={32}
            color={(pathname === '/home' || pathname === '/') ? '#6B4EFF' : '#9E9E9E'}
          />
        </TouchableOpacity>
      </View>

      {/* Right side buttons */}
      <View style={styles.sideContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push('/lab-records')}
        >
          <MaterialCommunityIcons
            name="test-tube"
            size={32}
            color={isRouteActive('lab-records') ? '#6B4EFF' : '#9E9E9E'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push('/profile')}
        >
          <MaterialCommunityIcons
            name="account"
            size={32}
            color={isRouteActive('profile') ? '#6B4EFF' : '#9E9E9E'}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  centerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tabButton: {
    padding: 8,
    borderRadius: 12,
  },
  homeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  homeButtonActive: {
    backgroundColor: '#EDE9FF',
    transform: [{ scale: 1.1 }],
  },
});

export default CustomTabBar;