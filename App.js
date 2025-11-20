import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import HomepageTabs from "./apps/frontend/HomepageTabs";
import { ProjectsProvider } from "./apps/frontend/context/ProjectsContext";

export default function App() {
  return (
    <ProjectsProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#05060d" }}>
        <StatusBar barStyle="light-content" />
        <HomepageTabs />
      </SafeAreaView>
    </ProjectsProvider>
  );
}
