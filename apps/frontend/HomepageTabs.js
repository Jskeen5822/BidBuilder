import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ImageBackground, Animated, Easing } from "react-native";
import bgImage from "./assets/silhouette-man-working-at-construction-site-against-sky-during-sunset-EYF04002.jpg";
import HomeScreen from "./HomeScreen";

const TABS = [
  { key: "home", label: "Home" },
  { key: "create", label: "Create Project" },
  { key: "bid", label: "Bid on Project" },
];

  const [activeTab, setActiveTab] = useState("home");
  const [gradientAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (activeTab !== "home") {
      Animated.loop(
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    }
  }, [activeTab]);

  let content;
  if (activeTab === "home") {
    content = (
      <View style={styles.tabContentTop}><Text style={styles.welcome}>Welcome to BidBuilder!</Text></View>
    );
  } else if (activeTab === "create") {
    content = <HomeScreen showCreateProjectOnly />;
  } else if (activeTab === "bid") {
    content = <HomeScreen showBidOnly />;
  }

  // Animated gradient colors
  const gradientColors = gradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
      "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
    ]
  });

  return (
    activeTab === "home" ? (
      <ImageBackground
        source={bgImage}
        style={styles.bg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.tabBar}>
            {TABS.map((tab) => (
              <Pressable
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>{tab.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.content}>{content}</View>
        </View>
      </ImageBackground>
    ) : (
      <Animated.View style={[styles.bg, {background: gradientColors}]}> 
        <View style={styles.overlay}>
          <View style={styles.tabBar}>
            {TABS.map((tab) => (
              <Pressable
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>{tab.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.content}>{content}</View>
        </View>
      </Animated.View>
    )
  );
}

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
});
