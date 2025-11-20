import React, { useMemo, useState } from "react";
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
  backgroundColor = "rgba(5,6,13,0.85)",
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
  const [bidFilter, setBidFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const visibleProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch =
        !term ||
        project.name.toLowerCase().includes(term) ||
        project.owner.toLowerCase().includes(term) ||
        project.id.toLowerCase().includes(term);

      let matchesFilter = true;
      switch (bidFilter) {
        case "needs":
          matchesFilter = project.bids.length === 0;
          break;
        case "awarded":
          matchesFilter = Boolean(project.winner);
          break;
        case "high":
          matchesFilter = project.budget >= 250000;
          break;
        case "efficient":
          matchesFilter = project.bids.length > 0 && project.bids.length <= 2;
          break;
        case "dueSoon":
          matchesFilter =
            new Date(project.dueDate).getTime() - Date.now() <
            1000 * 60 * 60 * 24 * 120;
          break;
        default:
          matchesFilter = true;
      }
      return matchesFilter && matchesSearch;
    });
  }, [projects, bidFilter, searchTerm]);

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
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>Ohio & nationwide coverage</Text>
            <Text style={styles.badge}>Secure API ready for database sync</Text>
            <Text style={styles.badge}>Fast bids with transparent filters</Text>
          </View>
        </View>
      )}

      {(showCreateProjectOnly || (!showCreateProjectOnly && !showBidOnly)) && (
        <SectionCard title="Create a Project" wide>
          <ProjectForm onSubmit={createProject} />
        </SectionCard>
      )}

      {(showBidOnly || (!showCreateProjectOnly && !showBidOnly)) && (
        <SectionCard
          title="Open Projects"
          subtitle="Sort, filter, and choose the winning bid"
        >
          {syncError ? <Text style={styles.syncAlert}>{syncError}</Text> : null}
          <SortTabs value={sortOrder} onChange={setSortOrder} />
          <BidFilters
            value={bidFilter}
            onChange={setBidFilter}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
          />
          {visibleProjects.length ? (
            visibleProjects.map((project) => (
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
          style={({ hovered }) => [
            styles.sortTab,
            isActive && styles.sortTabActive,
            hovered && styles.buttonHover,
          ]}
          onPress={() => onChange(option.value)}
        >
          <Text style={[styles.sortLabel, isActive && styles.sortLabelActive]}>
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const BidFilters = ({ value, onChange, searchTerm, onSearch }) => {
  const filterOptions = [
    { label: "All projects", value: "all" },
    { label: "Needs bids", value: "needs" },
    { label: "Awarded", value: "awarded" },
    { label: "$250k+", value: "high" },
    { label: "Quick response (≤2 bids)", value: "efficient" },
    { label: "Due within 120 days", value: "dueSoon" },
  ];

  return (
    <View style={styles.filterWrap}>
      <View style={styles.filterRow}>
        {filterOptions.map((option) => {
          const isActive = option.value === value;
          return (
            <Pressable
              key={option.value}
              style={({ hovered }) => [
                styles.sortTab,
                isActive && styles.sortTabActive,
                hovered && styles.buttonHover,
              ]}
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
      <View style={styles.searchRow}>
        <Text style={styles.searchLabel}>Search</Text>
        <TextInput
          value={searchTerm}
          onChangeText={onSearch}
          placeholder="Search owner, project, or ID"
          placeholderTextColor="#8fb3e4"
          style={styles.searchInput}
        />
      </View>
    </View>
  );
};

  const ProjectForm = ({ onSubmit }) => {
    const [form, setForm] = useState({
      name: "",
      owner: "",
      budget: "",
      dueDate: "",
      scope: "",
    });
    const canSubmit =
      form.name.trim() &&
      form.owner.trim() &&
      Number(form.budget) > 0 &&
      form.dueDate.trim() &&
      form.scope.trim();

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
      <PrimaryButton label="Publish project" onPress={handleSubmit} disabled={!canSubmit} />
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
      placeholderTextColor="#8fb3e4"
    />
  </View>
);

const PrimaryButton = ({ label, onPress, disabled }) => (
  <Pressable
    style={({ pressed, hovered }) => [
      styles.button,
      styles.primaryButton,
      hovered && styles.buttonHover,
      pressed && styles.buttonPressed,
      disabled && styles.buttonDisabled,
    ]}
    onPress={disabled ? undefined : onPress}
    disabled={disabled}
  >
    <Text style={styles.primaryButtonLabel}>{label}</Text>
  </Pressable>
);

const SecondaryButton = ({ label, onPress, disabled }) => (
  <Pressable
    style={({ pressed, hovered }) => [
      styles.button,
      styles.secondaryButton,
      hovered && !disabled && styles.buttonHover,
      disabled && styles.buttonDisabled,
      pressed && !disabled && styles.buttonPressed,
    ]}
    onPress={disabled ? undefined : onPress}
    disabled={disabled}
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
    backgroundColor: "transparent",
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
    backgroundColor: "rgba(10,10,20,0.85)",
    borderRadius: 32,
    padding: 32,
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    marginBottom: 12,
    width: "100%",
    maxWidth: 900,
  },
  eyebrow: {
    color: "#f472b6",
    textTransform: "uppercase",
    letterSpacing: 5,
    fontSize: 13,
    marginBottom: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.8,
    textShadowColor: "#0ea5e9",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  lead: {
    color: "#cbd5f5",
    fontSize: 18,
    textAlign: "center",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 12,
  },
  badge: {
    color: "#f8fafc",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    fontSize: 13,
  },
  card: {
    backgroundColor: "rgba(12,12,22,0.92)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
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
    paddingHorizontal: 32,
  },
  cardHeader: {
    gap: 4,
    alignItems: "stretch",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#f1f5f9",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: 14,
  },
  sortTabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sortTab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  sortTabActive: {
    backgroundColor: "rgba(244,114,182,0.2)",
    borderColor: "#f472b6",
  },
  sortLabel: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  sortLabelActive: {
    color: "#fff7ff",
  },
  filterWrap: {
    gap: 12,
    marginTop: 12,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  searchRow: {
    marginTop: 8,
    gap: 6,
  },
  searchLabel: {
    color: "#c7d2fe",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  searchInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#f8fafc",
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontWeight: "700",
    color: "#c7d2fe",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontSize: 12,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    fontSize: 16,
    color: "#f8fafc",
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonHover: {
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.45,
  },
  primaryButton: {
    backgroundColor: "#ec4899",
    borderWidth: 1,
    borderColor: "#fb7185",
  },
  secondaryButton: {
    backgroundColor: "rgba(59,130,246,0.25)",
    borderWidth: 1,
    borderColor: "#38bdf8",
  },
  buttonDisabled: {
    backgroundColor: "rgba(148,163,184,0.4)",
    borderColor: "rgba(148,163,184,0.6)",
    borderWidth: 1,
  },
  primaryButtonLabel: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  secondaryButtonLabel: {
    color: "#e0f2fe",
    fontWeight: "700",
    fontSize: 16,
  },
  projectCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 16,
    gap: 16,
    backgroundColor: "rgba(15,16,30,0.85)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  projectName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f8fafc",
  },
  metaGroup: {
    alignItems: "flex-end",
    gap: 2,
  },
  metaText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  scopeText: {
    color: "#cbd5f5",
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
    color: "#a855f7",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e2e8f0",
  },
  winnerCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#22d3ee",
    backgroundColor: "rgba(34,211,238,0.12)",
    padding: 14,
    gap: 4,
  },
  winnerLabel: {
    fontWeight: "700",
    color: "#7dd3fc",
  },
  winnerCopy: {
    color: "#e0f2fe",
    fontSize: 16,
  },
  bidForm: {
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  bidFormTitle: {
    fontWeight: "700",
    color: "#f8fafc",
  },
  bidBoard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14,
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
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
    color: "#e2e8f0",
  },
  bidRow: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  bidRowBest: {
    backgroundColor: "rgba(16,185,129,0.12)",
    borderColor: "#22c55e",
  },
  bidRowWinner: {
    backgroundColor: "rgba(45,212,191,0.16)",
    borderColor: "#2dd4bf",
  },
  bidderName: {
    fontWeight: "700",
    color: "#f8fafc",
  },
  bidAmount: {
    color: "#e0f2fe",
    fontSize: 16,
  },
  bidTimeline: {
    color: "#cbd5f5",
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
    backgroundColor: "rgba(239,68,68,0.18)",
    color: "#fecdd3",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.45)",
  },
});

export default HomeScreen;
