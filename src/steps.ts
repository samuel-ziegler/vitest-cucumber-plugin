import { ExpressionFactory, ParameterTypeRegistry, Expression, Argument } from '@cucumber/cucumber-expressions';
import _ from 'lodash/fp.js';
import { log } from './logger.js';
import { State } from './state.js';
import { StepStatement } from './statement.js';

type StepFunction = (state: State, args: any[], data: any) => State | undefined;

interface StepDefinition {
    expression: string;
    f: StepFunction;
    cucumberExpression: Expression;
}

var steps: Array<StepDefinition> = [];

const typeName = {
    given: 'Given',
    then: 'Then',
    when: 'When',
};

const expressionFactory = new ExpressionFactory(new ParameterTypeRegistry());

const addStepDefinition: (expression: string, f: StepFunction) => void = (expression, f) => {
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
