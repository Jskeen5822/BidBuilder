import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ImageBackground, Animated, Easing } from "react-native";
import bgImage from "./assets/silhouette-man-working-at-construction-site-against-sky-during-sunset-EYF04002.jpg";
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
        <Text style={styles.welcome}>Welcome to BidBuilder!</Text>
      </View>
    );
  } else if (activeTab === "create") {
    content = <HomeScreen showCreateProjectOnly />;
  } else if (activeTab === "bid") {
    content = <HomeScreen showBidOnly />;
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

  const swirlRotation = motionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderSwirlLights = () => (
    <Animated.View
      pointerEvents="none"
      style={[styles.swirlOrbit, { transform: [{ rotate: swirlRotation }] }]}
    >
      <View style={[styles.swirlLight, styles.swirlLightA]} />
      <View style={[styles.swirlLight, styles.swirlLightB]} />
      <View style={[styles.swirlLight, styles.swirlLightC]} />
    </Animated.View>
  );

  const renderAmbientAnimation = () => {
    if (activeTab === "create") {
      return (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseCircle,
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
              styles.createPulseSmall,
              {
                transform: [{ scale: createPulseScaleInner }],
                opacity: createPulseOpacity,
              },
            ]}
          />
          {renderSwirlLights()}
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
          {renderSwirlLights()}
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
    left: "50%",
    marginLeft: -150,
    marginTop: -150,
    width: 300,
    height: 300,
    borderRadius: 300,
    borderWidth: 2,
    borderColor: "rgba(79,70,229,0.4)",
    backgroundColor: "rgba(99,102,241,0.15)",
  },
  createPulseLarge: {
    borderWidth: 3,
  },
  createPulseSmall: {
    width: 220,
    height: 220,
    marginLeft: -110,
    marginTop: -110,
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
    top: "25%",
    left: "15%",
  },
  ticketRight: {
    bottom: "20%",
    right: "12%",
  },
  ticketCenter: {
    top: "55%",
    right: "30%",
  },
  swirlOrbit: {
    position: "absolute",
    top: "10%",
    left: "50%",
    width: 500,
    height: 500,
    marginLeft: -250,
    borderRadius: 500,
  },
  swirlLight: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.35)",
    shadowColor: "#fff",
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  swirlLightA: {
    top: 0,
    left: "45%",
  },
  swirlLightB: {
    bottom: 60,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  swirlLightC: {
    bottom: 0,
    left: 20,
    width: 24,
    height: 24,
    borderRadius: 24,
  },
});
