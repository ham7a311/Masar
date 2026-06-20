import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Menu } from "lucide-react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardBottomNav from "../components/dashboard/DashboardBottomNav";
import { useDashboardLayout } from "../hooks/useDashboardLayout";
import ExploreCareerPath from "../components/dashboard/ExploreCareerPath";
import DashboardSettings from "../components/dashboard/DashboardSettings";
import DashboardPlaceholder from "../components/dashboard/DashboardPlaceholder";
import ResourcesSection from "../components/resources/ResourcesSection";
import ResourcesComingSoon from "../components/resources/ResourcesComingSoon";
import {
  buildResourceUserProfile,
  getResourceCatalogGroup,
  getResourcesForCatalog,
  majorHasResourceCatalog,
} from "../utils/resourceProfile";
import {
  getUserProfile,
  getUserProfileFromServer,
  isOnboardingComplete,
  saveUserProfile,
  waitForOnboardingProfile,
} from "../services/userProfile";
import {
  computeStreakFromDates,
  loadEngagement,
  recordEngagementActivity,
  saveEngagement,
} from "../services/engagement";
import {
  loadTopicLearning,
  saveTopicMastery,
  saveTopicNotes,
} from "../services/topicLearning";
import { auth } from "../firebase";
import {
  getNextStudyYear,
  loadPriorityTopics,
  savePriorityTopics,
  togglePriorityTopic,
} from "../utils/topicProgress";
import { normalizeYearValue } from "../utils/studyPeriod";
import { computeCompletedStudyPeriods } from "../utils/studyPeriodCompletion";
import { useTheme } from "../context/ThemeContext";
import { themeFromProfile } from "../utils/theme";

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeView, setActiveView] = useState("explore");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [topicMastery, setTopicMastery] = useState({});
  const [topicNotes, setTopicNotes] = useState({});
  const [priorityTopics, setPriorityTopics] = useState({});
  const [engagement, setEngagement] = useState(null);
  const [advancingMilestone, setAdvancingMilestone] = useState(false);
  const layout = useDashboardLayout();
  const showDrawerSidebar = layout === "tablet";
  const showBottomNav = layout === "phone";

  useEffect(() => {
    if (layout !== "tablet") setMobileOpen(false);
  }, [layout]);

  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state?.activeView]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      try {
        let data =
          location.state?.initialProfile &&
          isOnboardingComplete(location.state.initialProfile)
            ? location.state.initialProfile
            : await getUserProfile(user.uid);

        if (!isOnboardingComplete(data)) {
          data = await waitForOnboardingProfile(user.uid, 6);
        }

        if (!isOnboardingComplete(data)) {
          const serverData = await getUserProfileFromServer(user.uid);
          if (isOnboardingComplete(serverData)) data = serverData;
        }

        if (!isOnboardingComplete(data)) {
          navigate("/onboarding", { replace: true });
          return;
        }

        const [learning, eng] = await Promise.all([
          loadTopicLearning(user.uid),
          loadEngagement(user.uid),
        ]);
        const { current } = computeStreakFromDates(eng.activityDates);

        setUid(user.uid);
        const currentStudyPeriod =
          data.currentStudyPeriod || data.year;
        setProfile(
          data.currentStudyPeriod
            ? data
            : { ...data, currentStudyPeriod }
        );
        const profileTheme = themeFromProfile(data);
        if (profileTheme) setTheme(profileTheme);
        setTopicMastery(learning.topicMastery);
        setTopicNotes(learning.topicNotes);
        setPriorityTopics(loadPriorityTopics(user.uid));
        setEngagement({ ...eng, currentStreak: current });
      } catch {
        navigate("/onboarding", { replace: true });
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [navigate, setTheme, location.state]);

  const recordActivity = useCallback(
    (topicId) => {
      if (!uid) return;
      setEngagement((prev) => {
        if (!prev) return prev;
        const next = recordEngagementActivity(prev, { topicId });
        saveEngagement(uid, next);
        return next;
      });
    },
    [uid]
  );

  const handleNavigate = (view) => {
    setActiveView(view);
    setMobileOpen(false);
  };

  const syncCompletedStudyPeriods = useCallback(
    (masteryMap) => {
      if (!uid || !profile) return;
      const completed = computeCompletedStudyPeriods(profile, masteryMap);
      saveUserProfile(uid, { completedStudyPeriods: completed });
      setProfile((p) => (p ? { ...p, completedStudyPeriods: completed } : p));
    },
    [uid, profile]
  );

  const handleMasteryChange = useCallback(
    (topicId, mastery) => {
      if (!uid) return;
      recordActivity(topicId);
      setTopicMastery((prev) => {
        const next = { ...prev, [topicId]: mastery };
        saveTopicMastery(uid, next);
        syncCompletedStudyPeriods(next);
        return next;
      });
    },
    [uid, recordActivity, syncCompletedStudyPeriods]
  );

  const handleBulkMasteryChange = useCallback(
    (topicIds, mastery = "mastered") => {
      if (!uid || !topicIds?.length) return;
      recordActivity(topicIds[0]);
      setTopicMastery((prev) => {
        const next = { ...prev };
        for (const id of topicIds) {
          next[id] = mastery;
        }
        saveTopicMastery(uid, next);
        syncCompletedStudyPeriods(next);
        return next;
      });
    },
    [uid, recordActivity, syncCompletedStudyPeriods]
  );

  const handleNotesSave = useCallback(
    (topicId, notes) => {
      if (!uid) return;
      recordActivity(topicId);
      setTopicNotes((prev) => {
        const next = { ...prev, [topicId]: notes };
        saveTopicNotes(uid, topicId, notes);
        return next;
      });
    },
    [uid, recordActivity]
  );

  const handlePriorityToggle = useCallback(
    (topicId) => {
      if (!uid) return;
      recordActivity(topicId);
      setPriorityTopics((prev) => {
        const next = togglePriorityTopic(prev, topicId);
        savePriorityTopics(uid, next);
        return next;
      });
    },
    [uid, recordActivity]
  );

  const handleTopicOpen = useCallback(
    (topicId) => {
      recordActivity(topicId);
    },
    [recordActivity]
  );

  const handleAdvanceMilestone = useCallback(async () => {
    if (!uid || !profile?.year) return;
    const currentPeriod = normalizeYearValue(
      profile.currentStudyPeriod || profile.year
    );
    const nextPeriod = getNextStudyYear(currentPeriod);
    if (!nextPeriod) return;

    setAdvancingMilestone(true);
    try {
      const nextProfile = {
        ...profile,
        year: nextPeriod,
        currentStudyPeriod: nextPeriod,
      };
      const completedStudyPeriods = computeCompletedStudyPeriods(
        nextProfile,
        topicMastery
      );
      await saveUserProfile(uid, {
        year: nextPeriod,
        currentStudyPeriod: nextPeriod,
        completedStudyPeriods,
      });
      setProfile((p) => ({
        ...p,
        year: nextPeriod,
        currentStudyPeriod: nextPeriod,
        completedStudyPeriods,
      }));
      recordActivity();
    } finally {
      setAdvancingMilestone(false);
    }
  }, [uid, profile, topicMastery, recordActivity]);

  const handleEngagementUpdate = useCallback(
    (patch) => {
      if (!uid) return;
      setEngagement((prev) => {
        const next = { ...prev, ...patch };
        saveEngagement(uid, next);
        return next;
      });
    },
    [uid]
  );

  const handleProfileUpdate = (updated) => {
    setProfile(updated);
  };

  const handleProfileSaved = (updated) => {
    setProfile(updated);
  };

  if (loading || !profile) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-spinner" aria-hidden="true" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dash-layout">
      <div className="dash-grid-bg" aria-hidden="true" />

      {(layout === "desktop" || showDrawerSidebar) && (
        <DashboardSidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          variant={layout === "desktop" ? "sidebar" : "drawer"}
        />
      )}

      {showBottomNav && (
        <DashboardBottomNav activeView={activeView} onNavigate={handleNavigate} />
      )}

      <div className="dash-main">
        {showDrawerSidebar && (
          <div className="dash-main-top">
            <button
              type="button"
              className="dash-mobile-toggle"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        )}

        <div className="dash-main-content">
          {activeView === "explore" && (
            <ExploreCareerPath
              profile={profile}
              topicMastery={topicMastery}
              topicNotes={topicNotes}
              priorityTopics={priorityTopics}
              engagement={engagement}
              strictPriorityMode={Boolean(profile?.strictPriorityMode)}
              onMasteryChange={handleMasteryChange}
              onBulkMasteryChange={handleBulkMasteryChange}
              onNotesSave={handleNotesSave}
              onPriorityToggle={handlePriorityToggle}
              onTopicOpen={handleTopicOpen}
              onEngagementUpdate={handleEngagementUpdate}
              onAdvanceMilestone={handleAdvanceMilestone}
              advancingMilestone={advancingMilestone}
            />
          )}
          {activeView === "profile" && (
            <DashboardSettings
              profile={profile}
              uid={uid}
              engagement={engagement}
              onProfileUpdate={handleProfileUpdate}
              onSaved={handleProfileSaved}
              topicMastery={topicMastery}
              priorityTopics={priorityTopics}
            />
          )}
          {activeView === "resources" &&
            (majorHasResourceCatalog(profile?.major) ? (
              <ResourcesSection
                resources={getResourcesForCatalog(getResourceCatalogGroup(profile.major))}
                userProfile={buildResourceUserProfile(profile)}
                majorLabel={profile?.major}
                variant="dashboard"
                profileLinkTo="/dashboard"
              />
            ) : (
              <ResourcesComingSoon variant="dashboard" majorLabel={profile?.major} />
            ))}
          {["roadmaps", "community"].includes(activeView) && (
            <DashboardPlaceholder view={activeView} />
          )}
        </div>
      </div>
    </div>
  );
}
