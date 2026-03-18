type Tags = Array<string>;

type StatementTypes =
    | 'background'
    | 'example'
    | 'examples'
    | 'rule'
    | 'feature'
    | 'given'
    | 'when'
    | 'then'
    | 'scenarioOutline'
    | 'docString';

interface StatementType<T extends StatementTypes> {
    type: T;
    name: string;
}

interface StatementBase<T extends StatementTypes> {
    type: StatementType<T>;
    tags?: Tags;
}

interface Example extends StatementBase<'example'> {
    name: string;
    background?: Background;
    steps: Array<StepStatement>;
}

interface Background extends StatementBase<'background'> {
    name: string;
    steps: Array<StepStatement>;
}

interface Rule extends StatementBase<'rule'> {
    name: string;
    examples: Array<Example>;
}

interface Feature extends StatementBase<'feature'> {
    name: string;
    statements: Array<Statement>;
    background?: Background;
}

interface DocString extends StatementBase<'docString'> {
    ws: string;
    contentType: string;
    text: string;
}

interface StepStatementBase<T extends StatementTypes> extends StatementBase<T> {
    text: string;
    dataTable?: Array<Array<string>>;
    docString?: DocString;
}

interface Given extends StepStatementBase<'given'> {}
interface When extends StepStatementBase<'when'> {}
interface Then extends StepStatementBase<'then'> {}

interface Examples extends StatementBase<'examples'> {
    name: string;
    dataTable: Array<Array<string>>;
}

interface ScenarioOutline extends StatementBase<'scenarioOutline'> {
    name: string;
    examples: Array<Examples>;
    steps: Array<StepStatement>;
}

type StatementMap = {
    background: Background;
    example: Example;
    examples: Examples;
    rule: Rule;
    feature: Feature;
    given: Given;
    when: When;
    then: Then;
    scenarioOutline: ScenarioOutline;
    docString: DocString;
};

type StepStatement = Given | When | Then;

type Statement = StatementMap[keyof StatementMap];

function isStatementType<K extends keyof StatementMap>(statement: Statement, kind: K): statement is StatementMap[K] {
    return statement.type.type === kind;
}

function resolveStatementType<K extends keyof StatementMap>(
    statement: Statement,
    kind: K,
): StatementMap[K] | undefined {
    if (isStatementType(statement, kind)) {
        return statement;
    }
}

export {
    isStatementType,
    resolveStatementType,
    Background,
    StepStatement,
    Given,
    When,
    Then,
    Statement,
    Rule,
    Example,
    Examples,
    Feature,
    ScenarioOutline,
    Tags,
};
