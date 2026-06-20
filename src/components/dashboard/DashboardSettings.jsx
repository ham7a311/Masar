import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { LogOut, User } from "lucide-react";
import ProfileAccordionSection from "./ProfileAccordionSection";
import ProfileAchievements from "./ProfileAchievements";
import ProfileLearningStats from "./ProfileLearningStats";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import SearchSelect from "../onboarding/SearchSelect";
import {
  UNIVERSITIES,
  LOCKED_UNIVERSITIES,
  getMajorsForUniversity,
  getUniversitySelectionError,
  isValidMajor,
} from "../../data/onboardingOptions";
import StudyPeriodPicker from "../StudyPeriodPicker";
import CompletedPeriodReview from "./CompletedPeriodReview";
import ConfirmDialog from "./ConfirmDialog";
import { logout } from "../../services/auth";
import { getRoadmapForProfile, getAllTopics, computeRoadmapStats } from "../../data/roadmapTopics";
import { saveUserProfile } from "../../services/userProfile";
import {
  computeCareerReadiness,
  computeLearningStats,
  evaluateAchievements,
  isSemesterComplete,
} from "../../utils/dashboardAnalytics";
import {
  computeCareerGoalProgress,
  enrichRoadmapWithCareerContext,
  normalizeCareerGoal,
} from "../../utils/careerGoal";
import { normalizeMastery } from "../../utils/mastery";
import {
  evaluateMilestoneAdvance,
  getUnfinishedPriorityTopics,
  isAdvancingStudyPeriod,
} from "../../utils/topicProgress";
import { CAREER_GOALS, DEFAULT_CAREER_GOAL } from "../../data/careerGoals";
import {
  buildStudyPeriodValue,
  getStudyPeriodFormFields,
  isStudyPeriodCompleted,
  normalizeYearValue,
} from "../../utils/studyPeriod";
import { computeCompletedStudyPeriods } from "../../utils/studyPeriodCompletion";
import { formatStudyYear } from "../../utils/profileFormat";
import "../../pages/onboarding-page.css";

export default function DashboardSettings({
  profile,
  uid,
  engagement,
  onProfileUpdate,
  onSaved,
  topicMastery = {},
  priorityTopics = {},
}) {
  const navigate = useNavigate();
  const { isDark, setTheme } = useTheme();
  const [form, setForm] = useState({
    name: "",
    university: "",
    major: "",
    yearLevel: null,
    semester: null,
  });
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [yearAdvanceConfirmOpen, setYearAdvanceConfirmOpen] = useState(false);
  const [yearAdvanceMessage, setYearAdvanceMessage] = useState("");
  const [pendingYear, setPendingYear] = useState(null);
  const [strictPriorityMode, setStrictPriorityMode] = useState(false);
  const [careerGoal, setCareerGoal] = useState(DEFAULT_CAREER_GOAL);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState(() => new Set(["account"]));
  const [reviewingPeriod, setReviewingPeriod] = useState(null);
  const [returnToCompletedOpen, setReturnToCompletedOpen] = useState(false);
  const [pendingReturnPeriod, setPendingReturnPeriod] = useState(null);

  const activeStudyPeriod = normalizeYearValue(
    profile?.currentStudyPeriod || profile?.year
  );

  const completedStudyPeriods = useMemo(
    () => computeCompletedStudyPeriods(profile, topicMastery),
    [profile, topicMastery]
  );

  const savedCareerGoal = normalizeCareerGoal(profile?.careerGoal);
  const careerGoalDirty = careerGoal !== savedCareerGoal;

  const toggleSection = (id) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isOpen = (id) => openSections.has(id);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    setError(null);
    try {
      await logout();
      navigate("/", { replace: true });
    } catch {
      setError("Could not sign out. Please try again.");
      setLoggingOut(false);
      setLogoutConfirmOpen(false);
    }
  };

  useEffect(() => {
    if (!profile) return;
    const periodForForm =
      reviewingPeriod || profile.currentStudyPeriod || profile.year;
    const { yearLevel, semester } = getStudyPeriodFormFields(periodForForm);
    setForm({
      name: profile.name || "",
      university: profile.university || "",
      major: isValidMajor(profile.major) ? profile.major : "",
      yearLevel,
      semester,
    });
    setStrictPriorityMode(Boolean(profile.strictPriorityMode));
    setCareerGoal(normalizeCareerGoal(profile.careerGoal));
  }, [profile, reviewingPeriod]);

  const careerGoalId = normalizeCareerGoal(careerGoal);

  const profileAnalytics = useMemo(() => {
    if (!profile) return null;
    const roadmap = enrichRoadmapWithCareerContext(
      getRoadmapForProfile(profile),
      profile
    );
    const rawTopics = getAllTopics(roadmap);
    const allTopics = rawTopics.map((t) => ({
      ...t,
      mastery: normalizeMastery(topicMastery[t.id] ?? t.mastery ?? t.status),
    }));
    const roadmapStats = computeRoadmapStats(allTopics, topicMastery);
    const goalProgress = computeCareerGoalProgress(
      allTopics,
      careerGoalId,
      topicMastery
    );
    const readiness = computeCareerReadiness(
      allTopics,
      topicMastery,
      priorityTopics,
      careerGoalId,
      goalProgress.percent
    );
    const semesterComplete = isSemesterComplete(allTopics, topicMastery);
    const achievementState = evaluateAchievements({
      allTopics,
      topicMastery,
      priorityTopics,
      engagement,
      readiness,
      semesterComplete,
    });
    const learningStats = computeLearningStats(
      allTopics,
      topicMastery,
      priorityTopics,
      roadmapStats,
      goalProgress
    );

    return {
      learningStats,
      achievements: achievementState.list,
      analyticsCtx: {
        allTopics,
        topicMastery,
        priorityTopics,
        engagement,
        readiness,
        semesterComplete,
      },
    };
  }, [profile, topicMastery, priorityTopics, engagement, careerGoalId]);

  const getUnfinishedPrioritiesForProfile = (profileSnapshot) => {
    const roadmap = getRoadmapForProfile(profileSnapshot);
    const topics = getAllTopics(roadmap);
    return getUnfinishedPriorityTopics(topics, priorityTopics, topicMastery);
  };

  const submitProfile = async (payload) => {
    await saveUserProfile(uid, payload);
    onSaved({ ...profile, ...payload });
    setMessage("Profile updated successfully.");
  };

  const handleDarkModeChange = async (enabled) => {
    if (!uid) return;
    const previous = isDark ? "dark" : "light";
    const next = enabled ? "dark" : "light";
    setTheme(next);
    setError(null);

    try {
      await saveUserProfile(uid, { darkMode: enabled });
      onProfileUpdate?.({ ...profile, darkMode: enabled });
    } catch {
      setTheme(previous);
      setError("Could not save appearance preference.");
    }
  };

  const handleSaveCareerGoal = async () => {
    if (!uid || !careerGoalDirty) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await saveUserProfile(uid, { careerGoal });
      onProfileUpdate?.({ ...profile, careerGoal });
      setMessage("Career goal updated.");
    } catch {
      setError("Could not save career goal. Please try again.");
      setCareerGoal(savedCareerGoal);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!uid) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (!form.name.trim()) {
        setError("Please enter your name.");
        setSaving(false);
        return;
      }
      const universityError = getUniversitySelectionError(form.university, {
        existingUniversity: profile?.university,
      });
      if (universityError) {
        setError(universityError);
        setSaving(false);
        return;
      }
      if (!isValidMajor(form.major)) {
        setError("Please select your major.");
        setSaving(false);
        return;
      }

      const year =
        reviewingPeriod ||
        buildStudyPeriodValue(form.yearLevel, form.semester);
      if (!year) {
        setError("Please select your year of study and semester.");
        setSaving(false);
        return;
      }

      const returningToCompleted =
        year !== activeStudyPeriod &&
        isStudyPeriodCompleted(year, activeStudyPeriod, completedStudyPeriods);

      if (returningToCompleted) {
        setPendingReturnPeriod(year);
        setReturnToCompletedOpen(true);
        setSaving(false);
        return;
      }

      const profileDraft = {
        ...profile,
        name: form.name.trim(),
        university: form.university.trim(),
        major: form.major.trim(),
        year,
        currentStudyPeriod: year,
        strictPriorityMode,
        careerGoal,
      };
      const syncedCompleted = computeCompletedStudyPeriods(
        profileDraft,
        topicMastery
      );

      const payload = {
        name: profileDraft.name,
        university: profileDraft.university,
        major: profileDraft.major,
        year,
        currentStudyPeriod: year,
        strictPriorityMode,
        careerGoal,
        completedStudyPeriods: syncedCompleted,
      };

      const advancing = isAdvancingStudyPeriod(activeStudyPeriod, year);

      if (advancing) {
        const unfinished = getUnfinishedPrioritiesForProfile(profile);
        const evaluation = evaluateMilestoneAdvance({
          unfinishedPriorityTopics: unfinished,
          strictPriorityMode,
        });

        if (evaluation.blocked) {
          setError(evaluation.warning);
          setSaving(false);
          return;
        }

        if (evaluation.warning) {
          setPendingYear(year);
          setYearAdvanceMessage(evaluation.warning);
          setYearAdvanceConfirmOpen(true);
          setSaving(false);
          return;
        }
      }

      await submitProfile(payload);
      setReviewingPeriod(null);
      setOpenSections((prev) => {
        const next = new Set(prev);
        next.delete("personal");
        return next;
      });
    } catch {
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-profile dash-settings dash-fade-up">
      <header className="dash-explore-header">
        <h1 className="dash-page-title">
          <User size={28} className="dash-icon-goal" aria-hidden="true" />
          Profile
        </h1>
        <p className="dash-page-subtitle">
          Your academic details, career goal, learning statistics, and preferences.
        </p>
      </header>

      {error && (
        <p className="dash-settings-error dash-profile-status" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="dash-settings-success dash-profile-status" role="status">
          {message}
        </p>
      )}

      <div className="dash-profile-accordion-list">
        <ProfileAccordionSection
          id="personal"
          title="Personal & academic information"
          open={isOpen("personal")}
          onToggle={toggleSection}
        >
          <form className="dash-card dash-settings-form" onSubmit={handleSave}>
            <p className="dash-settings-warning">
              Changes will update your roadmap recommendations.
            </p>

            <div className="dash-settings-field">
              <label className="dash-settings-label" htmlFor="profile-name">
                Name <span className="dash-required">*</span>
              </label>
              <input
                id="profile-name"
                type="text"
                className="dash-input"
                placeholder="What should we call you?"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="dash-settings-field">
              <label className="dash-settings-label" htmlFor="profile-university">
                University <span className="dash-required">*</span>
              </label>
              <SearchSelect
                id="profile-university"
                options={UNIVERSITIES}
                lockedOptions={LOCKED_UNIVERSITIES}
                value={form.university}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    university: value,
                    major: isValidMajor(prev.major) ? prev.major : "",
                  }))
                }
                placeholder="Select or type your university..."
                allowCustom
              />
            </div>

            <div className="dash-settings-field">
              <label className="dash-settings-label" htmlFor="profile-major">
                Major <span className="dash-required">*</span>
              </label>
              <SearchSelect
                id="profile-major"
                options={getMajorsForUniversity(form.university)}
                value={form.major}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, major: value }))
                }
                placeholder="Search majors..."
              />
            </div>

            <StudyPeriodPicker
              variant="dashboard"
              yearLevel={form.yearLevel}
              semester={form.semester}
              activeStudyPeriod={activeStudyPeriod}
              completedStudyPeriods={completedStudyPeriods}
              reviewingPeriod={reviewingPeriod}
              onSelectPeriod={(period, yearLevel, semester) => {
                setReviewingPeriod(period ?? null);
                if (yearLevel != null) {
                  setForm((prev) => ({
                    ...prev,
                    yearLevel,
                    ...(semester != null ? { semester } : {}),
                  }));
                }
              }}
              onYearLevelChange={(value) =>
                setForm((prev) => ({ ...prev, yearLevel: value }))
              }
              onSemesterChange={(value) =>
                setForm((prev) => ({ ...prev, semester: value }))
              }
            />

            {reviewingPeriod && (
              <CompletedPeriodReview
                profile={profile}
                periodValue={reviewingPeriod}
                activePeriodValue={activeStudyPeriod}
                topicMastery={topicMastery}
              />
            )}

            <button
              type="submit"
              className="dash-btn dash-btn-primary"
              disabled={saving || loggingOut}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </ProfileAccordionSection>

        <ProfileAccordionSection
          id="career-goal"
          title="Career goal"
          open={isOpen("career-goal")}
          onToggle={toggleSection}
        >
          <section className="dash-card dash-settings-career-goal">
            <p className="dash-settings-logout-desc">
              Choose your primary career objective. Your roadmap will highlight
              relevant topics and tailor recommendations.
            </p>
            <div
              className="dash-career-goal-options"
              role="radiogroup"
              aria-label="Career goal"
            >
              {CAREER_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  role="radio"
                  aria-checked={careerGoal === goal.id}
                  className={clsx(
                    "dash-career-goal-option",
                    careerGoal === goal.id && "dash-career-goal-option-active"
                  )}
                  onClick={() => setCareerGoal(goal.id)}
                  disabled={saving || loggingOut}
                >
                  <span className="dash-career-goal-option-label">{goal.label}</span>
                  <span className="dash-career-goal-option-desc">{goal.description}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="dash-btn dash-btn-primary dash-profile-career-save"
              onClick={handleSaveCareerGoal}
              disabled={saving || loggingOut || !careerGoalDirty}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </section>
        </ProfileAccordionSection>

        {profileAnalytics && (
          <>
            <ProfileAccordionSection
              id="achievements"
              title="Achievements"
              open={isOpen("achievements")}
              onToggle={toggleSection}
            >
              <ProfileAchievements
                achievements={profileAnalytics.achievements}
                analyticsCtx={profileAnalytics.analyticsCtx}
              />
            </ProfileAccordionSection>

            <ProfileAccordionSection
              id="learning-stats"
              title="Learning statistics"
              open={isOpen("learning-stats")}
              onToggle={toggleSection}
            >
              <ProfileLearningStats stats={profileAnalytics.learningStats} />
            </ProfileAccordionSection>
          </>
        )}

        <ProfileAccordionSection
          id="preferences"
          title="Preferences"
          open={isOpen("preferences")}
          onToggle={toggleSection}
        >
          <section className="dash-card dash-settings-priority dash-profile-preferences">
            <ThemeToggle
              isDark={isDark}
              onChange={handleDarkModeChange}
              disabled={saving || loggingOut}
            />

            <div className="dash-preference-divider" />

            <p className="dash-settings-logout-desc">
              When strict mode is on, you must master all priority topics before
              marking other courses complete. Changing to a future semester in
              Profile still checks priority topics first.
            </p>
            <label className="dash-settings-toggle">
              <input
                type="checkbox"
                checked={strictPriorityMode}
                onChange={(e) => setStrictPriorityMode(e.target.checked)}
                disabled={saving || loggingOut}
              />
              <span className="dash-settings-toggle-track" aria-hidden="true" />
              <span className="dash-settings-toggle-label">Strict Priority Mode</span>
            </label>
          </section>
        </ProfileAccordionSection>

        <ProfileAccordionSection
          id="account"
          title="Account"
          open={isOpen("account")}
          onToggle={toggleSection}
        >
          <section className="dash-card dash-settings-logout">
            <p className="dash-settings-logout-desc">
              Sign out of Masar on this device.
            </p>
            <button
              type="button"
              className="dash-btn dash-btn-logout"
              onClick={() => setLogoutConfirmOpen(true)}
              disabled={loggingOut || saving}
            >
              <LogOut size={18} aria-hidden="true" />
              Log out
            </button>
          </section>
        </ProfileAccordionSection>
      </div>

      <ConfirmDialog
        open={returnToCompletedOpen}
        title="Return to a completed semester?"
        message={
          pendingReturnPeriod
            ? `Are you sure you want to return to ${formatStudyYear(pendingReturnPeriod)}? This will replace your current semester (${formatStudyYear(activeStudyPeriod)}).`
            : ""
        }
        confirmLabel="Yes, switch semester"
        cancelLabel="Cancel"
        loading={saving}
        onConfirm={async () => {
          if (!pendingReturnPeriod) return;
          setSaving(true);
          setError(null);
          try {
            const returnDraft = {
              ...profile,
              name: form.name.trim(),
              university: form.university.trim(),
              major: form.major.trim(),
              year: pendingReturnPeriod,
              currentStudyPeriod: pendingReturnPeriod,
              strictPriorityMode,
              careerGoal,
            };
            await submitProfile({
              name: returnDraft.name,
              university: returnDraft.university,
              major: returnDraft.major,
              year: pendingReturnPeriod,
              currentStudyPeriod: pendingReturnPeriod,
              strictPriorityMode,
              careerGoal,
              completedStudyPeriods: computeCompletedStudyPeriods(
                returnDraft,
                topicMastery
              ),
            });
            setReviewingPeriod(null);
            setMessage(
              `Your active semester is now ${formatStudyYear(pendingReturnPeriod)}.`
            );
            setReturnToCompletedOpen(false);
            setPendingReturnPeriod(null);
            setOpenSections((prev) => {
              const next = new Set(prev);
              next.delete("personal");
              return next;
            });
          } catch {
            setError("Could not save changes. Please try again.");
          } finally {
            setSaving(false);
          }
        }}
        onCancel={() => {
          if (saving) return;
          setReturnToCompletedOpen(false);
          setPendingReturnPeriod(null);
        }}
      />

      <ConfirmDialog
        open={yearAdvanceConfirmOpen}
        title="Unfinished priority topics"
        message={yearAdvanceMessage}
        confirmLabel="Save and advance"
        cancelLabel="Cancel"
        loading={saving}
        onConfirm={async () => {
          if (!pendingYear) return;
          setSaving(true);
          setError(null);
          try {
            const advanceDraft = {
              ...profile,
              name: form.name.trim(),
              university: form.university.trim(),
              major: form.major.trim(),
              year: pendingYear,
              currentStudyPeriod: pendingYear,
              strictPriorityMode,
              careerGoal,
            };
            await submitProfile({
              name: advanceDraft.name,
              university: advanceDraft.university,
              major: advanceDraft.major,
              year: pendingYear,
              currentStudyPeriod: pendingYear,
              strictPriorityMode,
              careerGoal,
              completedStudyPeriods: computeCompletedStudyPeriods(
                advanceDraft,
                topicMastery
              ),
            });
            setReviewingPeriod(null);
            setYearAdvanceConfirmOpen(false);
            setPendingYear(null);
            setOpenSections((prev) => {
              const next = new Set(prev);
              next.delete("personal");
              return next;
            });
          } catch {
            setError("Could not save changes. Please try again.");
          } finally {
            setSaving(false);
          }
        }}
        onCancel={() => !saving && setYearAdvanceConfirmOpen(false)}
      />

      <ConfirmDialog
        open={logoutConfirmOpen}
        title="Log out?"
        message="Are you sure you want to log out? You will need to sign in again to access your dashboard."
        confirmLabel="Log out"
        cancelLabel="Cancel"
        loading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={() => !loggingOut && setLogoutConfirmOpen(false)}
      />
    </div>
  );
}
