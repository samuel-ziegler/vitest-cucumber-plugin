import { Given, When, Then } from 'vitest-cucumber-plugin';
import { expect } from 'vitest';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface State {
  today: string;
  answer?: string;
}

Given('today is {}', async function (_: State, [today]) {
  await sleep(10);

  return {today};
});

When("I ask whether it's Friday yet", async function (state: State) {
  await sleep(10);

  const answer = state.today === 'Friday' ? 'TGIF' : 'Nope';

  return {...state, answer};
});

Then('I should be told {string}', async function (state: State, [answer]) {
  await sleep(10);

  expect(state.answer).toBe(answer);
});
