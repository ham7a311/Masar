import { Star } from "lucide-react";
import {
  getCareerImpactContexts,
  getCareerImpactExplanation,
  getCareerImpactStars,
} from "../../utils/mastery";

export default function CareerImpactDisplay({ goalRelevance, careerGoalLabel }) {
  const stars = getCareerImpactStars(goalRelevance);
  const explanation = getCareerImpactExplanation(stars, careerGoalLabel);
  const contexts = getCareerImpactContexts(stars);

  return (
    <div className="dash-career-impact">
      <p className="dash-topic-focus-label">Career Impact</p>
      <div className="dash-career-impact-stars" aria-label={`${stars} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={18}
            className={n <= stars ? "dash-star-filled" : "dash-star-empty"}
            fill={n <= stars ? "currentColor" : "none"}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="dash-career-impact-desc">{explanation}</p>
      <p className="dash-topic-focus-sublabel">Highly relevant for</p>
      <ul className="dash-topic-focus-list">
        {contexts.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
