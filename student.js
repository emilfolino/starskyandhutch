const { readdir, mkdir, readFile } = require('fs');

const inPath = "./infiles";
const outPath = "./outfiles";

const header = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Starsky And Hutch</title>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css">
    <link rel="stylesheet" href="/style.css">
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
    const courseDir = outPath + "/" + course + "_" + now;
    mkdir(courseDir, function(err) {
        if (err) {
            console.error(err);
        }

        const inCourse = inPath + "/" + course;

        readdir(inCourse, function (err, files) {
            if (err) {
                console.error(err);
            }

            const kmoms = files.filter(file => file !== "result");

            kmoms.forEach((kmom, i) => {
                parseKMOM(kmom, inCourse, courseDir);
            });
        });
    });
}

function parseKMOM(kmom, inCourse, courseDir) {
    const kmomDir = inCourse + "/" + kmom;
    const outKmomDir = courseDir + "/" + kmom;

    mkdir(outKmomDir, function(err) {
        if (err) {
            console.error(err);
        }

        readdir(kmomDir, function (err, assignments) {
            if (err) {
                console.error(err);
            }

            assignments.forEach((assignment, i) => {
                const resultFile = [
                    inCourse,
                    kmom,
                    assignment,
                    "result",
                    "computer_matches.csv"
                ].join("/");

                parseAssignment(
                    assignment,
                    kmomDir,
                    outKmomDir,
                    resultFile
                );
            });
        });
    });
}

function parseAssignment(assignment, kmomDir, outKmomDir, resultFile) {
    mkdir(outKmomDir + "/" + assignment, function(err) {
        if (err) {
            console.error(err);
            return;
        }

        readFile(resultFile, 'utf8' , (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            const lines = data.split("\n");

            lines.filter(line => line).forEach((line, i) => {
                const fields = line.split(";");

                console.log(fields);
            });
        });
    });
}

parseFiles();
