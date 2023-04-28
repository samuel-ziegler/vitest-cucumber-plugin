import * as testUtils from '@vue/test-utils';
import { v4 as uuid } from 'uuid';
import _ from 'lodash/fp.js';

const components = {};

const mount = (vue,options) => {
    const id = uuid();
    const mountOptions = {};
    components[id] = testUtils.mount(vue,mountOptions);
    return { id, options };
};

const get = (component) => components[component.id];

export {
    mount,
    get,
};
