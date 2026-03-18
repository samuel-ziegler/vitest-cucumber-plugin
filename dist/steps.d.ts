import { Expression } from '@cucumber/cucumber-expressions';
import { State } from './state.js';
import { StepStatement } from './statement.js';
type StepFunction = (state: State, args: any[], data: any) => State | undefined;
interface StepDefinition {
    expression: string;
    f: StepFunction;
    cucumberExpression: Expression;
}
declare const addStepDefinition: (expression: string, f: StepFunction) => void;
interface StepDefinitionMatch {
    stepDefinition: StepDefinition;
    parameters: any[];
}
declare const findStepDefinitionMatch: (step: StepStatement) => StepDefinitionMatch;
export { addStepDefinition, findStepDefinitionMatch, StepDefinitionMatch };
//# sourceMappingURL=steps.d.ts.map