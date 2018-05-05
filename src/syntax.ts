import {INode} from "./interpreter"

export interface True {
    kind: 'TrueKeyword'
}

export interface False {
    kind: 'FalseKeyword'
}

export interface _<Expression extends INode> {
    kind: 'Expression',
    expression: Expression
}

export interface __<Expression1 extends INode, Expression2 extends INode | null = null> {
    kind: 'Block',
    expression: Expression1,
    next: Expression2
}

export interface Return<Value extends INode | null = null> {
    kind: 'ReturnStatement',
    expression: Value
}

export interface String<Value extends string> {
    kind: 'StringLiteral',
    text: Value
}

export interface $<Name extends string> {
    kind: 'Identifier',
    text: Name
}

export interface Set<VariableName extends INode, Value extends INode>{
    kind: 'VariableDeclaration',
    name: VariableName,
    initializer: Value
}

export interface If<Condition extends INode, TrueCase extends INode, FalseCase extends INode> {
    kind: 'ConditionalExpression',
    condition: Condition,
    then: TrueCase,
    else: FalseCase
}