import _ from 'lodash/fp.js';
import nearley from 'nearley';
import tagsExpressionParser from './tags-expression.js';
import { log } from './logger.js';

const parseTagsExpression = (tagsExpression) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(tagsExpressionParser));

    tagsExpression += '\n';
    parser.feed(tagsExpression);
    log.debug('parseTagsExpression expression: \''+tagsExpression+'\' results: '+JSON.stringify(parser.results));

    if (parser.results.length == 0) {
        throw new Error('Unexpected end of expression');
    }
    log.debug('parsing result: '+JSON.stringify(parser.results,null,2));
    if (parser.results.length > 1) {
        throw new Error('Ambiguous parsing: '+parser.results.length);
    }

    return parser.results[0];
}

const createFunction = (e) => {
    if (_.isString(e)) {
        log.debug('createFunction tag: '+e);
        return (tags) => {
            const result = _.find((tag) => tag == e,tags);
            log.debug('tagsExpression tag: '+e+' tags: '+JSON.stringify(tags)+' match? '+result);
            return result;
        }
    }

    if (!_.has('operator',e)) {
        throw new Error('Missing operator.');
    }

    if (e.operator == 'not') {
        log.debug('createFunction not '+JSON.stringify(e.expression));
        const f = createFunction(e.expression);
        return (tags) => !f(tags);
    }

    log.debug('createFunction '+JSON.stringify(e.left)+' '+e.operator+' '+JSON.stringify(e.right));
    const l = createFunction(e.left);
    const r = createFunction(e.right);
    
    if (e.operator == 'and') {
        return (tags) => (l(tags) && r(tags));
    }
    
    
    if (e.operator == 'or') {
        return (tags) => (l(tags) || r(tags));
    }
    
    throw new Error('Couldn\'t parse tags expression');
}

export const tagsFunction = (tagsExpression) => {
    if (!tagsExpression) {
        return (tags) => true;
    }
    
    const parsedTagsExpression = parseTagsExpression(tagsExpression);

    return createFunction(parsedTagsExpression);
}
