function isStatementType(statement, kind) {
    return statement.type.type === kind;
}
function resolveStatementType(statement, kind) {
    if (isStatementType(statement, kind)) {
        return statement;
    }
}
export { isStatementType, resolveStatementType, };
//# sourceMappingURL=statement.js.map