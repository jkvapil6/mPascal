
function write(arg) {
    var retyped = new String(arg);
    process.stdout.write(retyped.toString());
}

function writeln() {
    process.stdout.write("\n");
}

function ord(str) {
    return str.charCodeAt(0);
}

function hex(num) {
    return num.toString(16);
}

function bin(num) {
    return num.toString(2);
}

var s = 0;
write(s);
writeln();
for(var i = 10; i>=0; i--){write(i);
write(i);}