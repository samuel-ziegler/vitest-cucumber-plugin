import _ from 'lodash/fp.js';

const parameterizeText: (text: string, parameterMap: Record<string, string>) => string = (text, parameterMap) => {
    return _.reduce((text: string, parameter: string) => {
        return text.replaceAll('<' + parameter + '>', parameterMap[parameter]);
    }, text)(_.keys(parameterMap));
};

export { parameterizeText };
