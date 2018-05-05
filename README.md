# typelevel-interpreter
Language and working Interpreter using only TypeScript types (no JavaScript either written or emitted)

```typescript
type Program<Bool extends True | False> = __<
  Set<$<"returnValue">, String<"">>,
  __<
    Set<$<"test">, Bool>,
    __<
      If<
        $<"test">,
        Set<$<"returnValue">, String<"It's true!">>,
        Set<$<"returnValue">, String<"unfortunately false :(">>
      >,
      Return<$<"returnValue">>
    >
  >
>;

const test1: RunProgram<Program<False>> = {
    result: "unfortunately false :(",
    error: {
        $signal: "return"
    }
};

const test2: RunProgram<Program<True>> = {
    result: "It's true!",
    error: {
        $signal: "return"
    }
};
```

## Wait... WAT?
![wat](http://i0.kym-cdn.com/photos/images/newsfeed/000/173/576/Wat8.jpg?1315930535)

Yeah, this was a saturday project! So don't even think about production environment.

I love typelevel programming in TypeScript, so I thought... can I bring it to next level?
Turned out that building a programming language and it's intepreter using only type definitions in TypeScript! :D

## Supported Nodes

[X] ReturnStatement
[X] TrueKeyword
[X] FalseKeyword
[X] StringLiteral
[X] Not
[X] Equals
[X] And
[X] Expression
[X] Block
[X] Identifier
[X] VariableDeclaration
[X] ConditionalExpression