"use client"

import { useEffect, useRef } from "react"
import { View, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing, Text } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

// Adjusted dimensions for bigger logos at bottom
const CAROUSEL_WIDTH = width
const CAROUSEL_HEIGHT = 120
const LOGO_WIDTH = 400
const LOGO_HEIGHT = 100

const logos = [
  require("../assets/hospital-logos/avs.png"),
  require("../assets/hospital-logos/almas.png"),
  require("../assets/hospital-logos/aster.png"),
  require("../assets/hospital-logos/hms.png"),
]

export default function AnimatedLogo() {
  const router = useRouter()
  const carouselPosition = useRef(new Animated.Value(0)).current
  const signInArrowRotation = useRef(new Animated.Value(0)).current
  const signUpArrowRotation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animateCarousel = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(carouselPosition, {
            toValue: -LOGO_WIDTH * logos.length,
            duration: 20000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(carouselPosition, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ).start()
    }

    animateCarousel()
  }, [carouselPosition])

  const animateButtonPress = (arrowRotation, callback) => {
    Animated.sequence([
      Animated.timing(arrowRotation, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(arrowRotation, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => callback())
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000033", "#000066", "#0000FF"]} style={styles.gradient} />

      {/* Carousel Container */}
      <View style={styles.carouselWrapper}>
        <View style={styles.carouselContainer}>
          <Animated.View style={[styles.carousel, { transform: [{ translateX: carouselPosition }] }]}>
            {/* Double the logos for seamless loop */}
            {[...logos, ...logos, ...logos].map((logo, index) => (
              <Animated.Image
                key={index}
                source={logo}
                style={[
                  styles.logo,
                  {
                    opacity: carouselPosition.interpolate({
                      inputRange: [
                        -LOGO_WIDTH * (index + 1.5),
                        -LOGO_WIDTH * index,
                        -LOGO_WIDTH * (index - 1.5)
                      ],
                      outputRange: [0, 1, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ]}
                resizeMode="contain"
              />
            ))}
          </Animated.View>
        </View>
      </View>

      {/* Footer with Sign In and Sign Up Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.signInButton]}
          onPress={() => {
            animateButtonPress(signInArrowRotation, () => router.replace("/auth/login?form=signin"))
          }}
        >
          <Text style={styles.buttonText}>Sign In</Text>
          <Animated.View
            style={[
              styles.arrowContainer,
              {
                transform: [
                  {
                    rotate: signInArrowRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "45deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.arrow}>→</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={() => {
            animateButtonPress(signUpArrowRotation, () => router.replace("/auth/login?form=signup"))
          }}
        >
          <Text style={[styles.buttonText, styles.signUpText]}>Sign Up</Text>
          <Animated.View
            style={[
              styles.arrowContainer,
              {
                transform: [
                  {
                    rotate: signUpArrowRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "45deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.arrow, styles.signUpArrow]}>→</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  carouselWrapper: {
    height: CAROUSEL_HEIGHT,
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  carouselContainer: {
    height: CAROUSEL_HEIGHT,
    justifyContent: "center",
  },
  carousel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  signInButton: {
    backgroundColor: "#fff",
  },
  signUpButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  signUpText: {
    color: "#fff",
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  signUpArrow: {
    color: "#fff",
  },
})
