
function write(arg, n) {
  var retyped = new String(arg);
  if (n) {
    process.stdout.write(`${Array(n).join(' ')}${retyped}`);
  } else {
    process.stdout.write(retyped.toString());
  }
}

function writeln(...args) {
  if (args.length == 0) {
    process.stdout.write("\n");
  } else if (args.length == 1){
    process.stdout.write(`${args[0]}\n`);
  } else if (args.length == 2) {
    var n = args[1] - new String(args[0]).length
    process.stdout.write(`${Array(n).join(' ')}${args[0]}\n`);
  }
}

function read() {
  throw Error("Function read is not implemented.");
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

function chr(num) {
  return String.fromCharCode(num);
}

writeln()
writeln('    Prvocisla do 1000')
writeln()
write(2, 5)
var n = undefined;
var cislo = undefined;
do {
var prvocislo = true;
var delitel = undefined;
while(undefined){
if(cislo%delitel==0) {
var prvocislo = false;} else {
var delitel = undefined;}
}
if(prvocislo) {
if(n%10==0) {
writeln()}
write(cislo, 5)
var n = undefined;}
var cislo = undefined;}
while(!(undefined));

writeln()
writeln()