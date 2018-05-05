import { _, __, Set, If, True, False, $, String, Return, RunProgram } from "../src";

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
