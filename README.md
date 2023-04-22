# vitest-cucumber-plugin

Plugin for [Vitest](https://vitest.dev/) to allow tests to be written in [Cucumber](https://cucumber.io/) format.

## Installation

```
$ npm install --save-dev @SamZiegler/vitest-cucumber-plugin
```

## Examples

Look in the [tests directory](tests) for examples on how to use the plugin.

## Differences between this plugin and Cucumber

The goal of this plugin is to fully implement Cucumber's Gherkin syntax for feature files, but
there are a few differences in how step definitions are written.

### Changes to Given/When/Then

The function signatures for Given, When and Then callbacks have been change in order to make the step definitions
more friendly for functional programming.  Specifically, the callback functions differ in that they
now have two parameters, a state object and array of parameters.  The callback functions then return a new state
object which is passed to the next step definition in the chain.

For example, here is how you'd write step definitions in Cucumber:
```
const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

function isItFriday(today) {
  if (today === "Friday") {
    return "TGIF";
  } else {
    return "Nope";
  }
}

Given('today is {string}', function (givenDay) {
  this.today = givenDay;
});

When('I ask whether it\'s Friday yet', function () {
  this.actualAnswer = isItFriday(this.today);
});

Then('I should be told {string}', function (expectedAnswer) {
  assert.strictEqual(this.actualAnswer, expectedAnswer);
});
```

Here is how you'd write the same step functions in this plugin:
```
import { Given, When, Then } from 'vitest-cucumber-plugin';
import _ from 'lodash/fp.js';
import { expect } from 'vitest'

Given('today is Sunday', function () {
    return { today : 'Sunday' };
});

Given('today is Friday', function () {
    return { today : 'Friday' };
});

When('I ask whether it\'s Friday yet', function (state) {
    return _.set('answer',(state.today === 'Friday') ? 'TGIF' : 'Nope',state);
});

Then('I should be told {string}', function (state,[ answer ]) {
    expect(state.answer).toBe(answer);
});
```

### Step definitions must be ECMAScript modules

Currently, all step definition files must be in ECMAScript module format.  CommonJS files might
work, but this configuration isn't tested.


### Not yet implemented

This plugin is not yet feature complete.  Here is the list of features from Cucumber which aren't yet implemented:
* Rule keyword
* And, But and * keywords
* Background keyword
* Scenario Outline/Scenario Template keyword
* Examples/Scenarios keyword
* Doc strings
* Data Tables
* Tags
* Comments

