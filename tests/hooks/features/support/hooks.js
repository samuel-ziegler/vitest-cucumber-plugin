import { BeforeAll, AfterAll, Before, After } from 'vitest-cucumber-plugin';
import _ from 'lodash/fp.js';

BeforeAll('add beforeAll1',(state) => {
    return _.set('beforeAll',_.concat(_.getOr([],'beforeAll',state),'beforeAll1'),state);
});

BeforeAll('add beforeAll2',(state) => {
    return _.set('beforeAll',_.concat(_.getOr([],'beforeAll',state),'beforeAll2'),state);
});

AfterAll('check that BeforeAll happened',(state) => {
    if (!_.isEqual(state.beforeAll,['beforeAll1','beforeAll2'])) {
        throw new Error('beforeAll is wrong!');
    }
    return state;
});

AfterAll('add afterAll1',(state) => {
    return _.set('afterAll',_.concat(_.getOr([],'afterAll',state),'afterAll1'),state);
});

AfterAll('add afterAll2',(state) => {
    return _.set('afterAll',_.concat(_.getOr([],'afterAll',state),'afterAll2'),state);
});

AfterAll('check that AfterAll happened',(state) => {
    if (!_.isEqual(state.afterAll,['afterAll1','afterAll2'])) {
        throw new Error('afterAll is wrong!');
    }
    return state;
});

Before('add before1',(state) => {
    return _.set('before',_.concat(_.getOr([],'before',state),'before1'),state);
});

Before('add before2',(state) => {
    return _.set('before',_.concat(_.getOr([],'before',state),'before2'),state);
});

After('check that Before happened',(state) => {
    if (!_.isEqual(state.before,['before1','before2'])) {
        throw new Error('before is wrong!');
    }
    return state;
});

After('add after1',(state) => {
    return _.set('after',_.concat(_.getOr([],'after',state),'after1'),state);
});

After('add after2',(state) => {
    return _.set('after',_.concat(_.getOr([],'after',state),'after2'),state);
});

After('check that After happened',(state) => {
    if (!_.isEqual(state.after,['after1','after2'])) {
        throw new Error('after is wrong!');
    }

    state = _.set('after',[],state);
    state = _.set('before',[],state);
    return state;
});
