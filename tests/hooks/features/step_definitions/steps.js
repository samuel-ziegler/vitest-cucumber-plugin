import { Given, When, Then, DataTable } from 'vitest-cucumber-plugin';
import { expect } from 'vitest'
import _ from 'lodash/fp';

Given('nothing',(state) => state);
Then('nothing happens',(state) => state);
When('the {string} property is an array with the values:',(state,[ propertyName ],dataTable) => {
    const values = _.flatten(dataTable);
    expect(state[propertyName]).toEqual(values);
    return state;
});

When('the {string} property is an array with the integer values:',(state,[ propertyName ],dataTable) => {
    let values = _.flatten(dataTable);
    values = _.map(parseInt)(values);
    expect(state[propertyName]).toEqual(values);
    return state;
});

When('the {string} property does not exist',(state,[propertyName]) => {
    expect(_.has('propertyName',state)).toBeFalsy();
    return state;
});

When('the {string} property is an empty array',(state,[ propertyName ]) => {
    expect(state[propertyName]).toEqual([]);
    return state;
});
