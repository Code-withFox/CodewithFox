import type { Certification } from "@/types/certifications";

/**
 * No certifications have been earned yet — this vault is intentionally empty
 * rather than padded with invented credentials. As real certificates are
 * earned, add them here:
 *
 * {
 *   name: "Example Certification",
 *   provider: "Example Provider",
 *   date: "2027-01-01",
 *   credentialId: "XXXX",
 *   verifyUrl: "https://..."
 * }
 */
export const certifications: Certification[] = [];

export const certificationNote =
  "No certifications yet — and none will be listed here until they're actually earned. The vault is ready; the credentials are in progress.";
