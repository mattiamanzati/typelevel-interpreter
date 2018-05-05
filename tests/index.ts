import { _, __, Set, If, True, False, $, String, Return, RunProgram, Not, Eq, And } from "../src";

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

type TestNotNodeResult = RunProgram<Return<Not<True>>>
const testNotNode: TestNotNodeResult = {
  result: false,
  error: {
    $signal: "return"
  }
}

type TestEqNodeResult = RunProgram<Return<Eq<True, True>>>
const testEqNode: TestEqNodeResult = {
  result: true,
  error: {
    $signal: "return"
  }
}


type TestEqNodeResult2 = RunProgram<Return<Eq<True, False>>>
const testEqNode2: TestEqNodeResult2 = {
  result: false,
  error: {
    $signal: "return"
  }
}


type TestEqNodeResult3 = RunProgram<Return<Eq<True, String<"Hello">>>>
const testEqNode3: TestEqNodeResult3 = {
  result: false,
  error: {
    $signal: "return"
  }
}

type TestEqNodeResult4 = RunProgram<Return<Eq<String<"Hello">, String<"Hello">>>>
const testEqNode4: TestEqNodeResult4 = {
  result: true,
  error: {
    $signal: "return"
  }
}

type TestAndNode = RunProgram<Return<And<True, False>>>
const testAndNode: TestAndNode = {
  result: false,
  error: {
    $signal: "return"
  }
}

type TestAndNode2 = RunProgram<Return<And<True, True>>>
const testAndNode2: TestAndNode2 = {
  result: true,
  error: {
    $signal: "return"
  }
}