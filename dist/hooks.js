import { log } from './logger.js';
import _ from 'lodash/fp.js';
import { createTagsFunction } from './tags.js';
const allHooks = {
    beforeAll: [],
    before: [],
    beforeStep: [],
    afterAll: [],
    after: [],
    afterStep: [],
};
const hookNames = {
    beforeAll: 'BeforeAll',
    before: 'Before',
    beforeStep: 'BeforeStep',
    afterAll: 'AfterAll',
    after: 'After',
    afterStep: 'AfterStep',
};
const applyHooks = async (hooksName, state, tags) => {
    const hooks = allHooks[hooksName];
    log.debug({ state }, `applyHooks: ${hooksName}`);
    for (let i = 0; i < hooks.length; i++) {
        let hook = hooks[i];
        log.debug({ state }, `applyHooks name: ${hook.name}`);
        const result = hook.tagsFunction(tags);
        log.debug('applyHooks match? ' + result + ' tags: ' + JSON.stringify(tags));
        if (result) {
            const origState = state;
            state = await hook.f(state);
            log.info({ state, origState }, `${hookNames[hooksName]}('${hook.name}')`);
        }
    }
    return state;
};
const createHook = (opts, f) => {
    if (_.isFunction(opts)) {
        const tagsFunction = createTagsFunction();
        return { name: '', f: opts, tagsFunction };
    }
    else if (_.isString(opts)) {
        if (f) {
            const tagsFunction = createTagsFunction();
            return { name: opts, f, tagsFunction };
        }
        else {
            throw new Error('Missing function argument: ' + JSON.stringify(opts));
        }
    }
    else if (_.isObject(opts)) {
        if (f) {
            const tagsFunction = createTagsFunction('tags' in opts ? opts.tags : undefined);
            return { f, tagsFunction, ...opts };
        }
        else {
            throw new Error('Missing function argument: ' + JSON.stringify(opts));
        }
    }
    else {
        throw new Error('Unknown options argument: ' + JSON.stringify(opts));
    }
};
const addHook = (hooksName, opts, f) => {
    const hook = createHook(opts, f);
    log.debug(`addHook hooksName: ${hooksName} name: ${hook.name}`);
    allHooks[hooksName] = _.concat(allHooks[hooksName], hook);
};
const BeforeAll = (opts, f) => {
    addHook("beforeAll" /* HookTypes.BeforeAll */, opts, f);
};
const applyBeforeAllHooks = (state, tags) => applyHooks("beforeAll" /* HookTypes.BeforeAll */, state, tags);
const Before = (opts, f) => {
    addHook("before" /* HookTypes.Before */, opts, f);
};
const applyBeforeHooks = (state, tags) => applyHooks("before" /* HookTypes.Before */, state, tags);
const BeforeStep = (opts, f) => {
    addHook("beforeStep" /* HookTypes.BeforeStep */, opts, f);
};
const applyBeforeStepHooks = (state, tags) => applyHooks("beforeStep" /* HookTypes.BeforeStep */, state, tags);
const AfterAll = (opts, f) => {
    addHook("afterAll" /* HookTypes.AfterAll */, opts, f);
};
const applyAfterAllHooks = (state, tags) => applyHooks("afterAll" /* HookTypes.AfterAll */, state, tags);
const After = (opts, f) => {
    addHook("after" /* HookTypes.After */, opts, f);
};
const applyAfterHooks = (state, tags) => applyHooks("after" /* HookTypes.After */, state, tags);
const AfterStep = (opts, f) => {
    addHook("afterStep" /* HookTypes.AfterStep */, opts, f);
};
const applyAfterStepHooks = (state, tags) => applyHooks("afterStep" /* HookTypes.AfterStep */, state, tags);
export { applyAfterStepHooks, AfterStep, applyAfterHooks, After, applyAfterAllHooks, AfterAll, applyBeforeStepHooks, BeforeStep, applyBeforeHooks, Before, applyBeforeAllHooks, BeforeAll, };
//# sourceMappingURL=hooks.js.map