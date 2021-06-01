
const fs = require("mz/fs")

///
/// Generete JS expression from AST node
///
const generateJSExpr = (node) => {
    // console.log(node)
    if (node.type === "cond") {
        const expr = generateJSExpr(node.expr)
        const statements = []
        node.statements.forEach(s => {
            const tmp = generateJSExpr(s)
            statements.push(tmp)
        })
        
        if (node.else_statements) {
            const else_statements = []
            node.else_statements.forEach(s => {
                const tmp = generateJSExpr(s)
                else_statements.push(tmp)
            })
            return `if(${expr}) {\n${statements.join("\n")}} else {\n${else_statements.join("\n")}}`
        } else {
            return `if(${expr}) {\n${statements.join("\n")}}`
        }
    }
    else if (node.type === "dowhile_loop") {
        const expr = generateJSExpr(node.expr)
        const statements = []
        node.statements.forEach(s => {
            const tmp = generateJSExpr(s)
            statements.push(tmp)
        })
        return `do {\n${statements.join("\n")}}\nwhile(${expr});\n`
    }
    else if (node.type === "while_loop") {
        const expr = generateJSExpr(node.expr)
        const statements = []
        node.statements.forEach(s => {
            const tmp = generateJSExpr(s)
            statements.push(tmp)
        })
        return `while(${expr}){\n${statements.join("\n")}\n}`
    }
    else if (node.type === "for_loop") {
        const symbol = node.assignment.symbol.value;
        const assignment = generateJSExpr(node.assignment)
        const statements = []
        node.statements.forEach(s => {
            const tmp = generateJSExpr(s)
            statements.push(tmp)
        })
        if (node.to) {
            const to = generateJSExpr(node.to)
            return `for(${assignment} ${symbol}<=${to}; ${symbol}++){${statements.join("\n")}}`
        } else if (node.downto) {
            const downto = generateJSExpr(node.downto)
            return `for(${assignment} ${symbol}>=${downto}; ${symbol}--){${statements.join("\n")}}`
        }
    }
    else if (node.type === "operation") {
        return `${node.left.value}${node.operator.value}${node.right.value}`
    }
    else if (node.type === "assignment") {
        const symbolName = node.symbol.value
        if (node.value.type === "fn_call") {
            const value = generateJSExpr(node.value.arg[0])
            const fnName = node.value.fnName.value
            return `var ${symbolName} = ${fnName}(${value});`
        } 
        else if (node.value.type === "operation") {
            const value = generateJSExpr(node.value)
            return `var ${symbolName} = ${value};`
        } 
        else {
            const value = node.value.value
            return `var ${symbolName} = ${value};`
        }
    } 
    else if (node.type === "fn_call") {
        const fnName = node.fnName.value
        const arg = generateJSExpr(node.arg[0])
        return `${fnName}(${arg});`
    } 
    else if (node.type === "fn_call_no_args") {
        const fnName = node.fnName.value        
        return `${fnName}();`
    } 
    else if (node.type === "program") {
        const res = []
        node.statements.forEach(s => {
            const jsExpr = generateJSExpr(s)
            res.push(jsExpr) 
        })
        return res.join("\n")
    } else if (node.type === "number") {
        return node.value
    } else if (node.type === "string") {
        return node.value
    } else if (node.type === "bool") {
        return node.value
    } else if (node.type === "symbol") {
        return node.value
    }
}


///
/// Generates JS Code from Abstract Syntax Tree
///
const generateJS = (ast) => {
    const res = []
    if (ast.type === "program") {
        ast.statements.forEach(s => {
            const jsExpr = generateJSExpr(s)
            res.push(jsExpr)
        })
    } 
    return res.join("\n")
}


///
/// Executes after calling "node generate.js <name_of_ast_file>"
///
const main = async () => {
    const inFilename = process.argv[2]

    if (!inFilename) {
        console.error("Please, set name of your .ast file as an second argument.")
        return
    }

    const astString = (await fs.readFile(inFilename)).toString()
    const runtime = (await fs.readFile("runtime.js")).toString()
    const ast = JSON.parse(astString)
    const jsCode = runtime + "\n" + generateJS(ast)
    const outFilename = inFilename.replace(".ast", ".js")
    
    console.log(`Generating ${outFilename}...`)
    await fs.writeFile(outFilename, jsCode)
}

main().catch(e => console.error(e))