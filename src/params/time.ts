import type { ParamMatcher } from "@sveltejs/kit";
import { time } from '$lib/validators'

export const match: ParamMatcher = (param) => {
  return time.safeParse(parseInt(param, 10)).success
}

