type FalsyValue = false | null | undefined | 0 | ""
type Value<T> = { $type: "value"; $value: T };
type Reference<K extends string> = { $type: "reference"; $key: K };
type Pointer = Value<any> | Reference<any>;
type Scope = Object;
type GetValue<X extends ExecutionState, P extends Pointer> = ({
  value: P extends Value<any>
    ? (P["$value"] extends Pointer ? GetValue<X, P["$value"]> : P["$value"])
    : never;
  reference: P extends Reference<any>
    ? (GetScope<X>[P["$key"]] extends Pointer
        ? GetValue<X, GetScope<X>[P["$key"]]>
        : GetScope<X>[P["$key"]])
    : never;
})[P["$type"]];

type PutValue<
  X extends ExecutionState,
  N extends INode,
  R extends Pointer,
  V extends Pointer,
  K extends string = _<R, "$key">,
  S extends Scope = GetScope<X>,
  NS extends Scope = Pick<S, Exclude<keyof S, K>> & { [P in K]: V }
> = R["$type"] extends "reference"
  ? SetScope<X, NS>
  : SetSignal<X, ErrorSignal<["ReferenceException: a reference was expected, ", R, "was given instead in AST ", N]>>;

type NoSignal = { $signal: "none" };
type ErrorSignal<M> = { $signal: "error"; $message: M };
type ReturnSignal = {$signal : "return"}

type Signal = NoSignal | ErrorSignal<any> | ReturnSignal;
type _<T, K extends (keyof T) | string> = (T & { [P: string]: never })[K];

interface ExecutionState<
  C extends Scope = {},
  R extends Pointer = Value<any>,
  S extends Signal = Signal,
  P extends Pointer = Pointer
> {
  C: C;
  R: R;
  S: S;
  P: P;
}
type GlobalState = ExecutionState<
  {},
  Value<undefined>,
  NoSignal,
  Value<undefined>
>;
type GetScope<X extends ExecutionState> = X["C"];
type GetReturn<X extends ExecutionState> = X["R"];
type GetSignal<X extends ExecutionState> = X["S"];
type GetPointer<X extends ExecutionState> = X["P"];

type SetScope<X extends ExecutionState, S extends Object> = ExecutionState<
  S,
  GetReturn<X>,
  GetSignal<X>,
  GetPointer<X>
>;
type SetReturn<X extends ExecutionState, S extends Pointer> = ExecutionState<
  GetScope<X>,
  S,
  GetSignal<X>,
  GetPointer<X>
>;
type SetSignal<X extends ExecutionState, S extends Signal> = ExecutionState<
  GetScope<X>,
  GetReturn<X>,
  S,
  GetPointer<X>
>;
type SetPointer<X extends ExecutionState, S extends Pointer> = ExecutionState<
  GetScope<X>,
  GetReturn<X>,
  GetSignal<X>,
  S
>;

type ReturnStatementNode = {
  kind: "ReturnStatement"
  expression: INode | null
}
interface ReturnStatementRunner<X extends ExecutionState, N extends INode, FX extends ExecutionState= _<N, "expression"> extends null ? X : IRunner<X, _<N, "expression">>> {
  C: GetScope<FX>;
  R: _<N, "expression"> extends null ? GetReturn<FX> : GetPointer<FX>;
  S: ReturnSignal;
  P: GetPointer<X>;
}

type TrueKeywordNode = { kind: "TrueKeyword"};
interface TrueKeywordRunner<X extends ExecutionState, N extends INode> {
  C: GetScope<X>;
  R: GetReturn<X>;
  S: GetSignal<X>;
  P: Value<true>;
}

type FalseKeywordNode = { kind: "FalseKeyword"};
interface FalseKeywordRunner<X extends ExecutionState, N extends INode> {
  C: GetScope<X>;
  R: GetReturn<X>;
  S: GetSignal<X>;
  P: Value<false>;
}

type StringLiteralNode = { kind: "StringLiteral"; text: string };
interface StringLiteralRunner<X extends ExecutionState, N extends INode> {
  C: GetScope<X>;
  R: GetReturn<X>;
  S: GetSignal<X>;
  P: Value<_<N, "text">>;
}

type ExpressionNode = {
  kind: "Expression";
  expression: Exclude<INode, ExpressionNode>;
};
interface ExpressionRunner<
  X extends ExecutionState,
  N extends INode,
  CX extends ExecutionState = IRunner<X, _<N, "expression">>
> {
  C: GetScope<CX>;
  R: GetPointer<CX>;
  S: GetSignal<CX>;
  P: Value<undefined>;
}

type BlockNode = {
  kind: "Block";
  expression: Exclude<INode, BlockNode>;
  next: INode | null;
};
interface BlockRunner<
  X extends ExecutionState,
  N extends INode,
  CX extends ExecutionState = IRunner<X, _<N, "expression">>
> {
  C: GetScope<
    _<N, "next"> extends null ? CX : IRunner<CX, Exclude<_<N, "next">, null>>
  >;
  R: GetReturn<
    _<N, "next"> extends null ? CX : IRunner<CX, Exclude<_<N, "next">, null>>
  >;
  S: GetSignal<
    _<N, "next"> extends null ? CX : IRunner<CX, Exclude<_<N, "next">, null>>
  >;
  P: GetPointer<
    _<N, "next"> extends null ? CX : IRunner<CX, Exclude<_<N, "next">, null>>
  >;
}

type IdentifierNode = {
  kind: "Identifier";
  text: string;
};
interface IdentifierRunner<
  X extends ExecutionState,
  N extends INode,
  CX extends ExecutionState = IRunner<X, _<N, "expression">>
> {
  C: GetScope<X>;
  R: GetReturn<X>;
  S: GetSignal<X>;
  P: Reference<_<N, "text">>;
}

type VariableDeclarationNode = {
  kind: "VariableDeclaration";
  name: INode;
  initializer: INode;
};
interface VariableDeclarationRunner<
  X extends ExecutionState,
  N extends INode,
  IX extends ExecutionState = IRunner<X, _<N, "initializer">>,
  NX extends ExecutionState = IRunner<IX, _<N, "name">>,
  DS extends Scope = GetScope<NX>,
  NV extends string = GetValue<NX, GetPointer<NX>>,
  FX extends ExecutionState = PutValue<NX, N, GetPointer<NX>, GetPointer<IX>>
> {
  //C: Pick<DS, Exclude<keyof DS, NV>> & { [K in NV]: GetPointer<IX> };
  C: GetScope<FX>;
  R: GetReturn<FX>;
  S: GetSignal<FX>;
  P: GetPointer<FX>;
}

type ConditionalExpressionNode = {
  kind: "ConditionalExpression",
  condition: INode,
  then: INode,
  else: INode
}
interface ConditionalExpressionRunner<
  X extends ExecutionState,
  N extends INode,
  CX extends ExecutionState = IRunner<X, _<N, "condition">>,
  CV = GetValue<CX, GetPointer<CX>>,
  FX extends ExecutionState = CV extends FalsyValue ? IRunner<CX, _<N, "else">> : IRunner<CX, _<N, "then">>
> {
  C: GetScope<FX>;
  R: GetReturn<FX>;
  S: GetSignal<FX>;
  P: GetPointer<FX>;
}

export type INode =
  | StringLiteralNode
  | ExpressionNode
  | BlockNode
  | IdentifierNode
  | VariableDeclarationNode
  | ConditionalExpressionNode
  | TrueKeywordNode
  | FalseKeywordNode
  | ReturnStatementNode;
type IRunner<
  X extends ExecutionState = GlobalState,
  N extends INode = never
> = ({
  error: X;
  return: X;
  none: ({
    TrueKeyword: TrueKeywordRunner<X, N>;
    FalseKeyword: FalseKeywordRunner<X, N>;
    StringLiteral: StringLiteralRunner<X, N>;
    Expression: ExpressionRunner<X, N>;
    Block: BlockRunner<X, N>;
    Identifier: IdentifierRunner<X, N>;
    VariableDeclaration: VariableDeclarationRunner<X, N>;
    ConditionalExpression: ConditionalExpressionRunner<X, N>;
    ReturnStatement: ReturnStatementRunner<X, N>
  })[N["kind"]];
})[GetSignal<X>["$signal"]];

export type RunProgram<P extends INode> = {
  result: GetValue<IRunner<GlobalState, P>, GetReturn<IRunner<GlobalState, P>>>;
  error: GetSignal<IRunner<GlobalState, P>>;
};
