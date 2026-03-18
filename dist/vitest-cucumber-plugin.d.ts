import { Vite } from 'vitest/node';
import { log, logConfig } from './logger.js';
import { BeforeAll, applyBeforeAllHooks, Before, applyBeforeHooks, AfterAll, applyAfterAllHooks, After, applyAfterHooks, BeforeStep, applyBeforeStepHooks, AfterStep, applyAfterStepHooks } from './hooks.js';
import { State } from './state.js';
import { StepStatement } from './statement.js';
declare const Given: (expression: string, f: (state: State, args: any[], data: any) => State | undefined) => void;
declare const When: (expression: string, f: (state: State, args: any[], data: any) => State | undefined) => void;
declare const Then: (expression: string, f: (state: State, args: any[], data: any) => State | undefined) => void;
declare const Test: (state: State, step: StepStatement) => State;
declare const DataTable: (dataTable: Array<Array<string>>) => Array<Record<string, string>>;
declare const vitestCucumberPlugin: () => Vite.Plugin;
export { Given, When, Then, Test, log, logConfig, applyBeforeAllHooks, applyBeforeHooks, applyAfterAllHooks, applyAfterHooks, applyBeforeStepHooks, applyAfterStepHooks, BeforeAll, Before, AfterAll, After, BeforeStep, AfterStep, DataTable, vitestCucumberPlugin, };
//# sourceMappingURL=vitest-cucumber-plugin.d.ts.map