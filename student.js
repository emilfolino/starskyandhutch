const fsPromises = require('fs').promises;

const inPath = "./infiles";
const outPath = "./outfiles";

const headerIndex = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Starsky And Hutch</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>`;

const headerCompare = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Starsky And Hutch</title>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism-okaidia.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/plugins/line-highlight/prism-line-highlight.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="../style.css">
</head>
<body>`;

const footerIndex = `<footer class="footer">
    <div class="inner-footer">
        <p>&copy; <a href="https://dbwebb.se">dbwebb</a></p>
    </div>
</footer>
</body>
</html>`;

const footerCompare = `<footer class="footer">
    <div class="inner-footer">
        <p>&copy; <a href="https://dbwebb.se">dbwebb</a></p>
    </div>
</footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/components/prism-core.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/plugins/autoloader/prism-autoloader.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/plugins/line-highlight/prism-line-highlight.min.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.js" type="text/javascript"></script>
</body>
</html>`;

async function parseFiles() {
    const now = new Date().toJSON().substring(0, 19);
    const files = await fsPromises.readdir(inPath);

    files.forEach((course, i) => {
        parseCourse(course, now);
    });
}

async function parseCourse(course, now) {
    const resultDir = inPath + "/" + course + "/result";
    const submissionsDir = inPath + "/" + course + "/submissions";
    const outCourseDir = outPath + "/" + course + "_" + now;

    await fsPromises.mkdir(outCourseDir);

    const kmoms = await fsPromises.readdir(resultDir);

    kmoms.forEach((kmom, i) => {
        parseKMOM(kmom, resultDir, submissionsDir, outCourseDir);
    });
}

async function parseKMOM(
    kmom,
    resultDir,
    submissionsDir,
    outCourseDir
) {
    const resultFile = resultDir + "/" + kmom + "/computer_matches.csv";
    const data = await fsPromises.readFile(resultFile, 'utf8');
    const lines = data.split("\n").filter(line => line);

    createIndex(outCourseDir, kmom, lines, submissionsDir);
}

async function createIndex(outCourseDir, kmom, students, submissionsDir) {
    const outDir = outCourseDir + "/" + kmom;

    await fsPromises.mkdir(outDir);
    await fsPromises.copyFile("./public/style.css", outCourseDir + "/style.css");

    let htmlContent = headerIndex;

    htmlContent += `<main class="content">
        <article>`;
    htmlContent += `<h1>Studenter: ${outDir}</h1>`;
    htmlContent += `<table>
                        <thead>
                            <tr>
                                <th>Student 1</th>
                                <th>Student 2</th>
                                <th>Procent likhet</th>
                                <th>Procent likhet</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>`;

    students.forEach((student, i) => {
        createComparison(outCourseDir, kmom, student, submissionsDir);

        const data = student.split(";");

        htmlContent += `<tr>
                            <td>${data[0]}</td>
                            <td>${data[1]}</td>
                            <td>${data[2]}</td>
                            <td>${data[3]}</td>
                            <td><a href="${data[0]}_${data[1]}.html">See comparison</a></td>
                        </tr>`;
    });

    htmlContent += `    </tbody>
                    </table>`;
    htmlContent += `</article>
                </main>`;
    htmlContent += footerIndex;

    await fsPromises.writeFile(outDir + "/index.html", htmlContent);
    console.log("Created: " + outDir + "/index.html");
}

async function createComparison(
    outCourseDir,
    kmom,
    student,
    submissionsDir
) {
    const filesDir = submissionsDir + "/" + kmom;
    const fields = student.split(";").filter(field => field);
    const fileName = fields[0] + "_" + fields[1] + ".html";
    const entireFileName = outCourseDir + "/" + kmom + "/" + fileName;

    let htmlContent = headerCompare;

    htmlContent += `<div class='outer-container'>`;
    htmlContent += `<h1>${fields[0]} vs. ${fields[1]}</h1>`;
    htmlContent += `<p>Likhet: ${fields[2]} vs. ${fields[3]}</p>`;

    const codeRelatedFields = fields.slice(4);
    let leftFilesToLoad = [];
    let rightFilesToLoad = [];
    let studentFileName = "";

    for (let i = 0; i < codeRelatedFields.length; i += 6) {
        studentFileName = `${filesDir}/${fields[0]}/${codeRelatedFields[i]}`;

        if (!leftFilesToLoad.hasOwnProperty(studentFileName)) {
            leftFilesToLoad[studentFileName] = [];
        }

        leftFilesToLoad[studentFileName].push(`${codeRelatedFields[i + 1]}-${codeRelatedFields[i + 2]}`);



        studentFileName = `${filesDir}/${fields[1]}/${codeRelatedFields[i + 3]}`;

        if (!rightFilesToLoad.hasOwnProperty(studentFileName)) {
            rightFilesToLoad[studentFileName] = [];
        }

        rightFilesToLoad[studentFileName].push(`${codeRelatedFields[i + 4]}-${codeRelatedFields[i + 5]}`);
    }

    const leftCode = await getCode(fields[0], leftFilesToLoad);
    const rightCode = await getCode(fields[1], rightFilesToLoad);

    htmlContent += "<div class='code-container'>";
        htmlContent += "<div class='left-code'>";
        htmlContent += leftCode;
        htmlContent += "</div>";
        htmlContent += "<div class='right-code'>";
        htmlContent += rightCode;
        htmlContent += "</div>";
    htmlContent += "</div></div>";
    htmlContent += footerCompare;

    await fsPromises.writeFile(entireFileName, htmlContent);
    console.log("Created: " + entireFileName);
}

async function getCode(studentName, filesToLoad) {
    let code = `<h2>${studentName}</h2>`;
    const fileNames = Object.keys(filesToLoad);

    await Promise.all(fileNames.map(async (file) => {
        const fileEnding = file.split(".")[2];
        const fileContent = await fsPromises.readFile(file, 'utf8');
        const linesToHighlight = filesToLoad[file].join(", ");

        code += `<p>${file}</p>`;
        code += `<pre class="line-numbers language-${fileEnding}" data-line="${linesToHighlight}"><code class="language-${fileEnding}">${fileContent}</code></pre>`;
    }));

    return code;
}

parseFiles();
