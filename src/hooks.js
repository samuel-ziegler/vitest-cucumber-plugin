import { log } from './logger.js';
import _ from 'lodash/fp.js';

const allHooks = {
    beforeAll : [],
    before : [],
    afterAll : [],
    after : [],
};

const applyHooks = async (hooksName,state) => {
    const hooks = allHooks[hooksName];
    log.debug('applyHooks: '+hooksName+' state: '+JSON.stringify(state));
    for (let i = 0; i < hooks.length; i++) {
        let hook = hooks[i];
        
        log.debug('applyHooks name: '+hook.name+' state: '+JSON.stringify(state));
        state = await hook.f(state);
        log.debug('applyHooks name: '+hook.name+' new state: '+JSON.stringify(state));
    }
    return state;
};

const addHook = (hooksName,name,f) => {
    if (_.isFunction(name)) {
        f = name;
        name = 'unnamed';
    }
    log.debug('addHook hooksName: '+hooksName+' name: '+name);
    allHooks[hooksName] = _.concat(allHooks[hooksName],{ name, f });
};

export const BeforeAll = (name,f) => { addHook('beforeAll',name,f) };
export const applyBeforeAllHooks = (state) => applyHooks('beforeAll',state);

export const Before = (name,f) => { addHook('before',name,f) };
export const applyBeforeHooks = (state) => applyHooks('before',state);

export const AfterAll = (name,f) => { addHook('afterAll',name,f) };
export const applyAfterAllHooks = (state) => applyHooks('afterAll',state);

export const After = (name,f) => { addHook('after',name,f) };
export const applyAfterHooks = (state) => applyHooks('after',state);
