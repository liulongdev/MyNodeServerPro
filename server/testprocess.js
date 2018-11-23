/* 处理器架构 x64 ia32 */
console.log(process.arch);

/* 操作系统 */
console.log(process.platform);

/*
* rss: 常驻内存大小 ，
* heapTotal: 动态分配的可用内存
* heapUsed: 已经使用的堆大小
* */
console.log(process.memoryUsage());

console.log(process.argv);


let args = {
    '-h': displayHelp,
    '-r': readFile
};

function displayHelp() {
    console.log('Argument processor:', args);
}

function readFile(file) {
    console.log('Reading:', file);
    if (file && file.length)
        require('fs').createReadStream(file).pipe(process.stdout);
    else {
        console.error('A file must be provided with the -r option');
        // process.exit(1);
    }
}

if (process.argv.length > 0){
    // readFile('testprocess.js');
    process.argv.forEach(function (arg, index) {
        // console.log('arg : ', arg, ' ; index: ', index);
        if (args[arg] != null && typeof args[arg] === "function")
            args[arg].apply(this, process.argv.slice(index + 1));
    });
}

console.log(process.pid);

process.stdin.resume();     // 不让其立刻退出
process.on('SIGHUP', function () {
    console.log('Reloading configuration ....');
    process.exit(0);
});

let pid = process.pid;

setTimeout(function () {
    process.kill(pid, 'SIGHUP');
}, 3000);

console.log(process.pid);

const os = require('os');

const formatMB = function (bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
}

console.log(formatMB(os.totalmem()));

console.log(formatMB(os.freemem()));

