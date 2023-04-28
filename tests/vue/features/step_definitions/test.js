import { Given, When, Then } from 'vitest-cucumber-plugin';
import Test from '../../src/test.vue';
import { mount, get } from '../support/components.js';
import { expect } from 'vitest';
import _ from 'lodash/fp.js';

Given('I have a test component', (state,params,data) => {
    return _.set('test',mount(Test),state);
});

When('I do nothing', (state,params,data) => state);

Then('the test component text is {string}', (state,[ text ],data) => {
    const testComponent = get(state.test);
    const textElement = testComponent.get('.text');
    expect(textElement.text()).toBe(text);
    return state;
});

When('I push the button', (state,params,data) => {
    const testComponent = get(state.test);
    const buttonElement = testComponent.get('button');
    buttonElement.trigger('click');
    return state;
});
