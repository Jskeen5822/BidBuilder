import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  useProjects,
  sortOptions,
  getBestBid,
  getBidByBidder,
} from "./context/ProjectsContext";

const HomeScreen = ({
  showCreateProjectOnly,
  showBidOnly,
  backgroundColor = "#e0e7ef",
}) => {
  const {
    projects,
    sortOrder,
    setSortOrder,
    createProject,
    addBid,
    acceptLowestBid,
    syncError,
  } = useProjects();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {!showCreateProjectOnly && !showBidOnly && (
        <View style={styles.hero}>
        <Text style={styles.eyebrow}>Bidzilla</Text>
          <Text style={styles.title}>
            List your project. Invite bids. Choose the best offer.
          </Text>
          <Text style={styles.lead}>
            A single workspace where construction firms or homeowners can post
            scopes, track offers in real time, and lock in the lowest price on any
            device.
          </Text>
        </View>
      )}

      {(showCreateProjectOnly || (!showCreateProjectOnly && !showBidOnly)) && (
        <SectionCard title="Create a Project" wide>
          <ProjectForm onSubmit={createProject} />
        </SectionCard>
      )}

      {(showBidOnly || (!showCreateProjectOnly && !showBidOnly)) && (
        <SectionCard title="Open Projects" subtitle="Tap a pill to reorder">
          {syncError ? <Text style={styles.syncAlert}>{syncError}</Text> : null}
          <SortTabs value={sortOrder} onChange={setSortOrder} />
          {projects.length ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onAddBid={addBid}
                onAcceptLowest={acceptLowestBid}
              />
            ))
          ) : (
            <Text style={styles.emptyState}>
              No projects yet - use the form above to add one.
            </Text>
          )}
        </SectionCard>
      )}
    </ScrollView>
  );
};

const SectionCard = ({ title, subtitle, children, wide }) => (
  <View style={[styles.card, wide && styles.cardWide]}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
    </View>
    {children}
  </View>
);

const SortTabs = ({ value, onChange }) => (
  <View style={styles.sortTabs}>
    {sortOptions.map((option) => {
      const isActive = option.value === value;
      return (
        <Pressable
          key={option.value}
          style={[styles.sortTab, isActive && styles.sortTabActive]}
          onPress={() => onChange(option.value)}
        >
          <Text
            style={[styles.sortLabel, isActive && styles.sortLabelActive]}
          >
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const ProjectForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    owner: "",
    budget: "",
    dueDate: "",
    scope: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const name = form.name.trim();
    const owner = form.owner.trim();
    const budget = Number(form.budget);
    const dueDate = form.dueDate.trim();
    const scope = form.scope.trim();
    if (!name || !owner || !budget || !dueDate || !scope) {
      return;
    }
    onSubmit({ name, owner, budget, dueDate, scope });
    setForm({ name: "", owner: "", budget: "", dueDate: "", scope: "" });
  };

  return (
    <View style={styles.form}>
      <LabeledInput
        label="Project name"
        value={form.name}
        onChangeText={(value) => handleChange("name", value)}
        placeholder="East 5th Street Townhomes"
      />
      <LabeledInput
        label="Owner / requester"
        value={form.owner}
        onChangeText={(value) => handleChange("owner", value)}
        placeholder="City of Athens"
      />
      <LabeledInput
        label="Budget (USD)"
        value={form.budget}
        onChangeText={(value) => handleChange("budget", value)}
        placeholder="250000"
        keyboardType="numeric"
      />
      <LabeledInput
        label="Target completion date"
        value={form.dueDate}
        onChangeText={(value) => handleChange("dueDate", value)}
        placeholder="2025-12-01"
      />
      <LabeledInput
        label="Scope highlights"
        value={form.scope}
        onChangeText={(value) => handleChange("scope", value)}
        placeholder="Briefly describe the major work items"
        multiline
      />
      <PrimaryButton label="Publish project" onPress={handleSubmit} />
    </View>
  );
};

const ProjectCard = ({ project, onAddBid, onAcceptLowest }) => {
  const bestBid = getBestBid(project.bids);
  const winningBid = project.winner
    ? getBidByBidder(project.bids, project.winner)
    : null;

  return (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <View>
          <Text style={styles.eyebrow}>{project.owner}</Text>
          <Text style={styles.projectName}>{project.name}</Text>
        </View>
        <View style={styles.metaGroup}>
          <Text style={styles.metaText}>{project.id}</Text>
          <Text style={styles.metaText}>{formatDate(project.dueDate)}</Text>
        </View>
      </View>
      <Text style={styles.scopeText}>{project.scope}</Text>

      <View style={styles.summaryRow}>
        <SummaryItem label="Budget" value={formatCurrency(project.budget)} />
        <SummaryItem
          label="Best bid"
          value={bestBid ? formatCurrency(bestBid.amount) : "N/A"}
        />
        <SummaryItem
          label="Bids received"
          value={`${project.bids.length}`}
        />
      </View>

      {project.winner ? (
        <View style={styles.winnerCard}>
          <Text style={styles.winnerLabel}>Selected contractor</Text>
          <Text style={styles.winnerCopy}>
            {project.winner}
            {winningBid ? ` at ${formatCurrency(winningBid.amount)}` : ""}
          </Text>
        </View>
      ) : null}

      <BidForm onSubmit={(bid) => onAddBid(project.id, bid)} />

      <View style={styles.bidBoard}>
        <View style={styles.bidBoardHeader}>
          <Text style={styles.bidBoardTitle}>Bid Board</Text>
          <SecondaryButton
            label="Accept lowest bid"
            onPress={() => onAcceptLowest(project.id)}
            disabled={!bestBid}
          />
        </View>

        {project.bids.length ? (
          project.bids
            .slice()
            .sort((a, b) => a.amount - b.amount)
            .map((bid) => {
              const isWinner = project.winner === bid.bidder;
              const isBest =
                !isWinner && bestBid && bid.amount === bestBid.amount;
              return (
                <View
                  key={`${project.id}-${bid.bidder}-${bid.amount}`}
                  style={[
                    styles.bidRow,
                    isWinner && styles.bidRowWinner,
                    isBest && styles.bidRowBest,
                  ]}
                >
                  <Text style={styles.bidderName}>{bid.bidder}</Text>
                  <Text style={styles.bidAmount}>
                    {formatCurrency(bid.amount)}
                  </Text>
                  <Text style={styles.bidTimeline}>{bid.timeline}</Text>
                </View>
              );
            })
        ) : (
          <Text style={styles.emptyRow}>
            No bids yet - share this project to invite offers.
          </Text>
        )}
      </View>
    </View>
  );
};

const BidForm = ({ onSubmit }) => {
  const [bidder, setBidder] = useState("");
  const [amount, setAmount] = useState("");
  const [timeline, setTimeline] = useState("");

  const handleBidSubmit = () => {
    const bidderName = bidder.trim();
    const price = Number(amount);
    const timelineCopy = timeline.trim();
    if (!bidderName || !price || !timelineCopy) return;
    onSubmit({ bidder: bidderName, amount: price, timeline: timelineCopy });
    setBidder("");
    setAmount("");
    setTimeline("");
  };

  return (
    <View style={styles.bidForm}>
      <Text style={styles.bidFormTitle}>Add a Bid</Text>
      <LabeledInput
        label="Company / bidder"
        value={bidder}
        onChangeText={setBidder}
        placeholder="Acme Builders"
      />
      <LabeledInput
        label="Bid amount (USD)"
        value={amount}
        onChangeText={setAmount}
        placeholder="180000"
        keyboardType="numeric"
      />
      <LabeledInput
        label="Timeline"
        value={timeline}
        onChangeText={setTimeline}
        placeholder="120 days turnkey"
      />
      <SecondaryButton label="Submit bid" onPress={handleBidSubmit} />
    </View>
  );
};

const SummaryItem = ({ label, value }) => (
  <View style={styles.summaryItem}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

const LabeledInput = ({ label, multiline, ...inputProps }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      {...inputProps}
      multiline={multiline}
      style={[styles.input, multiline && styles.textarea]}
      placeholderTextColor="#94a3b8"
    />
  </View>
);

const PrimaryButton = ({ label, onPress }) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      styles.primaryButton,
      pressed && styles.buttonPressed,
    ]}
    onPress={onPress}
  >
    <Text style={styles.primaryButtonLabel}>{label}</Text>
  </Pressable>
);

const SecondaryButton = ({ label, onPress, disabled }) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      styles.secondaryButton,
      disabled && styles.buttonDisabled,
      pressed && !disabled && styles.buttonPressed,
    ]}
    onPress={disabled ? undefined : onPress}
  >
    <Text style={styles.secondaryButtonLabel}>{label}</Text>
  </Pressable>
);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e0e7ef",
    width: "100%",
    alignSelf: "stretch",
  },
  content: {
    padding: 24,
    gap: 24,
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
    maxWidth: 1320,
    alignSelf: "center",
  },
  hero: {
    backgroundColor: "#0f172a",
    borderRadius: 32,
    padding: 32,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    marginBottom: 12,
    width: "100%",
    maxWidth: 900,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "#1e293b",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  lead: {
    color: "#cbd5f5",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
  },
  eyebrow: {
    color: "#60a5fa",
    textTransform: "uppercase",
    letterSpacing: 4,
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "900",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#0f172a",
    shadowOpacity: 0.10,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
    gap: 20,
    alignItems: "stretch",
    width: "100%",
    maxWidth: 980,
    alignSelf: "center",
  },
  cardWide: {
    maxWidth: 1320,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 40,
  },
  cardHeader: {
    gap: 4,
    alignItems: "stretch",
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    color: "#64748b",
    textAlign: "center",
    fontSize: 15,
  },
  sortTabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "#1e293b",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  lead: {
    color: "#cbd5f5",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
  },
  eyebrow: {
    color: "#60a5fa",
    textTransform: "uppercase",
    letterSpacing: 4,
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "900",
    textAlign: "center",
  },
    fontWeight: "600",
    color: "#0f172a",
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5f5",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
    fontSize: 16,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  primaryButton: {
    backgroundColor: "#2563eb",
  },
  secondaryButton: {
    backgroundColor: "#0f172a",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  primaryButtonLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButtonLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  projectCard: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 20,
    padding: 16,
    gap: 16,
    backgroundColor: "#fdfdfd",
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  projectName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  metaGroup: {
    alignItems: "flex-end",
    gap: 2,
  },
  metaText: {
    color: "#64748b",
    fontSize: 12,
  },
  scopeText: {
    color: "#475569",
    fontSize: 15,
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryItem: {
    flexGrow: 1,
    minWidth: "30%",
  },
  summaryLabel: {
    color: "#94a3b8",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  winnerCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bae6fd",
    backgroundColor: "#e0f2fe",
    padding: 14,
    gap: 4,
  },
  winnerLabel: {
    fontWeight: "700",
    color: "#0369a1",
  },
  winnerCopy: {
    color: "#0f172a",
    fontSize: 16,
  },
  bidForm: {
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 14,
  },
  bidFormTitle: {
    fontWeight: "700",
    color: "#0f172a",
  },
  bidBoard: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  bidBoardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  bidBoardTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
  bidRow: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cbd5f5",
    padding: 12,
    marginBottom: 8,
  },
  bidRowBest: {
    backgroundColor: "#ecfccb",
    borderColor: "#bef264",
  },
  bidRowWinner: {
    backgroundColor: "#d9f99d",
    borderColor: "#84cc16",
  },
  bidderName: {
    fontWeight: "700",
    color: "#0f172a",
  },
  bidAmount: {
    color: "#0f172a",
    fontSize: 16,
  },
  bidTimeline: {
    color: "#475569",
  },
  emptyRow: {
    color: "#94a3b8",
    fontStyle: "italic",
  },
  emptyState: {
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
    paddingVertical: 20,
    fontSize: 18,
  },
  syncAlert: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
});

export default HomeScreen;
