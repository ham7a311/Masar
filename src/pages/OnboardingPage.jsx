import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import clsx from "clsx";
import SearchSelect from "../components/onboarding/SearchSelect";
import { AccentUnderline } from "../components/SectionAccent";
import {
  UNIVERSITIES,
  LOCKED_UNIVERSITIES,
  getMajorsForUniversity,
  getUniversitySelectionError,
  isValidMajor,
} from "../data/onboardingOptions";
import { hasRequiredProfileFields } from "../utils/profileFormat";
import StudyPeriodPicker from "../components/StudyPeriodPicker";
import { buildStudyPeriodValue, getStudyPeriodFormFields } from "../utils/studyPeriod";
import { buildOnboardingStudyProgress } from "../utils/studyPeriodCompletion";
import { loadTopicLearning, saveTopicMastery } from "../services/topicLearning";
import {
  completeOnboarding,
  getUserProfile,
  isOnboardingComplete,
  saveUserProfile,
} from "../services/userProfile";
import { auth } from "../firebase";
import "./onboarding-page.css";

const STEPS = ["welcome", "university", "major", "year", "name", "finish"];
const DATA_STEPS = ["university", "major", "year", "name"];

const EMPTY_FORM = {
  university: "",
  major: "",
  yearLevel: null,
  semester: null,
  name: "",
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";
  const editStep = searchParams.get("step");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [uid, setUid] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const step = STEPS[stepIndex];
  const dataStepIndex = DATA_STEPS.indexOf(step);
  const progress =
    dataStepIndex >= 0 ? ((dataStepIndex + 1) / DATA_STEPS.length) * 100 : 0;
  const majorOptions = getMajorsForUniversity(form.university);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);

        if (isOnboardingComplete(profile) && !isEditMode) {
          navigate("/dashboard", { replace: true });
          return;
        }

        if (profile) {
          const { yearLevel, semester } = getStudyPeriodFormFields(profile.year);
          setForm({
            university: profile.university || "",
            major: isValidMajor(profile.major) ? profile.major : "",
            yearLevel,
            semester,
            name: profile.name || "",
          });

          if (isEditMode && editStep) {
            const stepIdx = DATA_STEPS.indexOf(editStep);
            if (stepIdx >= 0) setStepIndex(stepIdx + 1);
          }
        }

        setUid(user.uid);
      } catch {
        setUid(user.uid);
      } finally {
        setCheckingAuth(false);
      }
    });

    return unsubscribe;
  }, [navigate, isEditMode, editStep]);

  const persist = useCallback(
    async (partial) => {
      if (!uid) return;
      await saveUserProfile(uid, partial);
    },
    [uid]
  );

  const validateStep = () => {
    const nextErrors = {};

    if (step === "university") {
      const universityError = getUniversitySelectionError(form.university);
      if (universityError) nextErrors.university = universityError;
    }

    if (step === "major" && !isValidMajor(form.major)) {
      nextErrors.major = "Please select your major.";
    }

    if (step === "year") {
      if (!form.yearLevel) {
        nextErrors.year = "Please select your year of study.";
      } else if (!form.semester) {
        nextErrors.year = "Please select your semester.";
      }
    }

    if (step === "name" && !form.name.trim()) {
      nextErrors.name = "Please enter your first name.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = async () => {
    if (step === "welcome") {
      setStepIndex(1);
      return;
    }

    if (!validateStep()) return;

    setSaving(true);
    try {
      if (step === "university") {
        await persist({
          university: form.university.trim(),
          onBoardingStep: "university",
        });
        setStepIndex(2);
      } else if (step === "major") {
        await persist({ major: form.major.trim(), onBoardingStep: "major" });
        setStepIndex(3);
      } else if (step === "year") {
        await persist({
          year: buildStudyPeriodValue(form.yearLevel, form.semester),
          onBoardingStep: "year",
        });
        setStepIndex(4);
      } else if (step === "name") {
        await persist({
          name: form.name.trim(),
          onBoardingStep: "name",
        });
        setStepIndex(5);
        await runFinish();
      }
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    if (stepIndex > 0 && step !== "finish") {
      setErrors({});
      setStepIndex((i) => i - 1);
    }
  };

  const runFinish = async () => {
    if (finishing || !uid) return;
    setFinishing(true);

    try {
      const year = buildStudyPeriodValue(form.yearLevel, form.semester);
      const profileStub = {
        university: form.university.trim(),
        major: form.major.trim(),
        year,
        currentStudyPeriod: year,
        name: form.name.trim(),
      };

      if (!hasRequiredProfileFields(profileStub)) {
        setErrors({
          finish: "Please complete university, major, year, semester, and name.",
        });
        setFinishing(false);
        return;
      }

      const universityError = getUniversitySelectionError(profileStub.university);
      if (universityError) {
        setErrors({ finish: universityError });
        setFinishing(false);
        return;
      }

      const { completedStudyPeriods, topicMastery: backfillMastery } =
        buildOnboardingStudyProgress(profileStub, year);

      const profile = await completeOnboarding(uid, {
        ...profileStub,
        completedStudyPeriods,
      });

      if (Object.keys(backfillMastery).length > 0) {
        const learning = await loadTopicLearning(uid);
        await saveTopicMastery(uid, {
          ...learning.topicMastery,
          ...backfillMastery,
        });
      }

      if (!isOnboardingComplete(profile)) {
        setErrors({
          finish: "Your profile saved but is still syncing. Please try again.",
        });
        setFinishing(false);
        return;
      }

      navigate("/dashboard", {
        replace: true,
        state: { initialProfile: profile },
      });
    } catch {
      setFinishing(false);
      setErrors({ finish: "Something went wrong. Please try again." });
    }
  };

  if (checkingAuth) {
    return <div className="onboarding-loading-screen">Loading...</div>;
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-grid" aria-hidden="true" />
      <div className="onboarding-glow" aria-hidden="true" />

      <div className="onboarding-shell">
        {step !== "welcome" && step !== "finish" && (
          <div className="onboarding-progress" aria-hidden="true">
            <div className="onboarding-progress-track">
              <div
                className="onboarding-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="onboarding-progress-label">
              {dataStepIndex + 1} / {DATA_STEPS.length}
            </span>
          </div>
        )}

        <div className="onboarding-card">
          <div key={step} className="onboarding-step">
            {step === "welcome" && (
              <>
                <span className="onboarding-eyebrow">Welcome to Masar</span>
                <h1 className="onboarding-title">
                  Let&apos;s build your personalized career{" "}
                  <AccentUnderline>path</AccentUnderline>
                </h1>
                <p className="onboarding-subtitle">
                  A few quick questions so we can tailor roadmaps to your
                  university, major, and year.
                </p>
                <div className="onboarding-actions">
                  <span />
                  <button
                    type="button"
                    className="onboarding-btn onboarding-btn-primary"
                    onClick={goNext}
                  >
                    Start
                  </button>
                </div>
              </>
            )}

            {step === "university" && (
              <>
                <h1 className="onboarding-title">Which university are you in?</h1>
                <p className="onboarding-subtitle">
                  Choose from the list, or type your university if it&apos;s in
                  Oman and not listed.
                </p>
                <div className="onboarding-field">
                  <label className="onboarding-label" htmlFor="university">
                    University in Oman
                  </label>
                  <SearchSelect
                    id="university"
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
                    error={errors.university}
                  />
                  <p className="onboarding-optional">
                    Custom entries must be a university located in Oman.
                  </p>
                </div>
                <StepActions
                  onBack={goBack}
                  onNext={goNext}
                  saving={saving}
                  nextLabel="Continue"
                />
              </>
            )}

            {step === "major" && (
              <>
                <h1 className="onboarding-title">What are you studying?</h1>
                <p className="onboarding-subtitle">
                  Pick your major so we can tailor your roadmap and recommendations.
                </p>
                <div className="onboarding-field">
                  <label className="onboarding-label" htmlFor="major">
                    Major
                  </label>
                  <SearchSelect
                    id="major"
                    options={majorOptions}
                    value={form.major}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, major: value }))
                    }
                    placeholder="Search majors..."
                    error={errors.major}
                  />
                </div>
                <StepActions
                  onBack={goBack}
                  onNext={goNext}
                  saving={saving}
                  nextLabel="Continue"
                />
              </>
            )}

            {step === "year" && (
              <>
                <h1 className="onboarding-title">What year and semester are you in?</h1>
                <p className="onboarding-subtitle">
                  This helps us suggest the right milestones for your stage.
                </p>
                <StudyPeriodPicker
                  variant="onboarding"
                  yearLevel={form.yearLevel}
                  semester={form.semester}
                  onYearLevelChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      yearLevel: value,
                    }))
                  }
                  onSemesterChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      semester: value,
                    }))
                  }
                  yearError={errors.year}
                  semesterError={errors.year}
                />
                <StepActions
                  onBack={goBack}
                  onNext={goNext}
                  saving={saving}
                  nextLabel="Continue"
                />
              </>
            )}

            {step === "name" && (
              <>
                <h1 className="onboarding-title">What should we call you?</h1>
                <p className="onboarding-subtitle">
                  We&apos;ll use your first name to personalize your dashboard.
                </p>
                <div className="onboarding-field">
                  <label className="onboarding-label" htmlFor="name">
                    First name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="onboarding-input"
                    placeholder="e.g. Sara"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    autoComplete="given-name"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && (
                    <p className="onboarding-field-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
                <StepActions
                  onBack={goBack}
                  onNext={goNext}
                  saving={saving}
                  nextLabel="Finish"
                />
              </>
            )}

            {step === "finish" && (
              <div className="onboarding-finish">
                <div className="onboarding-finish-spinner" aria-hidden="true" />
                <h1 className="onboarding-title">
                  Building your career roadmap…
                </h1>
                <p className="onboarding-subtitle">
                  Personalizing milestones for {form.major || "your major"} at{" "}
                  {form.university || "your university"}.
                </p>
                <div className="onboarding-finish-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                {errors.finish && (
                  <p className="onboarding-field-error" role="alert">
                    {errors.finish}
                  </p>
                )}
                {errors.finish && (
                  <button
                    type="button"
                    className="onboarding-btn onboarding-btn-primary"
                    onClick={runFinish}
                  >
                    Try again
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepActions({ onBack, onNext, saving, nextLabel }) {
  return (
    <div className="onboarding-actions">
      <button
        type="button"
        className="onboarding-btn onboarding-btn-secondary"
        onClick={onBack}
        disabled={saving}
      >
        Back
      </button>
      <button
        type="button"
        className="onboarding-btn onboarding-btn-primary"
        onClick={onNext}
        disabled={saving}
      >
        {saving ? "Saving..." : nextLabel}
      </button>
    </div>
  );
}
