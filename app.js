var fs = require('fs'),
    express = require('express'),
    app = express(),
    path = require('path'),
    formidable = require('formidable');

console.log(__dirname + '/public');
app.use(express.static(__dirname + '/public'));

var server = app.route('/api/fileupload')
    .post(function (req, res) {
        console.log('just got file');

        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            // `file` is the name of the <input> field of type `file`
            var old_path = files.file.path,
                file_size = files.file.size,
                file_ext = files.file.name.split('.').pop(),
                index = old_path.lastIndexOf('/') + 1,
                file_name = old_path.substr(index),
                new_path = __dirname + '/public/upload/' + file_name + '.' + file_ext;


            console.log('Old PAth', old_path);
            console.log('File Size', file_size);
            console.log('File Extention', file_ext);
            console.log('File Index', index);
            console.log('FileName', file_name);

            fs.readFile(old_path, function (err, data) {
                fs.writeFile(new_path, data, function (err) {
                    fs.unlink(old_path, function (err) {
                        if (err) {
                            res.status(500);
                            res.json({'success': false});
                        } else {
                            res.status(200);
                            res.json({'success': true});
                        }
                    });
                });
            });
        });


    });
app.listen(2000, function (err) {
    console.log('Server Listening on localhost:2000');
});