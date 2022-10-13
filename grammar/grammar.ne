@{%
  const moo = require("moo")

  const lexer = moo.states({
    main: {
      stringStart: { match: /'/, push: 'string' },
      number: /\d+(?:\.\d+)?(?:e[-+]\d+)?/,
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
        '!=',
        '<',
        '<=',
        '>',
        '>=',
        '==',
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
        '.',
        '[',
        ']',
      ],
      whitespace: { match: /[ \t]+/ },
    },
    string: {
      stringEscape: /\\(?:u[a-fA-F0-9]{0,4}|[\\'nrt])?/,
      stringEnd: { match: /'/, pop: 1 },
      stringContent: { match: /[^']+/, lineBreaks: true },
    }
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
  sum _ ("=="|"!="|"<="|"<"|">="|">") _ sum
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
  ("!") _ unary
    {% data => ({ type: 'unary', op: data[0][0], param: data[2] }) %}
  | ("+"|"-") _ funcall
    {% data => ({ type: 'unary', op: data[0][0], param: data[2] }) %}
  | funcall
    {% id %}

funcall ->
  funcall _ "." _ identifier _ funparams
    {% data => ({ type: 'funcall', identifier: data[4], params: [data[0], ...data[6]] }) %}
  | funcall _ "." _ (identifier | boolean | null_)
    {% data => ({ type: 'access', object: data[0], key: data[4][0] }) %}
  | funcall _ "[" _ expression _ "]"
    {% data => ({ ...data[2], type: 'eaccess', object: data[0], key: data[4] }) %}
  | identifier _ funparams
    {% data => ({ type: 'funcall', identifier: data[0], params: data[2] }) %}
  | grouping
    {% id %}

funparams ->
  "(" ( _ expression _ "," ):* (_ expression):? _ ")"
    {% data => (data[2] ? [...data[1], data[2]] : data[1]).map(it => it[1]) %}

grouping ->
  "(" _ expression _ ")"
    {% data => ({ type: 'grouping', expression: data[2] }) %}
  | value
    {% id %}

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
  %stringStart (%stringContent | %stringEscape):* %stringEnd
    {% data => {
      let lineBreaks = 0
      let value = ''
      let text = data[0].text
      for (const [part] of data[1]) {
        if (part.lineBreaks) {
          lineBreaks += part.lineBreaks
        }
        text += part.text
        if (part.type === 'stringContent') {
          value += part.value
        } else {
          value += part.value.replace(/^\\(.*)$/, (match, letter) => {
            switch (letter) {
              case '\\': return '\\'
              case "'": return "'"
              case 'n': return '\n'
              case 'r': return '\r'
              case 't': return '\t'
              default:
                if (/u[a-f0-9]{4}/i.test(letter)) {
                  return String.fromCharCode(parseInt(letter.slice(1), 16))
                }
                throw new Error(`[rjj9tt] Invalid escape sequence: ${match} @ line ${part.line} col ${part.col}`)
            }
          })
        }
      }
      text += data[2].text
      return {
        type: 'string',
        offset: data[0].offset,
        line: data[0].line,
        col: data[0].col,
        lineBreaks,
        value,
        text,
      }
    } %}

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
