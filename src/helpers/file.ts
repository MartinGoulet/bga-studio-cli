import fs from "fs";
import path from "path";

export function searchFile(dir: string, fileName: string) {
    // read the contents of the directory
    const files = fs.readdirSync(dir);

    const paths: string[] = [];
    // search through the files
    for (const file of files) {
        // build the full path of the file
        const filePath = path.join(dir, file);

        // get the file stats
        const fileStat = fs.statSync(filePath);

        // if the file is a directory, recursively search the directory
        if (fileStat.isDirectory()) {
            searchFile(filePath, fileName);
        } else if (file.endsWith(fileName)) {
            // if the file is a match, print it
            // console.log(filePath);
            paths.push(filePath);
        }
    }

    return paths;
}

export function replaceFile(filename: string, replace: (content: string) => string) {
    const content = fs.readFileSync(filename, "utf8")!;
    const newContent = replace(content);
    fs.writeFileSync(filename, newContent, {
        encoding: "utf8",
    });
}