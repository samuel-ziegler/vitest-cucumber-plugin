import { Given, When, Then } from 'vitest-cucumber-plugin';
import { expect } from 'vitest';
import _ from 'lodash/fp';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

Given('today is Sunday', async function () {
  await sleep(10);

  return {today: 'Sunday'};
});

When("I ask whether it's Friday yet", async function (state) {
  await sleep(10);

  return _.set('answer', 'Nope', state);
});

Then('I should be told {string}', async function (state, [answer]) {
  await sleep(10);

  expect(state.answer).toBe(answer);
});
