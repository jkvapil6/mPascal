
const moo = require("moo")

const caseInsensitiveKeywords = (defs) => {
    const keywords = moo.keywords(defs)
    return (value) => keywords(value.toLowerCase())
}

const lexer = moo.compile({
    WS:         /[ \t]+/,
    bool:       ['false', 'true'],
    number:     /0|[1-9][0-9]*/,
    hexNum:     /\$[0-9a-fA-F]+/,
    binNum:     /\%[01]+/,
    string:     /'(?:\\['\\]|[^\n'\\])*'/,
    comment:    /\/\/.*?$/,
    inlComment: /{(?:\\["\\]|[^\n"\\])*}/,
    lparen:     '(',
    rparen:     ')',
    begin:      'begin',
    end:        ['end;', 'end.'],
    symbol:     {
        match: /[a-zA-Z][a-zA-Z_0-9]*/, value: (s) => s.toLowerCase(),
        type: caseInsensitiveKeywords({
            'kw_for': 'for',
            'kw_if': 'if',
            'kw_then': 'then',
            'kw_else': 'else',
            'kw_not': '!',
            'kw_to': 'to',
            'kw_downto': 'downto',
            'kw_do': 'do',
            'kw_while': 'while',
            'kw_repeat': 'repeat',
            'kw_until': 'until',
            'symbol': 'ord'
        }),
    },
    operator:   ['<=', '>=', 
        { match: '=', value: (e) => '==' }, 
        { match: 'mod', value: (e) => '%' }, 
        { match: 'xor', value: (e) => '^' }, 
        { match: 'or', value: (e) => '||' }, 
        { match: 'and', value: (e) => '&&' }, 
                '<>', '<', '>', '+', '-', '*', '/'],
    assign:     ':=',
    colon:      ':',
    semicolon:  ';',
    NL:         { match: /\n|\r\n/, lineBreaks: true },
}, {case: false})

module.exports = lexer