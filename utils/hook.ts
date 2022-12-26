import _ from "lodash";

export const debounceHook = _.debounce((callback) => { callback() }, 1000)