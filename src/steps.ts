import { ExpressionFactory, ParameterTypeRegistry, Expression, Argument } from '@cucumber/cucumber-expressions';
import _ from 'lodash/fp.js';
import { log } from './logger.js';
import { State } from './state.js';
import { StepStatement } from './statement.js';

type MaybePromise<T> = T | Promise<T>;

type StepFunction<S extends State = State, R extends State | undefined = undefined, A extends any[] = any> = [
    R,
] extends [undefined]
    ? (state: S, args: A, data?: Array<Array<string>> | string) => MaybePromise<void | object>
    : (state: S, args: A, data?: Array<Array<string>> | string) => MaybePromise<R>;

interface StepDefinition<S extends State = State, R extends State | undefined = undefined, A extends any[] = any> {
    expression: string;
    f: StepFunction<S, R, A>;
    cucumberExpression: Expression;
}

var steps: Array<StepDefinition<any, any, any>> = [];

const typeName = {
    given: 'Given',
    then: 'Then',
    when: 'When',
};

const expressionFactory = new ExpressionFactory(new ParameterTypeRegistry());

const addStepDefinition: <S extends State = State, R extends State | undefined = undefined, A extends any[] = any>(
    expression: string,
    f: StepFunction<S, R, A>,
) => void = (expression, f) => {
    log.debug({ expression }, 'addStepDefinition expression');
    const cucumberExpression = expressionFactory.createExpression(expression);
    steps = _.concat(steps, { expression, f, cucumberExpression });
};

interface StepDefinitionMatch {
    stepDefinition: StepDefinition;
    parameters: any[];
}

const findStepDefinitionMatches: (step: StepStatement) => StepDefinitionMatch[] = (step) => {
    const matchesMapper = _.map((match: Argument) => match.getValue(undefined));
    const reducer = _.reduce<StepDefinition, StepDefinitionMatch[]>(
        (accumulator: StepDefinitionMatch[], stepDefinition: StepDefinition) => {
            const matches = stepDefinition.cucumberExpression.match(step.text);
            if (matches) {
                //console.log(accumulator,stepDefinition,matches);
                return _.concat(accumulator, { stepDefinition, parameters: matchesMapper(matches) });
            } else {
                return accumulator;
            }
        },
    );

    return reducer([])(steps);
};

const findStepDefinitionMatch: (step: StepStatement) => StepDefinitionMatch = (step) => {
    const stepDefinitionMatches = findStepDefinitionMatches(step);

    if (!stepDefinitionMatches || stepDefinitionMatches.length == 0) {
        throw new Error(`Undefined.  Implement with the following snippet:

    ${typeName[step.type.type]}('${step.text}', (state,params,data) => {
        // Write code here that turns the phrase above into concrete actions
        throw new Error('Not yet implemented!');
        return state;
    });
`);
    }

    if (stepDefinitionMatches.length > 1) {
        throw new Error("More than one step which matches: '" + step.type.name + ' ' + step.text + "'");
    }

    return stepDefinitionMatches[0];
};

export { addStepDefinition, findStepDefinitionMatch, StepDefinitionMatch };
