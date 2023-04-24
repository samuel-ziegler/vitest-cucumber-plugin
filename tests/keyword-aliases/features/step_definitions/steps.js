import { Given, When, Then, DataTable } from 'vitest-cucumber-plugin';
import { expect } from 'vitest'
import _ from 'lodash/fp';

const addItem = (state,[ item ],data) => { return { items : _.concat(state.items ? state.items : [],item) } };

Given('you have a {string}',addItem);
Then('you get a {string}',addItem);
Then('you have the following items:',(state,params,data) => {
    const items = _.flatten(data);
    expect(state.items).toEqual(items);
});
