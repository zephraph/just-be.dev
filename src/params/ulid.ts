import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
  return /[0-7][0-9A-HJKMNP-TV-Z]{25}/.test(param)
}
