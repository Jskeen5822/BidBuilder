import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
import bgImage from "./assets/Sunset-over-construction-site-2011-alon-eisenberg.jpeg";
import HomeScreen from "./HomeScreen";
import AuthScreen from "./AuthScreen";

const TABS = [
  { key: "home", label: "Home" },
  { key: "create", label: "Create Project" },
  { key: "bid", label: "Bid" },
  { key: "auth", label: "Account" },
];

const NeonBackdrop = () => (
  <>
    <View pointerEvents="none" style={[styles.glow, styles.glowPink]} />
    <View pointerEvents="none" style={[styles.glow, styles.glowPurple]} />
    <View pointerEvents="none" style={[styles.glow, styles.glowBlue]} />
  </>
);

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

  const content =
    activeTab === "create" ? (
      <HomeScreen showCreateProjectOnly backgroundColor="transparent" />
    ) : activeTab === "bid" ? (
      <HomeScreen showBidOnly backgroundColor="transparent" />
    ) : activeTab === "auth" ? (
      <AuthScreen onBackHome={() => setActiveTab("home")} />
    ) : (
      <View style={styles.heroWrap}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Ohio-Born. Contractor Ready.</Text>
          <Text style={styles.heroTitle}>America&#39;s Bid Club</Text>
          <Text style={styles.heroLead}>
            Invite verified contractors, collect detailed offers, and pick the winner with
            confidence. Built for Ohio crews and trusted across the U.S.
          </Text>
          <View style={styles.heroActions}>
            <Pressable
              style={({ pressed, hovered }) => [
                styles.heroButton,
                styles.heroButtonPrimary,
                hovered && styles.buttonHover,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setActiveTab("auth")}
            >
              <Text style={styles.heroButtonPrimaryLabel}>Sign in</Text>
            </Pressable>
            <Pressable
              style={({ pressed, hovered }) => [
                styles.heroButton,
                styles.heroButtonGhost,
                hovered && styles.buttonHover,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setActiveTab("create")}
            >
              <Text style={styles.heroButtonGhostLabel}>Start a project</Text>
            </Pressable>
          </View>
          <Pressable
            style={({ hovered }) => [
              styles.linkRow,
              hovered && styles.linkRowHover,
            ]}
            onPress={() => setActiveTab("auth")}
          >
            <Text style={styles.linkText}>Need an account?</Text>
            <Text style={styles.linkCTA}>Create one now</Text>
          </Pressable>
        </View>
        <View style={styles.heroStats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$1.2M</Text>
            <Text style={styles.statLabel}>Awarded this month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>48</Text>
            <Text style={styles.statLabel}>Ohio crews bidding</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24h</Text>
            <Text style={styles.statLabel}>Avg. time to first bid</Text>
          </View>
        </View>
      </View>
    );

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
            style={({ hovered }) => [
              styles.tab,
              activeTab === tab.key && styles.activeTab,
              hovered && styles.tabHover,
            ]}
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
      <NeonBackdrop />
      {renderAmbientAnimation()}
      {TabbedContent}
    </View>
  );
};

export default HomepageTabs;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bgImage: {
    opacity: 0.65,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(5,6,13,0.9)",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginHorizontal: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  activeTab: {
    backgroundColor: "rgba(236,72,153,0.18)",
    borderColor: "#e879f9",
    shadowColor: "#e879f9",
    shadowOpacity: 0.45,
    shadowRadius: 12,
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
    color: "#f8fafc",
    textAlign: "center",
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
  },
  tabHover: {
    transform: [{ translateY: -2 }],
  },
  heroWrap: {
    width: "100%",
    maxWidth: 1180,
    gap: 16,
    paddingVertical: 20,
  },
  heroCard: {
    backgroundColor: "rgba(5,6,13,0.75)",
    padding: 24,
    borderRadius: 20,
    maxWidth: 720,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
  },
  eyebrow: {
    color: "#f472b6",
    textTransform: "uppercase",
    letterSpacing: 5,
    fontSize: 13,
    fontWeight: "900",
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#f8fafc",
    letterSpacing: 0.6,
    textShadowColor: "#0ea5e9",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroLead: {
    color: "#cbd5f5",
    fontSize: 18,
    lineHeight: 26,
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 8,
  },
  heroButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
  },
  buttonHover: {
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  heroButtonPrimary: {
    backgroundColor: "#ec4899",
    borderColor: "#fb7185",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  heroButtonGhost: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.14)",
  },
  heroButtonPrimaryLabel: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  heroButtonGhostLabel: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: 16,
  },
  linkRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 8,
  },
  linkRowHover: {
    opacity: 0.9,
    transform: [{ translateY: -1 }],
  },
  linkText: {
    color: "#cbd5f5",
    fontWeight: "600",
  },
  linkCTA: {
    color: "#f472b6",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: "rgba(5,6,13,0.7)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  statValue: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "900",
  },
  statLabel: {
    color: "#cbd5f5",
    fontSize: 13,
    marginTop: 2,
  },
  animatedBackground: {
    backgroundColor: "#05060d",
    overflow: "hidden",
  },
  pulseCircle: {
    position: "absolute",
    top: "35%",
    width: 300,
    height: 300,
    borderRadius: 300,
    borderWidth: 2,
    borderColor: "rgba(226,52,161,0.32)",
    backgroundColor: "rgba(109,40,217,0.18)",
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
    borderColor: "rgba(56,189,248,0.4)",
  },
  ticket: {
    position: "absolute",
    width: 160,
    height: 90,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
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
    backgroundColor: "rgba(255,255,255,0.12)",
    shadowColor: "#c084fc",
    shadowOpacity: 0.45,
    shadowRadius: 30,
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
    backgroundColor: "rgba(56,189,248,0.25)",
    shadowColor: "#22d3ee",
    shadowOpacity: 0.8,
    shadowRadius: 24,
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
    borderColor: "rgba(255,255,255,0.18)",
  },
  cornerRingLeft: {
    top: "10%",
    left: "5%",
  },
  cornerRingRight: {
    bottom: "10%",
    right: "5%",
  },
  glow: {
    position: "absolute",
    borderRadius: 600,
    opacity: 0.5,
    width: 520,
    height: 520,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 120,
    shadowOffset: { width: 0, height: 0 },
  },
  glowPink: {
    backgroundColor: "rgba(226,52,161,0.65)",
    top: -120,
    left: -120,
  },
  glowPurple: {
    backgroundColor: "rgba(109,40,217,0.6)",
    bottom: -140,
    right: -80,
  },
  glowBlue: {
    backgroundColor: "rgba(14,165,233,0.6)",
    bottom: 80,
    left: "30%",
  },
});
