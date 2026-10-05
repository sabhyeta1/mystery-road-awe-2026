import { state } from "../state/store.js";
import type {
  CaseLocation,
  Evidence,
  EvidenceId,
  LocationId,
  Person,
  PersonId,
} from "../types/domain.js";

export function findEvidenceById(id: EvidenceId): Evidence | null {
  for (let i = 0; i < state.allEvidence.length; i++) {
    if (state.allEvidence[i].id === id) return state.allEvidence[i];
  }
  return null;
}

export function findPersonById(id: PersonId): Person | null {
  for (let i = 0; i < state.allPeople.length; i++) {
    if (state.allPeople[i].id === id) return state.allPeople[i];
  }
  return null;
}

export function findLocationById(id: LocationId): CaseLocation | null {
  for (let i = 0; i < state.allLocations.length; i++) {
    if (state.allLocations[i].id === id) return state.allLocations[i];
  }
  return null;
}

export function evidenceMentionsPerson(ev: Evidence, person: Person): boolean {
  return ev.personIds.includes(person.id);
}

export function countEvidenceForPerson(person: Person): number {
  let count = 0;
  for (let i = 0; i < state.allEvidence.length; i++) {
    if (evidenceMentionsPerson(state.allEvidence[i], person)) count++;
  }
  return count;
}
