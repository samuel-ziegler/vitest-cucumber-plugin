import { ExpressionFactory, ParameterTypeRegistry } from '@cucumber/cucumber-expressions';
import _ from 'lodash/fp.js';

var steps = [];

const expressionFactory = new ExpressionFactory(new ParameterTypeRegistry());

export const addStepDefinition = (expression,f) => {
    const cucumberExpression = expressionFactory.createExpression(expression);
    //console.log(cucumberExpression);
    steps = _.concat(steps,{ expression, f, cucumberExpression });
}


const findStepDefinitionMatches = (step) => {
    const matchesMapper = _.map((match) => match.getValue());
    const reducer = _.reduce((accumulator,stepDefinition) => {
        const matches = stepDefinition.cucumberExpression.match(step.text);
        if (matches) {
            //console.log(accumulator,stepDefinition,matches);
            return _.concat(accumulator,{ stepDefinition, parameters : matchesMapper(matches) });
        } else {
            return accumulator;
        }
    });

    return reducer([])(steps);
};

export const findStepDefinitionMatch = (step) => {
    const stepDefinitionMatches = findStepDefinitionMatches(step);
    
    if (!stepDefinitionMatches || (stepDefinitionMatches.length == 0)) {
        throw new Error('Step not defined: \''+step+'\'');
    }

    if (stepDefinitionMatches.length > 1) {
        throw new Error('More than one step which matches: \''+step+'\'');
    }

    return stepDefinitionMatches[0];
};
