import _ from 'lodash/fp.js';
const parameterizeText = (text, parameterMap) => {
    return _.reduce((text, parameter) => {
        return text.replaceAll('<' + parameter + '>', parameterMap[parameter]);
    }, text)(_.keys(parameterMap));
};
export { parameterizeText };
//# sourceMappingURL=parameterize.js.map