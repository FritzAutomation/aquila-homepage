export const FOUNDING_YEAR = 1996

export function getYearsInBusiness(): number {
  return new Date().getFullYear() - FOUNDING_YEAR
}
