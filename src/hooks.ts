import { log } from './logger.js';
import _ from 'lodash/fp.js';
import { TagsFunction, createTagsFunction } from './tags.js';
import { State } from './state.js';
import { Tags } from './statement.js';

interface HookOptsObject {
    name: string;
    tags?: string;
}

type HookOpts = Function | string | HookOptsObject;
type ApplyHooksFunction = (state: State, tags?: Tags) => Promise<State>;
type HookFunction = (opts: HookOpts, f: Function) => void;

interface Hook {
    name: string;
    f: Function;
    tagsFunction: TagsFunction;
}

const enum HookTypes {
    BeforeAll = 'beforeAll',
    Before = 'before',
    BeforeStep = 'beforeStep',
    AfterAll = 'afterAll',
    After = 'after',
    AfterStep = 'afterStep',
}

const allHooks: Record<HookTypes, Array<Hook>> = {
    beforeAll: [],
    before: [],
    beforeStep: [],
    afterAll: [],
    after: [],
    afterStep: [],
};

const hookNames: Record<HookTypes, string> = {
    beforeAll: 'BeforeAll',
    before: 'Before',
    beforeStep: 'BeforeStep',
    afterAll: 'AfterAll',
    after: 'After',
    afterStep: 'AfterStep',
};

const applyHooks: (hooksName: HookTypes, state: State, tags?: Tags) => Promise<State> = async (
    hooksName,
    state,
    tags,
) => {
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

const createHook: (opts: HookOpts, f?: Function) => Hook = (opts, f) => {
    if (_.isFunction(opts)) {
        const tagsFunction = createTagsFunction();
        return { name: '', f: opts, tagsFunction };
    } else if (_.isString(opts)) {
        if (f) {
            const tagsFunction = createTagsFunction();
            return { name: opts, f, tagsFunction };
        } else {
            throw new Error('Missing function argument: ' + JSON.stringify(opts));
        }
    } else if (_.isObject(opts)) {
        if (f) {
            const tagsFunction = createTagsFunction('tags' in opts ? opts.tags : undefined);

            return { f, tagsFunction, ...opts };
        } else {
            throw new Error('Missing function argument: ' + JSON.stringify(opts));
        }
    } else {
        throw new Error('Unknown options argument: ' + JSON.stringify(opts));
    }
};

const addHook: (hooksName: HookTypes, opts: HookOpts, f: Function) => void = (hooksName, opts, f) => {
    const hook = createHook(opts, f);

    log.debug(`addHook hooksName: ${hooksName} name: ${hook.name}`);
    allHooks[hooksName] = _.concat(allHooks[hooksName], hook);
};

const BeforeAll: HookFunction = (opts, f) => {
    addHook(HookTypes.BeforeAll, opts, f);
};
const applyBeforeAllHooks: ApplyHooksFunction = (state, tags) => applyHooks(HookTypes.BeforeAll, state, tags);

const Before: HookFunction = (opts, f) => {
    addHook(HookTypes.Before, opts, f);
};
const applyBeforeHooks: ApplyHooksFunction = (state, tags) => applyHooks(HookTypes.Before, state, tags);

const BeforeStep: HookFunction = (opts, f) => {
    addHook(HookTypes.BeforeStep, opts, f);
};
const applyBeforeStepHooks: ApplyHooksFunction = (state, tags) => applyHooks(HookTypes.BeforeStep, state, tags);

const AfterAll: HookFunction = (opts, f) => {
    addHook(HookTypes.AfterAll, opts, f);
};
const applyAfterAllHooks: ApplyHooksFunction = (state, tags) => applyHooks(HookTypes.AfterAll, state, tags);

const After: HookFunction = (opts, f) => {
    addHook(HookTypes.After, opts, f);
};
const applyAfterHooks: ApplyHooksFunction = (state, tags) => applyHooks(HookTypes.After, state, tags);

const AfterStep: HookFunction = (opts, f) => {
    addHook(HookTypes.AfterStep, opts, f);
};
const applyAfterStepHooks: ApplyHooksFunction = (state, tags) => applyHooks(HookTypes.AfterStep, state, tags);

export {
    applyAfterStepHooks,
    AfterStep,
    applyAfterHooks,
    After,
    applyAfterAllHooks,
    AfterAll,
    applyBeforeStepHooks,
    BeforeStep,
    applyBeforeHooks,
    Before,
    applyBeforeAllHooks,
    BeforeAll,
};
