const { readdir, mkdir, readFile, writeFile, copyFile } = require('fs');

const inPath = "./infiles";
const outPath = "./outfiles";

const header = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Starsky And Hutch</title>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
<main class="content">
    <article>`;

const footer = `</article>
</main>
<footer class="footer">
    <div class="inner-footer">
        <p>&copy; <a href="https://dbwebb.se">dbwebb</a></p>
    </div>
</footer>
</body>
</html>`;

function parseFiles() {
    const now = new Date().toJSON().substring(0, 19);

    readdir(inPath, function (err, files) {
        if (err) {
            console.error(err);
        }

        files.forEach((course, i) => {
            parseCourse(course, now);
        });
    });
}

function parseCourse(course, now) {
    const resultDir = inPath + "/" + course + "/result";
    const submissionsDir = inPath + "/" + course + "/submissions";

    const outCourseDir = outPath + "/" + course + "_" + now;

    mkdir(outCourseDir, function(err) {
        if (err) {
            console.error(err);
        }

        readdir(resultDir, function (err, kmoms) {
            if (err) {
                console.error(err);
            }

            kmoms.forEach((kmom, i) => {
                parseKMOM(kmom, resultDir, submissionsDir, outCourseDir);
            });
        });
    });
}

function parseKMOM(
    kmom,
    resultDir,
    submissionsDir,
    outCourseDir
) {
    const resultFile = resultDir + "/" + kmom + "/computer_matches.csv";

    readFile(resultFile, 'utf8' , (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const lines = data.split("\n").filter(line => line);

        createIndex(outCourseDir, kmom, lines, submissionsDir);
    });
}

function createIndex(outCourseDir, kmom, students, submissionsDir) {
    const outDir = outCourseDir + "/" + kmom;

    mkdir(outDir, function(err) {
        if (err) {
            console.error(err);
            return;
        }

        copyFile("./public/style.css", outCourseDir + "/style.css", (err) => {
            if (err) {
                throw err;
            }
        });

        let htmlContent = header;

        htmlContent += `<h1>Studenter: ${outDir}</h1>`;
        htmlContent += `<table>
                            <thead>
                                <tr>
                                    <th>Student 1</th>
                                    <th>Student 2</th>
                                    <th>Procent likhet</th>
                                    <th>Procent likhet</th>
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
                            </tr>`;
        });

        htmlContent += `    </tbody>
                        </table>`;

        htmlContent += footer;

        writeFile(outDir + "/index.html", htmlContent, err => {
            if (err) {
                console.error(err)
                return
            }


        });
    });
}

function createComparison(outCourseDir, kmom, student, submissionsDir) {
    const filesDir = submissionsDir + "/" + kmom;

    const fields = student.split(";");

    let htmlContent = header;

    htmlContent += `<h1>${fields[0]} vs. ${fields[1]}</h1>`;
    htmlContent += `<p>${fields[2]} vs. ${fields[3]}</p>`;

    const codeRelatedFields = fields.slice(4);

    for (let i = 0; i < codeRelatedFields.length; i += 6) {

    }

    // htmlContent += "<div class='code-container'>";
    //     htmlContent += "<div class='left-code'>";
    //     htmlContent += leftCode;
    //     htmlContent += "</div>";
    //     htmlContent += "<div class='right-code'>";
    //     htmlContent += rightCode;
    //     htmlContent += "</div>";
    // htmlContent += "</div>";

    // readFile(resultFile, 'utf8' , (err, data) => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     }
    //
    //     const lines = data.split("\n").filter(line => line);
    //
    //     createIndex(outCourseDir, kmom, lines, submissionsDir);
    // });

    htmlContent += footer;
}

parseFiles();
