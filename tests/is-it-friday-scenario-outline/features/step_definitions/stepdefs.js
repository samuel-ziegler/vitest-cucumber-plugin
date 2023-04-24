import { Given, When, Then } from 'vitest-cucumber-plugin';
import _ from 'lodash/fp.js';
import { expect } from 'vitest'

Given('today is {string}', function (state,[ today ]) {
    return { today };
});

When('I ask whether it\'s Friday yet', function (state) {
    return _.set('answer',(state.today === 'Friday') ? 'TGIF' : 'Nope',state);
});

Then('I should be told {string}', function (state,[ answer ]) {
    expect(state.answer).toBe(answer);
});
