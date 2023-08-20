import type { ParamMatcher } from "@sveltejs/kit";
import { ulid } from '$lib/validators'

export const match: ParamMatcher = (param) => {
  return ulid.safeParse(param).success
}
