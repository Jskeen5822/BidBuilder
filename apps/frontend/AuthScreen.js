import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { login, register } from "./api/client";

const AuthScreen = ({ onBackHome }) => {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please add an email and password.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      Alert.alert("Missing info", "Add your name so we can personalize your account.");
      return;
    }

    setProcessing(true);
    setStatus(mode === "signin" ? "Signing you in..." : "Creating your account...");
    try {
      const payload =
        mode === "signin"
          ? await login({ email: email.trim(), password: password.trim() })
          : await register({
              name: name.trim(),
              email: email.trim(),
              password: password.trim(),
              company: company.trim(),
            });

      Alert.alert(
        mode === "signin" ? "Welcome back!" : "Account created",
        mode === "signin"
          ? "You are signed in. Connect a database to store sessions next."
          : "We saved your account. Database wiring comes next."
      );
      setStatus(
        mode === "signin"
          ? `Signed in as ${payload?.user?.email || email}`
          : `Registered ${payload?.user?.email || email}`
      );
    } catch (error) {
      Alert.alert("Auth failed", error?.message || "Please try again.");
      setStatus("");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.eyebrow}>Account</Text>
          <Text style={styles.title}>
            {mode === "signin" ? "Sign in to Bidzilla" : "Create an account"}
          </Text>
          <Text style={styles.lead}>
            Secure access for contractors across Ohio and the U.S. Wire this into your
            database tomorrow and you&apos;re production ready.
          </Text>
        </View>

        {mode === "signup" && (
          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Jordan Smith"
              placeholderTextColor="#8fb3e4"
              style={styles.input}
            />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@company.com"
            placeholderTextColor="#8fb3e4"
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#8fb3e4"
            style={styles.input}
            secureTextEntry
          />
        </View>

        {mode === "signup" && (
          <View style={styles.field}>
            <Text style={styles.label}>Company (optional)</Text>
            <TextInput
              value={company}
              onChangeText={setCompany}
              placeholder="Buckeye Builders LLC"
              placeholderTextColor="#8fb3e4"
              style={styles.input}
            />
          </View>
        )}

        {status ? <Text style={styles.status}>{status}</Text> : null}

        <View style={styles.actions}>
          <Pressable
            style={({ hovered, pressed }) => [
              styles.button,
              styles.primary,
              hovered && styles.buttonHover,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleAuth}
            disabled={processing}
          >
            <Text style={styles.primaryLabel}>
              {processing ? "Working..." : mode === "signin" ? "Sign in" : "Create account"}
            </Text>
          </Pressable>

          <Pressable
            style={({ hovered, pressed }) => [
              styles.button,
              styles.secondary,
              hovered && styles.buttonHover,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
            disabled={processing}
          >
            <Text style={styles.secondaryLabel}>
              {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
            </Text>
          </Pressable>

          <Pressable
            style={({ hovered }) => [
              styles.linkButton,
              hovered && styles.buttonHover,
            ]}
            onPress={onBackHome}
          >
            <Text style={styles.linkLabel}>Back to home</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    padding: 24,
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(12,12,22,0.92)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    width: "100%",
    maxWidth: 620,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  cardHeader: {
    gap: 8,
  },
  eyebrow: {
    color: "#f472b6",
    textTransform: "uppercase",
    letterSpacing: 5,
    fontSize: 13,
    fontWeight: "900",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#f8fafc",
    letterSpacing: 0.5,
  },
  lead: {
    color: "#cbd5f5",
    fontSize: 16,
    lineHeight: 22,
  },
  field: {
    gap: 6,
  },
  label: {
    color: "#c7d2fe",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontSize: 12,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    fontSize: 16,
    color: "#f8fafc",
  },
  status: {
    color: "#7dd3fc",
    fontWeight: "700",
    marginTop: 4,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  primary: {
    backgroundColor: "#ec4899",
    borderColor: "#fb7185",
  },
  secondary: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.18)",
  },
  primaryLabel: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryLabel: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: 15,
  },
  linkButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  linkLabel: {
    color: "#f472b6",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  buttonHover: {
    transform: [{ translateY: -2 }],
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
});
