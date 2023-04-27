import { BeforeAll, AfterAll, Before, After, BeforeStep, AfterStep } from 'vitest-cucumber-plugin';
import _ from 'lodash/fp.js';

Before({ tags : '@hooks and not @nobefore', name: 'add before' },(state) => {
    return _.set('beforeTags',_.concat(_.getOr([],'beforeTags',state),'beforeTags'),state);
});

After({ tags : '@hooks', name : 'clear beforeTags' },(state) => {
    state = _.set('beforeTags',[],state);
    return state;
});
