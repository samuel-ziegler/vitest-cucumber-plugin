# Contributing Guide

## Testing

```
$ npm test
```

Running this does a "npm install" followed by a "npm test" in each of the directories found in the [tests](tests)
directory.  The test suite fails if either of these commands returns with a non-zero exit code.

## Gherkin parser

This plugin uses [nearley](https://nearley.js.org/) with [moo](https://github.com/no-context/moo) to create it's
Gherkin parser.

Before you can run the parser generation script, you must install nearly globally:
```
$ npm install -g nearly
```

The parser nearley file is [src/gherkin.ne](src/gherkin.ne).  If you modify this file, you must
regenerate the generated parser JS file via:
```
$ npm run nearley
```

In addition to running nearley, this script also runs rollup in order to convert the generated parser into an 
ECMAScript module.

## Branching

This repo uses [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) as it's 
branching model.  The 'main' branch the release branch and is only pushed to during the release process.  The
'develop' branch is the cutting edge branch which is pushed to whenever a feature branch is finished.

## Doing a release

1. ```$ VERSION=<version>```
1. ```$ git flow release start $VERSION```
1. Update version number in package.json
1. Add the release notes to [RELEASE_NOTES.md](RELEASE_NOTES.md).
1. ```$ git add . ; git commit -m $VERSION```
2. ```$ npm test```
3. ```$ git flow release finish $VERSION```
4. ```$ git push```
5. ```$ git checkout main```
6. ```$ git push```
7. ```$ git push origin $VERSION```
8. ```$ npm publish```
