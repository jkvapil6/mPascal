@{%
    const l = require("./lexer")
%}

@lexer l 

# @builtin "whitespace.ne"

####################

program
    ->  %begin __ statements __ (fn_call_no_args|fn_call):? _ %end _
        {%
           (data) => {  
                return {
                    type: "program",
                    statements: data[2],
                    lastFn: data[4] 
                }
            }
        %}

program2
    ->  %begin __ statements __ %end
        {%
           (data) => {  
                return {
                    type: "program",
                    statements: data[2]
                }
            }
        %}


subprogram
    ->  statement
    |   program2


statements
    ->  statement ( __ statement):*
        {%
            (data) => {
                const repeated = data[1]
                const rest = repeated.map(s => s[1])
                return [data[0], ...rest]
            }
        %}

# ws_statement 
#     ->  __ statement __

statement
    ->  assignment ";":?        {% id %}
    |   fn_call ";":?           {% id %}
    |   fn_call_no_args _ ";":?   {% id %}
    |   for_loop                {% id %}
    |   while_loop              {% id %}
    |   cond                    {% id %}
    |   %inlComment                 
    |   %comment


fn_call_no_args
    -> (%symbol|%specFn) 
        {% 
            (data) => {
                return {
                    type: "fn_call_no_args",
                    fnName: data[0]
                }   
            }
        %}


fn_call
    ->  (%symbol|%specFn) _ "(" _ fn_arg _ (":" %number):? ")"
        {%
            (data) => {
                return {
                    type: "fn_call",
                    fnName: data[0],
                    arg: data[4],
                    specifier: data[6]
                }
            }
        %}


fn_arg
    ->  expr
        {%
            (data) => { return [data[0]] }
        %}


assignment
    ->  %symbol _ ":=" _ expr
        {%
            (data) => {
                return {
                    type: "assignment",
                    symbol: data[0],
                    value: data[4]
                }
            }
        %}


while_loop
    ->  %kw_while _ expr _ %kw_do _ subprogram 
        {%
            (data) => {
                return {
                    type: "while_loop",
                    expr: data[2],
                    statements: data[6]
                }
            }
        %}
    |  %kw_repeat __ statements __ %kw_until __ expr _ ";"
        {%
            (data) => {
                return {
                    type: "dowhile_loop",
                    expr: data[6],
                    statements: data[2]
                }
            }
        %}


for_loop
    ->  %kw_for __ assignment __ %kw_to __ expr __ %kw_do __ subprogram
        {%
            (data) => {
                return {
                    type: "for_loop",
                    assignment: data[2],
                    to: data[6],
                    statements: data[10]
                }
            }
        %}
    |   %kw_for __ assignment __ %kw_downto __ expr __ %kw_do __ subprogram
        {%
            (data) => {
                return {
                    type: "for_loop",
                    assignment: data[2],
                    downto: data[6],
                    statements: data[10]
                }
            }
        %}


cond 
    ->  %kw_if __ expr __ %kw_then __ subprogram __ %kw_else __ subprogram
        {%
            (data) => {
                return {
                    type: "cond",
                    expr: data[2],
                    statements: data[6],
                    else_statements: data[10]
                }
            }
        %}    
    |   %kw_if __ expr __ %kw_then __ subprogram
        {%
            (data) => {
                return {
                    type: "cond",
                    expr: data[2],
                    statements: data[6]
                }
            }
        %}


expr 
    # ->  not:? _ %symbol
    ->   %string {% id %}
    # |   %number {% id %}
    # |   lpar:? num rpar:?
    # |   num
    # |   not:? _ %bool
    |   fn_call {% id %}
    |   operation
    
operation
    ->  atomParen _ %operator _ operation
    |   atomParen

atomParen -> %lparen _ operation _ %rparen
    | atom

lpar -> %lparen {% id %}

rpar -> %rparen {% id %}

# not -> %not {% id %}

atom -> %number {% id %}
    | %not _ %symbol
        {%  
            (data) => {
                return {
                    type: "symbol",
                    value: `!${data[2]}`,
                    text: `!${data[2]}`
                }
            } 
        %}
    | %symbol {% id %}
    | %not _ %bool 
        {%  
            (data) => {
                return {
                    type: "bool",
                    value: `!${data[2]}`,
                    text: `!${data[2]}`
                }
            } 
        %}
    | %bool {% id %}

# num 
#     ->  %number {% id %}
#     |   %number _ rpar:? _ %operator _ lpar:? _ expr
#     # |   %number _ %operator _ lpar:? _ expr
#     {%             
#         (data) => {
#             return {
#                 type: "operation",
#                 left: data[0],
#                 operator: data[4],
#                 right: data[8]
#             }
#         } %}
#     |   %symbol _ rpar:? _ %operator _ lpar:? _ expr
#     {%             
#         (data) => {
#             return {
#                 type: "operation",
#                 left: data[0],
#                 operator: data[4],
#                 right: data[8]
#             }
#         } %}
#     |   %not _ %symbol _ rpar:? _ %operator _ lpar:? _ expr
#     {%             
#         (data) => {
#             return {
#                 type: "notOperation",
#                 left: data[2],
#                 operator: data[6],
#                 right: data[10]
#             }
#         } %}

# operator
#     ->  %operator   {% id %}
#     |   %kw_mod     {% id %}


# operation 
#     ->  expr _ operator _ expr
#         {%
#             (data) => {
#                 return {
#                     type: "operation",
#                     left: data[0],
#                     operator: data[2],
#                     right: data[4]
#                 }
#             }
#         %}


# _ -> (_ %NL):+ _

## Zero or more multiline whitespaces
_   -> (%WS | %NL):* {% () => { } %}

## One or more multiline whitespaces
__   -> (%WS | %NL):+  {% () => { } %}

# ## Zero or more whitespaces
# _   -> %WS:*

# ## One or more whitespaces
# __   -> %WS:+

  
# # Whitespace
# _ -> null | _ [\n|\r\n|\s|\t] {% () => null %}
# __ -> [\s] | __ [\s] {% () => null %}