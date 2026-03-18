import { State } from './state.js';
import { Tags } from './statement.js';
interface HookOptsObject {
    name: string;
    tags?: string;
}
type HookOpts = Function | string | HookOptsObject;
type ApplyHooksFunction = (state: State, tags?: Tags) => Promise<State>;
type HookFunction = (opts: HookOpts, f: Function) => void;
declare const BeforeAll: HookFunction;
declare const applyBeforeAllHooks: ApplyHooksFunction;
declare const Before: HookFunction;
declare const applyBeforeHooks: ApplyHooksFunction;
declare const BeforeStep: HookFunction;
declare const applyBeforeStepHooks: ApplyHooksFunction;
declare const AfterAll: HookFunction;
declare const applyAfterAllHooks: ApplyHooksFunction;
declare const After: HookFunction;
declare const applyAfterHooks: ApplyHooksFunction;
declare const AfterStep: HookFunction;
declare const applyAfterStepHooks: ApplyHooksFunction;
export { applyAfterStepHooks, AfterStep, applyAfterHooks, After, applyAfterAllHooks, AfterAll, applyBeforeStepHooks, BeforeStep, applyBeforeHooks, Before, applyBeforeAllHooks, BeforeAll, };
//# sourceMappingURL=hooks.d.ts.map