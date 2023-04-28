import { ExpressionFactory, ParameterTypeRegistry } from '@cucumber/cucumber-expressions';
import _ from 'lodash/fp.js';
import { log } from './logger.js';

var steps = [];

const typeName = {
    given : 'Given',
    then : 'Then',
    when : 'When',
};

const expressionFactory = new ExpressionFactory(new ParameterTypeRegistry());

export const addStepDefinition = (expression,f) => {
    log.debug('addStepDefinition expression: '+JSON.stringify(expression));
    const cucumberExpression = expressionFactory.createExpression(expression);
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
        throw new Error(`Undefined.  Implement with the following snippet:

    ${typeName[step.type.type]}('${step.text}', (state,params,data) => {
        // Write code here that turns the phrase above into concrete actions
        throw new Error('Not yet implemented!');
        return state;
    });
`);
    }

    if (stepDefinitionMatches.length > 1) {
        throw new Error('More than one step which matches: \''+step.type.name+' '+step.text+'\'');
    }

    return stepDefinitionMatches[0];
};
