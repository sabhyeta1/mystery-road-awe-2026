import { useState, type FormEvent } from "react";
import { loadHypothesisDraft, saveHypothesisDraft } from "../state/persistence";
import type { Evidence, HypothesisDraft, Person } from "../../types/domain";

interface HypothesisFormProps {
  people: Person[];
  evidence: Evidence[];
}

// Every field of the form lives in this one object, because the fields belong together:
// they are saved together, loaded together and reset together.
type HypothesisFields = Omit<HypothesisDraft, "savedAt">;

const emptyFields: HypothesisFields = {
  suspectId: "",
  nature: "",
  evidenceIds: [],
  confidence: "50",
  explanation: "",
  alternative: "",
};

function readInitialFields(): { fields: HypothesisFields; savedAt: string | null } {
  const draft = loadHypothesisDraft();
  if (draft === null) return { fields: emptyFields, savedAt: null };
  const { savedAt, ...fields } = draft;
  return { fields, savedAt: savedAt === "" ? null : savedAt };
}

export function HypothesisForm({ people, evidence }: HypothesisFormProps) {
  const [initial] = useState(readInitialFields);
  const [fields, setFields] = useState<HypothesisFields>(initial.fields);
  const [savedAt, setSavedAt] = useState<string | null>(initial.savedAt);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField<K extends keyof HypothesisFields>(key: K, value: HypothesisFields[K]): void {
    // Immutable update: copy the old fields into a new object and replace just one of them.
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const draft: HypothesisDraft = { ...fields, savedAt: new Date().toISOString() };
    try {
      saveHypothesisDraft(draft);
      setSavedAt(draft.savedAt);
      setErrorMessage(null);
    } catch (err) {
      console.error("Could not save hypothesis draft", err);
      setErrorMessage("Your hypothesis could not be saved to local storage.");
    }
  }

  return (
    <div className="hypothesis-card">
      <h3>Hypothesis Draft</h3>
      <form id="hypothesisForm" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="hypSuspect">Suspected responsible person</label>
          <select
            id="hypSuspect"
            value={fields.suspectId}
            onChange={(event) => updateField("suspectId", event.target.value)}
          >
            <option value="">Select a person…</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypNature">Accidental or deliberate incident</label>
          <select
            id="hypNature"
            value={fields.nature}
            onChange={(event) => updateField("nature", event.target.value)}
          >
            <option value="">Select…</option>
            <option value="accidental">Accidental</option>
            <option value="deliberate">Deliberate</option>
            <option value="unclear">Unclear</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypEvidence">Selected supporting evidence</label>
          <select
            id="hypEvidence"
            multiple
            size={6}
            value={fields.evidenceIds}
            onChange={(event) =>
              updateField(
                "evidenceIds",
                Array.from(event.target.selectedOptions, (option) => option.value),
              )
            }
          >
            {evidence.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} - {item.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypConfidence">Confidence (0–100)</label>
          <input
            type="range"
            id="hypConfidence"
            min={0}
            max={100}
            value={fields.confidence}
            onChange={(event) => updateField("confidence", event.target.value)}
          />
          <output id="hypConfidenceValue">{fields.confidence}</output>
        </div>

        <div className="form-row">
          <label htmlFor="hypExplanation">Written explanation</label>
          <textarea
            id="hypExplanation"
            rows={4}
            placeholder="Explain your reasoning…"
            value={fields.explanation}
            onChange={(event) => updateField("explanation", event.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="hypAlternative">Alternative explanation</label>
          <textarea
            id="hypAlternative"
            rows={3}
            placeholder="What else could explain the evidence?"
            value={fields.alternative}
            onChange={(event) => updateField("alternative", event.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save hypothesis draft
          </button>
          {savedAt !== null && (
            <span className="saved-msg">Saved at {new Date(savedAt).toLocaleTimeString()}</span>
          )}
          {errorMessage !== null && <span role="alert">{errorMessage}</span>}
        </div>
      </form>
    </div>
  );
}
