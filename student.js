const fs = require('fs');

const student = {
    all: function all(req, res) {
        const path = "./data/result/computer_matches.csv";

        fs.readFile(path, 'utf8', function (err, fileData) {
            if (err) {
                return console.log(err);
            }

            let lines = fileData.split("\n");

            let students = lines.filter(student => student).map(function(line) {
                if (line) {
                    let fields = line.split(";");

                    return fields.slice(0, 4);
                }
            });

            const data = {
                students: students
            };

            console.log(data);

            return res.render("all", data);
        });


    },
    compare: function compare(req, res) {
        const data = {

        };

        return res.render("compare", data);
    }
};

module.exports = student;
