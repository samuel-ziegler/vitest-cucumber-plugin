import { Given, When, Then, DataTable } from 'vitest-cucumber-plugin';
import { expect } from 'vitest'
import _ from 'lodash/fp';

const addItem = (state,[ item ],data) => { return { items : _.concat(state.items ? state.items : [],item) } };

Given('I have a {string}',addItem);
Then('I get a {string}',addItem);
Then('I have the following items:',(state,params,data) => {
    const items = _.flatten(data);
    expect(state.items).toEqual(items);
    return state;
});
Then('I don\'t have a {string}',(state,[ item ],data) => {
    expect(state.items).not.toContain(item);
    return state;
});

Given('there are {int} cucumbers',(state,[ count ],data) => {
    return _.set('cucumbers',count,state);
});

When('I eat {int} cucumbers',(state,[ count ],data) => {
    return _.set('cucumbers',state.cucumbers - count,state);
});

Then('I should have {int} cucumbers',(state,[ count ],data) => {
    expect(state.cucumbers).toEqual(count);
    return state;
});
