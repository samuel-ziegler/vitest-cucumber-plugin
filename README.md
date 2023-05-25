# vitest-cucumber-plugin

Plugin for [Vitest](https://vitest.dev/) to allow tests to be written in [Cucumber](https://cucumber.io/) format.

## Installation

```bash
npm install --save-dev vitest-cucumber-plugin
```

## Usage

### vite.config.js

Import the plugin then add it to the plugins array.  Change `test.include` to look for `.feature` files.

```js
import { defineConfig } from 'vitest/config'
import vitestCucumberPlugin from 'vitest-cucumber-plugin';

// Optional plugin configuration
const options = {
  stepDefinitionsPattern : 'features/**/*.js', // the default (relative to the Vite config root option)
  tags : '<tags boolean expression>', // Use this to filter the test via boolean tags expression
  log : { 
    level : '<"fatal", "error", "warn", "info", "debug", "trace" or "silent">',
    file : '<log path>', // Write the logs to a file instead of stdio (the default)
  }
}

export default defineConfig({
    plugins: [vitestCucumberPlugin(options)],
    test: {
        include : [ '**/*.feature' ],
    },
})
```

Setting the log level to 'info' will cause the plugin to generate logs useful for tracking the state through
the steps.  You can pipe the logs through pino-pretty to make them more human readable.

### Writing tests

Put feature files somewhere that matches your glob pattern in `test.include`. Step definitions are fetched from `features/**/*.js` by default, the pattern can be configured using the `stepDefinitionsPattern` option for the plugin function.

See below for the differences between tests written for Cucumber and for this plugin.

## Examples

Look in the [tests directory](tests) for examples on how to use the plugin.

## Differences between this plugin and Cucumber

The goal of this plugin is to fully implement Cucumber's Gherkin syntax for feature files, but
there are a few differences in how step definitions are written.

### Changes to Given/When/Then

The function signatures for Given, When and Then callbacks have been modified in order to make the step definitions
more friendly for functional programming.  Specifically, the callback functions differ in that they
now have three parameters.  The first parameter is a state object which was returned by the previous step.  The
second is an array of parameters values.  The third is a data table or a doc string.  The callback functions then
return a new state object which is passed to the next step definition in the chain.

For example, here is how you'd write step definitions in Cucumber:

```js
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

Then('I should be told {string}', function (expectedAnswer, dataTable) {
  assert.strictEqual(this.actualAnswer, expectedAnswer);
});
```

Here is how you'd write the same step functions in this plugin:

```js
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

Then('I should be told {string}', function (state,[ answer ], dataTable) {
    expect(state.answer).toBe(answer);
});
```

### Step definitions must be ECMAScript modules

Currently, all step definition files must be in ECMAScript module format.  CommonJS files might
work, but this configuration isn't tested.
