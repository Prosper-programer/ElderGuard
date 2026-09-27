const fs = require('fs');
let lines = fs.readFileSync('app/(parent)/health/index.tsx', 'utf8').split('\n');
// We need to keep the newly added styles (at the top of the stylesheet) and remove the old ones further down.
// The easiest way is to parse the file, find the second occurrence of 'screenTitle:', 'backBtn:', etc. and delete them.
let seen = new Set();
let inStyles = false;
let outLines = [];
let skipDepth = 0;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('const styles = StyleSheet.create({')) {
        inStyles = true;
        outLines.push(line);
        continue;
    }
    if (inStyles) {
        // match key: {
        let match = line.match(/^  ([a-zA-Z0-9_]+): \{/);
        if (match) {
            let key = match[1];
            if (seen.has(key)) {
                skipDepth = 1; // start skipping this block
                continue;
            } else {
                seen.add(key);
            }
        }
        if (skipDepth > 0) {
            if (line.includes('{')) skipDepth++;
            if (line.includes('}')) skipDepth--;
            if (skipDepth === 0 && line.trim() === '},') {
                // Done skipping block
            }
            continue; 
        }
    }
    outLines.push(line);
}
fs.writeFileSync('app/(parent)/health/index.tsx', outLines.join('\n'), 'utf8');
