import { useEffect, useId, useMemo, useRef, useState } from "react";
import clsx from "clsx";

function normalizeLockedOptions(lockedOptions) {
  if (!lockedOptions) return new Set();
  if (lockedOptions instanceof Set) return lockedOptions;
  return new Set(lockedOptions);
}

export default function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Search...",
  allowCustom = false,
  lockedOptions = [],
  id: externalId,
  error,
}) {
  const generatedId = useId();
  const id = externalId || generatedId;
  const listId = `${id}-list`;
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const lockedSet = useMemo(() => normalizeLockedOptions(lockedOptions), [lockedOptions]);

  const isLocked = (option) => lockedSet.has(option);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);

  const firstSelectable = useMemo(
    () => filtered.find((option) => !lockedSet.has(option)),
    [filtered, lockedSet]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commitValue = (next) => {
    if (isLocked(next)) return;
    onChange(next);
    setQuery(next);
    setOpen(false);
  };

  const handleBlur = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (options.includes(trimmed)) {
      if (!isLocked(trimmed)) commitValue(trimmed);
      return;
    }

    if (allowCustom && !isLocked(trimmed)) {
      commitValue(trimmed);
    }
  };

  return (
    <div className="search-select" ref={rootRef}>
      <input
        id={id}
        type="text"
        className={clsx("onboarding-input", error && "onboarding-input-error")}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={Boolean(error)}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!e.target.value) onChange("");
        }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter" && firstSelectable) {
            e.preventDefault();
            commitValue(firstSelectable);
          }
          if (e.key === "Escape") setOpen(false);
        }}
      />

      {open && filtered.length > 0 && (
        <ul id={listId} className="search-select-list" role="listbox">
          {filtered.slice(0, 8).map((option) => {
            const locked = isLocked(option);
            return (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === option}
                  aria-disabled={locked}
                  disabled={locked}
                  className={clsx(
                    "search-select-option",
                    value === option && !locked && "search-select-option-active",
                    locked && "search-select-option-locked"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commitValue(option)}
                >
                  <span className="search-select-option-label">{option}</span>
                  {locked && (
                    <span className="search-select-option-badge">Coming soon</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {error && (
        <p className="onboarding-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
