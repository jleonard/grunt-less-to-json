/*
 * grunt-less-to-json
 * https://github.com/jleonard/grunt-less-to-json
 *
 * Copyright (c) 2013 jleonard
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('less_to_json', 'The best Grunt plugin ever.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(fileObj){
      var files = grunt.file.expand({nonull: true}, fileObj.src);
      var dest = options.dest;
      var src = files.map(function(filepath){
        if (!grunt.file.exists(filepath)) {
          
        }else{
          var file = grunt.file.read(filepath);
          file = removeComments(file);
          file = file.replace(/ /g,"").replace(/\t/g,"").replace(/\n/g,"");
          var arr = file.split(";");
          console.log('your array is ',arr);
          var len = arr.length;
          var obj = {};
          for (var i = 0; i < len -1; i++) {
            var key_val = arr[i].split(":");
            if(key_val.length === 1){ continue; }
            obj[key_val[0]] = key_val[0]; 
          }

          for (var key in obj) {
             if (obj.hasOwnProperty(key)) {
                var value = obj[key];
                if(value.indexOf('@') === 1){
                  console.log('value ',value);
                  obj[key] = obj[value];
                }
             }
          }
          console.log('your object is ',obj);
          //grunt.file.write(dest,html);
        }
      });

    });

    function removeComments(str) {
 
        var uid = '_' + +new Date(),
            primatives = [],
            primIndex = 0;
     
        return (
            str
            /* Remove strings */
            .replace(/(['"])(\\\1|.)+?\1/g, function(match){
                primatives[primIndex] = match;
                return (uid + '') + primIndex++;
            })
     
            /* Remove Regexes */
            .replace(/([^\/])(\/(?!\*|\/)(\\\/|.)+?\/[gim]{0,3})/g, function(match, $1, $2){
                primatives[primIndex] = $2;
                return $1 + (uid + '') + primIndex++;
            })
     
            /*
            - Remove single-line comments that contain would-be multi-line delimiters
                E.g. // Comment /* <--
            - Remove multi-line comments that contain would be single-line delimiters
                E.g. /* // <-- 
           */
            .replace(/\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//g, '')
     
            /*
            Remove single and multi-line comments,
            no consideration of inner-contents
           */
            .replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g, '')
     
            /*
            Remove multi-line comments that have a replaced ending (string/regex)
            Greedy, so no inner strings/regexes will stop it.
           */
            .replace(RegExp('\\/\\*[\\s\\S]+' + uid + '\\d+', 'g'), '')
     
            /* Bring back strings & regexes */
            .replace(RegExp(uid + '(\\d+)', 'g'), function(match, n){
                return primatives[n];
            })
        );
     
    }
  });
}
