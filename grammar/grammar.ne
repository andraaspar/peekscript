@{%
  const moo = require("moo")

  const lexer = moo.compile({
    whitespace: { match: /[ \t]+/ },
    identifier: { match: /[$_a-zA-Z][$_a-zA-Z0-9]*/, type: moo.keywords({
      keyword: ['true', 'false', 'null']
    }) },
    operator: [
      '+',
      '-',
      '**',
      '*',
      '/',
      '%',
      '!==',
      '!=',
      '<',
      '<=',
      '>',
      '>=',
      '==',
      '===',
      '!',
      '??',
      '?',
      '||',
      '&&',
      // not in ast
      ',',
      ':',
      '(',
      ')',
    ],
    number: /[0-9]+(?:\.[0-9]+)?/,
    string: /'(?:\\'|[^'])*'/,
  })
%}

@lexer lexer

code ->
  _ expression _
    {% data => data[1] %}

expression ->
  operators
    {% id %}

operators ->
  ternary
    {% id %}

ternary ->
  coalesce _ "?" _ ternary _ ":" _ ternary
    {% data => ({ type: 'ternary', check: data[0], then: data[4], else: data[8] }) %}
  | coalesce
    {% id %}


@{%
  const COALESCE_INVALID_NEIGHBOR = {or: true, and: true}
%}
# This should be the same level as `||` but they can never exist on the same level anyway.
coalesce ->
  # Skip `||` and `&&` because: cannot use `??` unparenthesized within `||` and `&&` expressions
  coalesce _ "??" _ or
    {% data => {
      if (data[0].type in COALESCE_INVALID_NEIGHBOR || data[4].type in COALESCE_INVALID_NEIGHBOR) {
        throw new Error(`Syntax error: cannot use \`??\` unparenthesized within \`||\` and \`&&\` expressions. Line: ${data[2].line} Col: ${data[2].col}`)
      } else {
        return { type: 'coalesce', op: data[2], params: [data[0], data[4]] }
      }
    } %}
  | or
    {% id %}

or ->
  or _ "||" _ and
    {% data => ({ type: 'or', op: data[2], params: [data[0], data[4]] }) %}
  | and
    {% id %}

and ->
  and _ "&&" _ equality
    {% data => ({ type: 'and', op: data[2], params: [data[0], data[4]] }) %}
  | equality
    {% id %}

equality ->
  sum _ ("==="|"=="|"!=="|"!="|"<="|"<"|">="|">") _ sum
    {% data => ({ type: 'equality', op: data[2][0], params: [data[0], data[4]] }) %}
  | sum
    {% id %}

sum -> 
  sum _ ("+"|"-") _ product
    {% data => ({ type: 'sum', op: data[2][0], params: [data[0], data[4]] }) %}
  | product
    {% id %}

product ->
  product _ ("*"|"/"|"%") _ exponent
    {% data => ({ type: 'product', op: data[2][0], params: [data[0], data[4]] }) %}
  | exponent
    {% id %}

exponent ->
  funcall _ "**" _ exponent
    {% data => ({ type: 'exponent', op: data[2], params: [data[0], data[4]] }) %}
  | unary
    {% id %}

unary ->
  ("!"|"+"|"-") _ unary
    {% data => ({ type: 'unary', op: data[0][0], param: data[2] }) %}
  | funcall
    {% id %}

funcall ->
  identifier _ funparams
    {% data => ({ type: 'funcall', identifier: data[0], params: data[2] }) %}
  | grouping
    {% id %}
  | value
    {% id %}

funparams ->
  "(" ( _ expression (_ ","):? ):* _ ")"
    {% data => data[1].map(it => it[1]) %}

grouping ->
  "(" _ expression _ ")"
    {% data => ({ type: 'grouping', expression: data[2] }) %}

value ->
  null_
    {% id %}
  | boolean
    {% id %}
  | number
    {% id %}
  | string
    {% id %}
  | identifier
    {% id %}

identifier ->
  %identifier
    {% id %}

string ->
  %string
    {% data => ({ ...data[0], value: data[0].value.slice(1, -1) }) %}

number ->
  %number
    {% id %}

boolean ->
  "true"
    {% data => ({ ...data[0], value: true }) %}
  | "false"
    {% data => ({ ...data[0], value: false }) %}

null_ ->
  "null"
    {% data => ({ ...data[0], value: null }) %}

_ ->
  __
    {% data => null %}
  | null
    {% data => null %}
  
__ ->
  %whitespace
    {% data => null %}
