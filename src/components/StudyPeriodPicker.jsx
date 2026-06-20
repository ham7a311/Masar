import clsx from "clsx";
import { STUDY_SEMESTERS, STUDY_YEAR_LEVELS } from "../data/onboardingOptions";
import {
  buildStudyPeriodValue,
  getReviewPeriodForYear,
  getStudyPeriodFormFields,
  isStudyPeriodCompleted,
  isStudyYearCompleted,
  normalizeYearValue,
} from "../utils/studyPeriod";

export default function StudyPeriodPicker({
  variant = "dashboard",
  yearLevel,
  semester,
  onYearLevelChange,
  onSemesterChange,
  onSelectPeriod,
  yearError,
  semesterError,
  activeStudyPeriod = "",
  completedStudyPeriods = [],
  reviewingPeriod = null,
}) {
  const isDashboard = variant === "dashboard";
  const labelClass = isDashboard ? "dash-settings-label" : "onboarding-label";
  const fieldClass = isDashboard ? "dash-settings-field" : "onboarding-field";
  const gridClass = isDashboard ? "dash-year-grid" : "onboarding-year-grid";
  const btnClass = isDashboard ? "dash-year-btn" : "onboarding-year-option";
  const activeClass = isDashboard ? "dash-year-btn-active" : "onboarding-year-option-active";
  const errorClass = isDashboard ? "dash-settings-error" : "onboarding-field-error";
  const showCompletion = isDashboard && activeStudyPeriod;

  const periodError = yearError || semesterError;

  const isYearSelected = (value) => {
    if (yearLevel !== value) return false;
    if (!isDashboard || !reviewingPeriod) return true;
    return !normalizeYearValue(reviewingPeriod).startsWith(`year-${value}-`);
  };

  const isSemesterSelected = (value) => {
    if (semester !== value) return false;
    if (!isDashboard || !reviewingPeriod) return true;
    return reviewingPeriod !== buildStudyPeriodValue(yearLevel ?? 1, value);
  };

  const handleYearClick = (value) => {
    if (isDashboard) {
      const { yearLevel: activeY, semester: activeS } =
        getStudyPeriodFormFields(activeStudyPeriod);

      if (activeY === value) {
        onSelectPeriod?.(null, value, activeS);
        onYearLevelChange(value);
        onSemesterChange(activeS);
        return;
      }

      if (activeY != null && value < activeY) {
        const review = getReviewPeriodForYear(
          value,
          activeStudyPeriod,
          completedStudyPeriods
        );
        if (review) {
          const { yearLevel: y, semester: s } = getStudyPeriodFormFields(review);
          onSelectPeriod?.(review, y, s);
          return;
        }
      }

      const defaultSem = 1;
      onSelectPeriod?.(null, value, defaultSem);
      onYearLevelChange(value);
      onSemesterChange(defaultSem);
      return;
    }
    onSelectPeriod?.(null, value, semester);
    onYearLevelChange(value);
  };

  const handleSemesterClick = (value) => {
    const y = yearLevel ?? 1;
    const period = buildStudyPeriodValue(y, value);

    if (
      isDashboard &&
      isStudyPeriodCompleted(period, activeStudyPeriod, completedStudyPeriods)
    ) {
      onSelectPeriod?.(period, y, value);
      return;
    }

    onSelectPeriod?.(null, y, value);
    onYearLevelChange(y);
    onSemesterChange(value);
  };

  return (
    <>
      <div className={fieldClass}>
        <span className={labelClass}>Year of study</span>
        <div className={gridClass} role="radiogroup" aria-label="Year of study">
          {STUDY_YEAR_LEVELS.map(({ value, label }) => {
            const yearDone =
              showCompletion &&
              isStudyYearCompleted(value, activeStudyPeriod, completedStudyPeriods);
            const isReviewing =
              isDashboard &&
              reviewingPeriod &&
              normalizeYearValue(reviewingPeriod).startsWith(`year-${value}-`);
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isYearSelected(value)}
                className={clsx(
                  btnClass,
                  isYearSelected(value) && activeClass,
                  yearDone && "dash-period-btn-completed",
                  isReviewing && "dash-period-btn-reviewing"
                )}
                onClick={() => handleYearClick(value)}
              >
                <span className="dash-period-btn-label">{label}</span>
                {yearDone && (
                  <span className="dash-period-completed-badge">Completed</span>
                )}
              </button>
            );
          })}
        </div>
        {yearError && !semesterError && (
          <p className={errorClass} role="alert">
            {yearError}
          </p>
        )}
      </div>

      <div className={fieldClass}>
        <span className={labelClass}>Semester</span>
        <div className={gridClass} role="radiogroup" aria-label="Semester">
          {STUDY_SEMESTERS.map(({ value, label }) => {
            const period = buildStudyPeriodValue(yearLevel ?? 1, value);
            const semDone =
              showCompletion &&
              isStudyPeriodCompleted(
                period,
                activeStudyPeriod,
                completedStudyPeriods
              );
            const isReviewing = isDashboard && reviewingPeriod === period;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isSemesterSelected(value)}
                className={clsx(
                  btnClass,
                  isSemesterSelected(value) && activeClass,
                  semDone && "dash-period-btn-completed",
                  isReviewing && "dash-period-btn-reviewing"
                )}
                onClick={() => handleSemesterClick(value)}
              >
                <span className="dash-period-btn-label">{label}</span>
                {semDone && (
                  <span className="dash-period-completed-badge">Completed</span>
                )}
              </button>
            );
          })}
        </div>
        {periodError && (
          <p className={errorClass} role="alert">
            {periodError}
          </p>
        )}
      </div>
    </>
  );
}
