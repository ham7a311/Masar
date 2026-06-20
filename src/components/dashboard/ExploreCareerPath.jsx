import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { CheckCheck, RotateCcw, Target } from "lucide-react";
import { AccentUnderline } from "../SectionAccent";
import TopicCard from "./TopicCard";
import TopicFocusView from "./TopicFocusView";
import MasteredTopicsSection from "./MasteredTopicsSection";
import ContinueLearningCard from "./ContinueLearningCard";
import CareerReadinessPanel from "./CareerReadinessPanel";
import QuickStatsPanel from "./QuickStatsPanel";
import StreakCelebration from "./StreakCelebration";
import SemesterCompletionModal from "./SemesterCompletionModal";
import NextMilestoneCard from "./NextMilestoneCard";
import ConfirmDialog from "./ConfirmDialog";
import SkillTreeView from "./SkillTreeView";
import PriorityTopicsPanel from "./PriorityTopicsPanel";
import CareerGoalProgressPanel from "./CareerGoalProgressPanel";
import RecommendedNextPanel from "./RecommendedNextPanel";
import { STREAK_MILESTONES } from "../../services/engagement";
import {
  buildSkillTree,
  computeCareerReadiness,
  evaluateAchievements,
  getContinueLearning,
  getRecommendedWithReasons,
  getTopicUnlocks,
  isSemesterComplete,
} from "../../utils/dashboardAnalytics";
import {
  computeRoadmapStats,
  getRoadmapForProfile,
} from "../../data/roadmapTopics";
import {
  computeCareerGoalProgress,
  enrichRoadmapWithCareerContext,
  getGoalLabel,
  isGoalRecommendedTopic,
  normalizeCareerGoal,
  sortTopicsForRoadmap,
} from "../../utils/careerGoal";
import { isMastered, normalizeMastery } from "../../utils/mastery";
import {
  buildPrerequisiteMap,
  computePriorityStats,
  evaluateMilestoneAdvance,
  getIncompletePrerequisites,
  getNextStudyYearLabel,
  getUnfinishedPriorityTopics,
} from "../../utils/topicProgress";
import {
  formatStudyYear,
  formatUniversityShort,
} from "../../utils/profileFormat";

function enrichTopicsWithMastery(topics, topicMastery) {
  return topics.map((topic) => ({
    ...topic,
    mastery: normalizeMastery(topicMastery[topic.id] ?? topic.mastery ?? topic.status),
  }));
}

function partitionTopics(topics, topicMastery) {
  const enriched = enrichTopicsWithMastery(topics, topicMastery);
  return {
    active: enriched.filter((t) => !isMastered(t.mastery)),
    mastered: enriched.filter((t) => isMastered(t.mastery)),
  };
}

export default function ExploreCareerPath({
  profile,
  topicMastery,
  topicNotes,
  priorityTopics,
  engagement,
  strictPriorityMode,
  onMasteryChange,
  onBulkMasteryChange,
  onNotesSave,
  onPriorityToggle,
  onTopicOpen,
  onEngagementUpdate,
  onAdvanceMilestone,
  advancingMilestone = false,
}) {
  const [notice, setNotice] = useState(null);
  const [focusedTopicId, setFocusedTopicId] = useState(null);
  const [roadmapView, setRoadmapView] = useState("roadmap");
  const [streakCelebration, setStreakCelebration] = useState(null);
  const [semesterModal, setSemesterModal] = useState(null);
  const [advanceConfirmOpen, setAdvanceConfirmOpen] = useState(false);
  const [advanceConfirmMessage, setAdvanceConfirmMessage] = useState("");
  const advanceAfterConfirmRef = useRef(null);
  const roadmapScrollRef = useRef(null);
  const savedScrollTop = useRef(0);

  const careerGoal = normalizeCareerGoal(profile?.careerGoal);

  const activeStudyPeriod =
    profile?.currentStudyPeriod || profile?.year;

  const profileForRoadmap = useMemo(
    () => ({ ...profile, year: activeStudyPeriod }),
    [profile, activeStudyPeriod]
  );

  const roadmap = useMemo(
    () =>
      enrichRoadmapWithCareerContext(
        getRoadmapForProfile(profileForRoadmap),
        profileForRoadmap
      ),
    [profileForRoadmap]
  );

  const topicsWithMastery = useMemo(() => {
    return roadmap.sections.map((section) => ({
      ...section,
      ...partitionTopics(section.topics, topicMastery),
    }));
  }, [roadmap, topicMastery]);

  const prerequisiteMap = useMemo(
    () =>
      buildPrerequisiteMap(
        roadmap.sections.map((s) => ({
          ...s,
          topics: enrichTopicsWithMastery(s.topics, topicMastery),
        }))
      ),
    [roadmap, topicMastery]
  );

  const topicById = useMemo(() => {
    const map = {};
    roadmap.sections.forEach((section) => {
      enrichTopicsWithMastery(section.topics, topicMastery).forEach((t) => {
        map[t.id] = t;
      });
    });
    return map;
  }, [roadmap, topicMastery]);

  const focusedTopic = focusedTopicId ? topicById[focusedTopicId] : null;

  const allTopics = useMemo(
    () => enrichTopicsWithMastery(roadmap.sections.flatMap((s) => s.topics), topicMastery),
    [roadmap, topicMastery]
  );

  const stats = useMemo(
    () => computeRoadmapStats(allTopics, topicMastery),
    [allTopics, topicMastery]
  );
  const priorityStats = useMemo(
    () => computePriorityStats(allTopics, priorityTopics, topicMastery),
    [allTopics, priorityTopics, topicMastery]
  );
  const goalProgress = useMemo(
    () => computeCareerGoalProgress(allTopics, careerGoal, topicMastery),
    [allTopics, careerGoal, topicMastery]
  );

  const recommendedNext = useMemo(
    () =>
      getRecommendedWithReasons(
        allTopics,
        careerGoal,
        priorityTopics,
        topicMastery,
        prerequisiteMap,
        3
      ),
    [allTopics, careerGoal, priorityTopics, topicMastery, prerequisiteMap]
  );

  const readiness = useMemo(
    () =>
      computeCareerReadiness(
        allTopics,
        topicMastery,
        priorityTopics,
        careerGoal,
        goalProgress.percent
      ),
    [allTopics, topicMastery, priorityTopics, careerGoal, goalProgress.percent]
  );

  const continueTopic = useMemo(
    () =>
      getContinueLearning(allTopics, topicMastery, engagement),
    [allTopics, topicMastery, engagement, prerequisiteMap]
  );

  const skillTree = useMemo(
    () => buildSkillTree(allTopics, topicMastery, prerequisiteMap),
    [allTopics, topicMastery, prerequisiteMap]
  );

  const semesterComplete = useMemo(
    () => isSemesterComplete(allTopics, topicMastery),
    [allTopics, topicMastery]
  );

  const achievementState = useMemo(
    () =>
      evaluateAchievements({
        allTopics,
        topicMastery,
        priorityTopics,
        engagement,
        readiness,
        semesterComplete,
      }),
    [allTopics, topicMastery, priorityTopics, engagement, readiness, semesterComplete]
  );

  const semesterKey = `${activeStudyPeriod}-${profile?.major}`;

  useEffect(() => {
    if (!achievementState.newly.length) return;
    onEngagementUpdate({
      unlockedAchievements: achievementState.unlocked,
    });
  }, [achievementState.unlocked, achievementState.newly.length, onEngagementUpdate]);

  useEffect(() => {
    const current = engagement?.currentStreak || 0;
    const celebrated = engagement?.celebratedStreakMilestones || [];
    const hit = STREAK_MILESTONES.find(
      (m) => current >= m && !celebrated.includes(m)
    );
    if (hit) {
      setStreakCelebration(hit);
      onEngagementUpdate({
        celebratedStreakMilestones: [...celebrated, hit],
      });
    }
  }, [engagement?.currentStreak]);

  const nextPeriodLabel = getNextStudyYearLabel(activeStudyPeriod);
  const semesterDismissed = (engagement?.dismissedSemesterKeys || []).includes(
    semesterKey
  );

  useEffect(() => {
    if (!semesterComplete) {
      setSemesterModal(null);
      return;
    }

    if (semesterDismissed) {
      setSemesterModal(null);
      return;
    }

    const priorityDone = allTopics.filter(
      (t) =>
        priorityTopics[t.id] &&
        isMastered(normalizeMastery(topicMastery[t.id]))
    ).length;

    setSemesterModal({
      mastered: stats.mastered,
      priorityCompleted: priorityDone,
      totalTopics: allTopics.length,
    });
  }, [
    semesterComplete,
    semesterDismissed,
    allTopics,
    priorityTopics,
    topicMastery,
    stats.mastered,
  ]);

  const showNextMilestoneCard =
    semesterComplete &&
    !semesterModal &&
    semesterDismissed &&
    Boolean(nextPeriodLabel);

  const unfinishedPriorities = useMemo(
    () => getUnfinishedPriorityTopics(allTopics, priorityTopics, topicMastery),
    [allTopics, priorityTopics, topicMastery]
  );

  const allTopicIds = useMemo(() => allTopics.map((t) => t.id), [allTopics]);

  const unmasteredTopicIds = useMemo(
    () =>
      allTopics
        .filter((t) => !isMastered(normalizeMastery(topicMastery[t.id])))
        .map((t) => t.id),
    [allTopics, topicMastery]
  );

  const allTopicsMastered =
    allTopicIds.length > 0 && unmasteredTopicIds.length === 0;

  const handleMarkAllToggle = () => {
    if (!allTopicIds.length) return;

    if (allTopicsMastered) {
      if (onBulkMasteryChange) {
        onBulkMasteryChange(allTopicIds, "not_started");
      } else {
        allTopicIds.forEach((id) => onMasteryChange(id, "not_started"));
      }
      setNotice({
        type: "success",
        message: `Reset ${allTopicIds.length} topic${
          allTopicIds.length === 1 ? "" : "s"
        } to not started.`,
      });
      return;
    }

    if (onBulkMasteryChange) {
      onBulkMasteryChange(unmasteredTopicIds, "mastered");
    } else {
      unmasteredTopicIds.forEach((id) => onMasteryChange(id, "mastered"));
    }

    setNotice({
      type: "success",
      message: `Marked ${unmasteredTopicIds.length} topic${
        unmasteredTopicIds.length === 1 ? "" : "s"
      } as mastered.`,
    });
  };

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(id);
  }, [notice]);

  const openTopicFocus = (topicId) => {
    onTopicOpen?.(topicId);
    if (roadmapScrollRef.current) {
      savedScrollTop.current = roadmapScrollRef.current.scrollTop;
    }
    setFocusedTopicId(topicId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeTopicFocus = () => {
    setFocusedTopicId(null);
    requestAnimationFrame(() => {
      if (roadmapScrollRef.current) {
        roadmapScrollRef.current.scrollTop = savedScrollTop.current;
      }
    });
  };

  const handleMasteryChange = (topicId, mastery) => {
    if (
      strictPriorityMode &&
      mastery === "mastered" &&
      unfinishedPriorities.length > 0 &&
      !priorityTopics[topicId]
    ) {
      setNotice({
        type: "error",
        message: "Master your priority topics before marking other courses complete.",
      });
      return;
    }
    onMasteryChange(topicId, mastery);
  };

  const dismissSemesterModal = useCallback(() => {
    onEngagementUpdate({
      dismissedSemesterKeys: [
        ...(engagement?.dismissedSemesterKeys || []),
        semesterKey,
      ],
    });
    setSemesterModal(null);
  }, [engagement?.dismissedSemesterKeys, onEngagementUpdate, semesterKey]);

  const requestMilestoneAdvance = useCallback(
    (afterAdvance) => {
      const evaluation = evaluateMilestoneAdvance({
        unfinishedPriorityTopics: unfinishedPriorities,
        strictPriorityMode,
      });

      if (evaluation.blocked) {
        setNotice({ type: "error", message: evaluation.warning });
        return;
      }

      if (evaluation.warning) {
        setAdvanceConfirmMessage(evaluation.warning);
        advanceAfterConfirmRef.current = afterAdvance ?? null;
        setAdvanceConfirmOpen(true);
        return;
      }

      Promise.resolve(onAdvanceMilestone?.()).then(() => {
        afterAdvance?.();
      });
    },
    [unfinishedPriorities, strictPriorityMode, onAdvanceMilestone]
  );

  const handleSemesterContinue = () => {
    if (!nextPeriodLabel) {
      dismissSemesterModal();
      return;
    }
    requestMilestoneAdvance(dismissSemesterModal);
  };

  const handleNextMilestoneAdvance = () => {
    requestMilestoneAdvance();
  };

  const displayName = profile?.name || "there";
  const uniLabel =
    formatUniversityShort(profile?.university) || profile?.university || "your university";

  if (focusedTopic) {
    const incompleteIds = getIncompletePrerequisites(
      focusedTopic.id,
      prerequisiteMap,
      topicMastery
    );
    const prerequisiteTitles = incompleteIds
      .map((id) => topicById[id]?.title)
      .filter(Boolean);
    const prerequisiteTopics = incompleteIds
      .map((id) => topicById[id])
      .filter(Boolean);
    const unlockTopics = getTopicUnlocks(
      focusedTopic.id,
      allTopics,
      prerequisiteMap
    );

    return (
      <div className="dash-explore dash-explore-focused">
        {notice && (
          <div className={clsx("dash-notice", "dash-notice-error")} role="alert">
            {notice.message}
          </div>
        )}
        <TopicFocusView
          topic={focusedTopic}
          careerGoal={careerGoal}
          isPriority={Boolean(priorityTopics[focusedTopic.id])}
          isGoalRecommended={isGoalRecommendedTopic(focusedTopic, careerGoal)}
          topicNotes={topicNotes[focusedTopic.id] || []}
          prerequisiteTitles={prerequisiteTitles}
          prerequisiteTopics={prerequisiteTopics}
          unlockTopics={unlockTopics}
          topicMastery={topicMastery}
          onBack={closeTopicFocus}
          onMasteryChange={handleMasteryChange}
          onPriorityToggle={onPriorityToggle}
          onNotesSave={onNotesSave}
        />
      </div>
    );
  }

  return (
    <div className="dash-explore">
      <header className="dash-explore-header dash-fade-up">
        <h1 className="dash-page-title">Welcome back, {displayName}</h1>
        <p className="dash-page-subtitle">
          Here&apos;s what you should focus on{" "}
          {formatStudyYear(activeStudyPeriod) || "this year"} at {uniLabel}
        </p>
        <div className="dash-badge-row">
          {profile?.major && <span className="dash-badge">{profile.major}</span>}
          {activeStudyPeriod && (
            <span className="dash-badge">{formatStudyYear(activeStudyPeriod)}</span>
          )}
          {profile?.university && (
            <span className="dash-badge">{uniLabel}</span>
          )}
        </div>
        <div className="dash-career-goal-banner">
          <Target size={18} className="dash-icon-goal" aria-hidden="true" />
          <span className="dash-career-goal-label">Goal:</span>
          <strong className="dash-career-goal-value">{getGoalLabel(careerGoal)}</strong>
        </div>
      </header>

      {notice && (
        <div
          className={clsx(
            "dash-notice",
            notice.type === "error" && "dash-notice-error",
            notice.type === "success" && "dash-notice-success"
          )}
          role="alert"
        >
          {notice.message}
        </div>
      )}

      <ContinueLearningCard topic={continueTopic} onResume={openTopicFocus} />

      {showNextMilestoneCard && (
        <NextMilestoneCard
          currentPeriod={activeStudyPeriod}
          nextPeriodLabel={nextPeriodLabel}
          onAdvance={handleNextMilestoneAdvance}
          advancing={advancingMilestone}
        />
      )}

      {unfinishedPriorities.length > 0 && !notice && (
        <div className="dash-notice dash-notice-warning" role="status">
          {unfinishedPriorities.length} priority topic
          {unfinishedPriorities.length === 1 ? "" : "s"} not yet mastered
          {strictPriorityMode
            ? " — master them before marking other courses complete."
            : " — finish them when you can."}
        </div>
      )}

      <div className="dash-explore-grid">
        <div className="dash-explore-main" ref={roadmapScrollRef}>
          <section className="dash-card dash-fade-up" style={{ animationDelay: "0.06s" }}>
            <div className="dash-roadmap-head">
              <div>
                <h2 className="dash-section-title dash-section-title-roadmap">
                  Your learning <AccentUnderline>roadmap</AccentUnderline>
                </h2>
                <p className="dash-section-desc">
                  {roadmap.meta.programName
                    ? `${roadmap.meta.programName} · Academic Catalogue ${roadmap.meta.catalogue || "2025–2026"} (bachelor programmes only)`
                    : `Topics tailored for ${profile?.major || "your major"} — Year ${roadmap.meta.year} at ${uniLabel}.`}
                </p>
                {roadmap.meta.catalogueNote && (
                  <p className="dash-catalogue-note">{roadmap.meta.catalogueNote}</p>
                )}
              </div>
              <div className="dash-roadmap-toolbar">
                <div className="dash-view-toggle" role="tablist" aria-label="Roadmap view">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={roadmapView === "roadmap"}
                    className={clsx(
                      "dash-view-toggle-btn",
                      roadmapView === "roadmap" && "dash-view-toggle-btn-active"
                    )}
                    onClick={() => setRoadmapView("roadmap")}
                  >
                    Roadmap
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={roadmapView === "skill-tree"}
                    className={clsx(
                      "dash-view-toggle-btn",
                      roadmapView === "skill-tree" && "dash-view-toggle-btn-active"
                    )}
                    onClick={() => setRoadmapView("skill-tree")}
                  >
                    Skill Tree
                  </button>
                </div>

                {allTopicIds.length > 0 && (
                  <button
                    type="button"
                    className={clsx(
                      "dash-mark-all-toggle",
                      allTopicsMastered && "dash-mark-all-toggle-reset"
                    )}
                    onClick={handleMarkAllToggle}
                    aria-pressed={allTopicsMastered}
                  >
                    {allTopicsMastered ? (
                      <RotateCcw size={16} aria-hidden="true" />
                    ) : (
                      <CheckCheck size={16} aria-hidden="true" />
                    )}
                    <span>
                      {allTopicsMastered
                        ? "Mark all as unmastered"
                        : "Mark all as mastered"}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {roadmapView === "skill-tree" ? (
              <SkillTreeView tree={skillTree} onOpenTopic={openTopicFocus} />
            ) : (
              <>
            <p className="dash-section-desc dash-roadmap-hint">
              Tap a topic to open your focused learning workspace.
            </p>

            <div className="dash-topic-sections">
              {topicsWithMastery.map((section) => (
                <div key={section.id} className="dash-topic-section">
                  <div className="dash-topic-section-head">
                    <h3 className="dash-topic-section-title">{section.title}</h3>
                    {section.description && (
                      <p className="dash-topic-section-desc">{section.description}</p>
                    )}
                  </div>

                  {section.active.length > 0 && (
                    <div className="dash-topic-list">
                      {sortTopicsForRoadmap(
                        section.active,
                        priorityTopics,
                        careerGoal
                      ).map((topic) => (
                        <TopicCard
                          key={topic.id}
                          topic={topic}
                          isPriority={Boolean(priorityTopics[topic.id])}
                          isGoalRecommended={isGoalRecommendedTopic(topic, careerGoal)}
                          onOpen={openTopicFocus}
                        />
                      ))}
                    </div>
                  )}

                  <MasteredTopicsSection
                    topics={section.mastered}
                    onOpenTopic={openTopicFocus}
                  />
                </div>
              ))}
            </div>
              </>
            )}
          </section>
        </div>

        <aside className="dash-explore-panel dash-fade-up" style={{ animationDelay: "0.12s" }}>
          <CareerGoalProgressPanel stats={goalProgress} careerGoal={careerGoal} />
          <PriorityTopicsPanel stats={priorityStats} />
          <RecommendedNextPanel
            recommendations={recommendedNext}
            onOpenTopic={openTopicFocus}
          />
          <CareerReadinessPanel readiness={readiness} />
          <QuickStatsPanel stats={stats} />
        </aside>
      </div>

      {streakCelebration && (
        <StreakCelebration
          milestone={streakCelebration}
          onDone={() => setStreakCelebration(null)}
        />
      )}

      {semesterModal && (
        <SemesterCompletionModal
          stats={semesterModal}
          nextPeriodLabel={nextPeriodLabel}
          advancing={advancingMilestone}
          onContinue={handleSemesterContinue}
          onDismiss={dismissSemesterModal}
        />
      )}

      <ConfirmDialog
        open={advanceConfirmOpen}
        title="Unfinished priority topics"
        message={advanceConfirmMessage}
        confirmLabel="Continue anyway"
        cancelLabel="Stay on this semester"
        loading={advancingMilestone}
        onConfirm={() => {
          const after = advanceAfterConfirmRef.current;
          advanceAfterConfirmRef.current = null;
          setAdvanceConfirmOpen(false);
          Promise.resolve(onAdvanceMilestone?.()).then(() => {
            after?.();
          });
        }}
        onCancel={() => {
          if (advancingMilestone) return;
          advanceAfterConfirmRef.current = null;
          setAdvanceConfirmOpen(false);
        }}
      />
    </div>
  );
}
