import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ImageBackground, Animated, Easing } from "react-native";
import bgImage from "./assets/Sunset-over-construction-site-2011-alon-eisenberg.jpeg";
import HomeScreen from "./HomeScreen";

const TABS = [
  { key: "home", label: "Home" },
  { key: "create", label: "Create Project" },
  { key: "bid", label: "Bid on Project" },
];

const HomepageTabs = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [motionAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (activeTab === "home") {
      motionAnim.stopAnimation();
      motionAnim.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(motionAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [activeTab, motionAnim]);

  let content;
  if (activeTab === "home") {
    content = (
      <View style={styles.tabContentTop}>
        <Text style={styles.welcome}>Welcome to Bidzilla!</Text>
      </View>
    );
  } else if (activeTab === "create") {
    content = <HomeScreen showCreateProjectOnly backgroundColor="transparent" />;
  } else if (activeTab === "bid") {
    content = <HomeScreen showBidOnly backgroundColor="transparent" />;
  }

  const createPulseScale = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.45],
  });
  const createPulseScaleInner = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.25],
  });
  const createPulseOpacity = motionAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.45, 0.1, 0.45],
  });
  const sweepTranslate = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-420, 420],
  });
  const sweepOpacity = motionAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.55, 0],
  });
  const floatY = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });
  const floatYAlt = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });
  const floatX = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });
  const floatRotate = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-4deg", "4deg"],
  });
  const sparkOpacity = motionAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.7, 0],
  });
  const spark1Y = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [220, -220],
  });
  const spark2Y = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [260, -260],
  });
  const spark3Y = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, -240],
  });
  const spark1Scale = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.1],
  });
  const spark2Scale = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });
  const spark3Scale = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.3],
  });
  const ringScale = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.05],
  });
  const ringRotate = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderAmbientAnimation = () => {
    if (activeTab === "create") {
      return (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseCircle,
              styles.pulseLeft,
              styles.createPulseLarge,
              {
                transform: [{ scale: createPulseScale }],
                opacity: createPulseOpacity,
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseCircle,
              styles.pulseRight,
              styles.createPulseSmall,
              {
                transform: [{ scale: createPulseScaleInner }],
                opacity: createPulseOpacity,
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.lightSweep,
              {
                opacity: sweepOpacity,
                transform: [
                  { translateX: sweepTranslate },
                  { rotate: "-12deg" },
                ],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.lightSweep,
              styles.lightSweepSecondary,
              {
                opacity: sweepOpacity,
                transform: [
                  { translateX: sweepTranslate },
                  { rotate: "10deg" },
                ],
              },
            ]}
          />
        </>
      );
    }
    if (activeTab === "bid") {
      return (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ticket,
              styles.ticketLeft,
              {
                transform: [
                  { translateY: floatY },
                  { translateX: floatX },
                  { rotate: floatRotate },
                ],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ticket,
              styles.ticketRight,
              {
                transform: [
                  { translateY: floatYAlt },
                  { translateX: floatX },
                  { rotate: floatRotate },
                ],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ticket,
              styles.ticketCenter,
              {
                transform: [
                  { translateY: floatY },
                  { translateX: floatX },
                  { rotate: floatRotate },
                ],
                opacity: 0.35,
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.spark,
              styles.sparkLeft,
              {
                opacity: sparkOpacity,
                transform: [{ translateY: spark1Y }, { scale: spark1Scale }],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.spark,
              styles.sparkCenter,
              {
                opacity: sparkOpacity,
                transform: [{ translateY: spark2Y }, { scale: spark2Scale }],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.spark,
              styles.sparkRight,
              {
                opacity: sparkOpacity,
                transform: [{ translateY: spark3Y }, { scale: spark3Scale }],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.cornerRing,
              styles.cornerRingLeft,
              {
                transform: [{ scale: ringScale }, { rotate: ringRotate }],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.cornerRing,
              styles.cornerRingRight,
              {
                transform: [
                  { scale: ringScale },
                  { rotate: ringRotate },
                ],
                opacity: 0.45,
              },
            ]}
          />
        </>
      );
    }
    return null;
  };

  const TabbedContent = (
    <View style={styles.overlay}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.content}>{content}</View>
    </View>
  );

  if (activeTab === "home") {
    return (
      <ImageBackground
        source={bgImage}
        style={styles.bg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        {TabbedContent}
      </ImageBackground>
    );
  }

  const backgroundStyle = styles.animatedBackground;

  return (
    <View style={[styles.bg, backgroundStyle]}>
      {renderAmbientAnimation()}
      {TabbedContent}
    </View>
  );
};

export default HomepageTabs;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bgImage: {
    opacity: 0.75,
  },
  overlay: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#1e293b",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginHorizontal: 6,
    borderRadius: 18,
  },
  activeTab: {
    backgroundColor: "#2563eb",
  },
  tabLabel: {
    color: "#cbd5f5",
    fontWeight: "700",
    fontSize: 16,
  },
  activeTabLabel: {
    color: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
    width: "100%",
    alignSelf: "stretch",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
  },
  tabContentTop: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 32,
    marginTop: 0,
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
  },
  welcome: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
  },
  animatedBackground: {
    backgroundColor: "#0b1329",
    overflow: "hidden",
  },
  pulseCircle: {
    position: "absolute",
    top: "35%",
    width: 300,
    height: 300,
    borderRadius: 300,
    borderWidth: 2,
    borderColor: "rgba(79,70,229,0.4)",
    backgroundColor: "rgba(99,102,241,0.15)",
  },
  pulseLeft: {
    left: -140,
    top: "20%",
  },
  pulseRight: {
    right: -140,
    top: "60%",
  },
  createPulseLarge: {
    borderWidth: 3,
  },
  createPulseSmall: {
    width: 220,
    height: 220,
    borderRadius: 220,
    borderColor: "rgba(59,130,246,0.4)",
  },
  ticket: {
    position: "absolute",
    width: 160,
    height: 90,
    borderRadius: 18,
    backgroundColor: "rgba(15, 23, 42, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.2)",
  },
  ticketLeft: {
    top: "18%",
    left: -30,
  },
  ticketRight: {
    bottom: "18%",
    right: -30,
  },
  ticketCenter: {
    top: "52%",
    right: "15%",
  },
  lightSweep: {
    position: "absolute",
    top: "20%",
    left: -200,
    width: 900,
    height: 160,
    borderRadius: 160,
    backgroundColor: "rgba(255,255,255,0.08)",
    shadowColor: "#fff",
    shadowOpacity: 0.6,
    shadowRadius: 24,
  },
  lightSweepSecondary: {
    top: "55%",
    width: 650,
    height: 120,
  },
  spark: {
    position: "absolute",
    width: 18,
    height: 90,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    shadowColor: "#f8fafc",
    shadowOpacity: 0.6,
    shadowRadius: 18,
  },
  sparkLeft: {
    left: "18%",
    bottom: -40,
  },
  sparkCenter: {
    left: "48%",
    bottom: -60,
  },
  sparkRight: {
    right: "16%",
    bottom: -50,
  },
  cornerRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cornerRingLeft: {
    top: "10%",
    left: "5%",
  },
  cornerRingRight: {
    bottom: "10%",
    right: "5%",
  },
});
