import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

const PRICING_OPTIONS = [
  { value: null, label: "All" },
  { value: "Free", label: "Free" },
  { value: "Paid", label: "Paid" },
  { value: "Free + Paid", label: "Free + Paid" },
];

const PRIORITY_OPTIONS = [
  { value: null, label: "All" },
  { value: "Essential", label: "Essential" },
  { value: "Recommended", label: "Recommended" },
  { value: "Optional", label: "Optional" },
];

const TYPE_OPTIONS = [
  { value: null, label: "All" },
  { value: "Reference", label: "Reference" },
  { value: "Project-based", label: "Project-based" },
  { value: "Reading", label: "Reading" },
  { value: "Video", label: "Video" },
  { value: "Tool", label: "Tool" },
  { value: "Community", label: "Community" },
];

function FilterDropdown({ label, value, options, onChange, active }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();

  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={clsx("resources-filter-dropdown", active && "resources-filter-dropdown-active")}
      ref={rootRef}
    >
      <button
        type="button"
        className="resources-filter-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <span className="resources-filter-dropdown-label">{label}</span>
        <span className="resources-filter-dropdown-value">{selected.label}</span>
        <ChevronDown
          size={16}
          className={clsx("resources-filter-dropdown-chevron", open && "resources-filter-dropdown-chevron-open")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul id={listId} className="resources-filter-dropdown-menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <li key={option.label} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={clsx(
                  "resources-filter-dropdown-option",
                  option.value === value && "resources-filter-dropdown-option-selected"
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ResourceFilters({
  filters,
  setFilters,
  hasActiveFilters,
  onClearFilters,
  savedCount,
}) {
  const savedOptions = [
    { value: null, label: "All resources" },
    { value: "saved", label: `Saved (${savedCount})` },
  ];

  return (
    <div className="resources-filters-wrap">
      <div className="resources-filters">
        <FilterDropdown
          label="Pricing"
          value={filters.pricing}
          options={PRICING_OPTIONS}
          active={Boolean(filters.pricing)}
          onChange={(value) => setFilters((prev) => ({ ...prev, pricing: value }))}
        />

        <FilterDropdown
          label="Priority"
          value={filters.priority}
          options={PRIORITY_OPTIONS}
          active={Boolean(filters.priority)}
          onChange={(value) => setFilters((prev) => ({ ...prev, priority: value }))}
        />

        <FilterDropdown
          label="Type"
          value={filters.type}
          options={TYPE_OPTIONS}
          active={Boolean(filters.type)}
          onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
        />

        {savedCount > 0 && (
          <FilterDropdown
            label="Saved"
            value={filters.showSavedOnly ? "saved" : null}
            options={savedOptions}
            active={filters.showSavedOnly}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, showSavedOnly: value === "saved" }))
            }
          />
        )}

        {hasActiveFilters && (
          <button type="button" className="resources-clear-btn" onClick={onClearFilters}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
