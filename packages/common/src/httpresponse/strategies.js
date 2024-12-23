import { OKEstrategy } from "./okstrategies.js";
import { ErrorsEstrategy } from "./errorstrategies.js";

export const strategies = {...OKEstrategy, ...ErrorsEstrategy}