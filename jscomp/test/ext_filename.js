'use strict';

var Caml_builtin_exceptions = require("../../lib/js/caml_builtin_exceptions");
var Bytes                   = require("../../lib/js/bytes");
var Filename                = require("../../lib/js/filename");
var CamlinternalLazy        = require("../../lib/js/camlinternalLazy");
var Caml_sys                = require("../../lib/js/caml_sys");
var Pervasives              = require("../../lib/js/pervasives");
var Block                   = require("../../lib/js/block");
var Ext_string              = require("./ext_string");
var Curry                   = require("../../lib/js/curry");
var Ext_pervasives          = require("./ext_pervasives");
var $$String                = require("../../lib/js/string");
var Format                  = require("../../lib/js/format");
var List                    = require("../../lib/js/list");
var Literals                = require("./literals");
var Caml_string             = require("../../lib/js/caml_string");

var node_sep = "/";

var node_parent = "..";

var node_current = ".";

var cwd = Block.__(246, [function () {
      return Caml_sys.caml_sys_getcwd(/* () */0);
    }]);

function path_as_directory(x) {
  if (x === "" || Ext_string.ends_with(x, Filename.dir_sep)) {
    return x;
  }
  else {
    return x + Filename.dir_sep;
  }
}

function absolute_path(s) {
  var s$1 = s;
  var s$2;
  if (Curry._1(Filename.is_relative, s$1)) {
    var tag = cwd.tag | 0;
    s$2 = Filename.concat(tag === 250 ? cwd[0] : (
            tag === 246 ? CamlinternalLazy.force_lazy_block(cwd) : cwd
          ), s$1);
  }
  else {
    s$2 = s$1;
  }
  var aux = function (_s) {
    while(true) {
      var s = _s;
      var match_000 = Curry._1(Filename.basename, s);
      var match_001 = Curry._1(Filename.dirname, s);
      var dir = match_001;
      var base = match_000;
      if (dir === s) {
        return dir;
      }
      else if (base === Filename.current_dir_name) {
        _s = dir;
        continue ;
        
      }
      else if (base === Filename.parent_dir_name) {
        return Curry._1(Filename.dirname, aux(dir));
      }
      else {
        return Filename.concat(aux(dir), base);
      }
    };
  };
  return aux(s$2);
}

function chop_extension($staropt$star, name) {
  var loc = $staropt$star ? $staropt$star[0] : "";
  try {
    return Filename.chop_extension(name);
  }
  catch (exn){
    if (exn[0] === Caml_builtin_exceptions.invalid_argument) {
      return Curry._2(Format.ksprintf(Pervasives.invalid_arg, /* Format */[
                      /* String_literal */Block.__(11, [
                          "Filename.chop_extension ( ",
                          /* String */Block.__(2, [
                              /* No_padding */0,
                              /* String_literal */Block.__(11, [
                                  " : ",
                                  /* String */Block.__(2, [
                                      /* No_padding */0,
                                      /* String_literal */Block.__(11, [
                                          " )",
                                          /* End_of_format */0
                                        ])
                                    ])
                                ])
                            ])
                        ]),
                      "Filename.chop_extension ( %s : %s )"
                    ]), loc, name);
    }
    else {
      throw exn;
    }
  }
}

function chop_extension_if_any(fname) {
  try {
    return Filename.chop_extension(fname);
  }
  catch (exn){
    if (exn[0] === Caml_builtin_exceptions.invalid_argument) {
      return fname;
    }
    else {
      throw exn;
    }
  }
}

var os_path_separator_char = Filename.dir_sep.charCodeAt(0);

function relative_path(file_or_dir_1, file_or_dir_2) {
  var relevant_dir1 = file_or_dir_1[0] >= 781515420 ? Curry._1(Filename.dirname, file_or_dir_1[1]) : file_or_dir_1[1];
  var relevant_dir2 = file_or_dir_2[0] >= 781515420 ? Curry._1(Filename.dirname, file_or_dir_2[1]) : file_or_dir_2[1];
  var dir1 = Ext_string.split(/* None */0, relevant_dir1, os_path_separator_char);
  var dir2 = Ext_string.split(/* None */0, relevant_dir2, os_path_separator_char);
  var go = function (_dir1, _dir2) {
    while(true) {
      var dir2 = _dir2;
      var dir1 = _dir1;
      var exit = 0;
      if (dir1) {
        if (dir2) {
          if (dir1[0] === dir2[0]) {
            _dir2 = dir2[1];
            _dir1 = dir1[1];
            continue ;
            
          }
          else {
            exit = 1;
          }
        }
        else {
          exit = 1;
        }
      }
      else {
        exit = 1;
      }
      if (exit === 1) {
        return Pervasives.$at(List.map(function () {
                        return node_parent;
                      }, dir2), dir1);
      }
      
    };
  };
  var ys = go(dir1, dir2);
  if (ys) {
    if (ys[0] === node_parent) {
      return $$String.concat(node_sep, ys);
    }
    else {
      return $$String.concat(node_sep, /* :: */[
                  node_current,
                  ys
                ]);
    }
  }
  else {
    return $$String.concat(node_sep, /* :: */[
                node_current,
                ys
              ]);
  }
}

function node_relative_path(file1, dep_file) {
  var file2 = dep_file[1];
  var v = Ext_string.find(/* None */0, Literals.node_modules, file2);
  var len = file2.length;
  if (v >= 0) {
    var skip = function (_i) {
      while(true) {
        var i = _i;
        if (i >= len) {
          return Curry._1(Ext_pervasives.failwithf('File "ext_filename.ml", line 159, characters 38-45', /* Format */[
                          /* String_literal */Block.__(11, [
                              "invalid path: ",
                              /* String */Block.__(2, [
                                  /* No_padding */0,
                                  /* End_of_format */0
                                ])
                            ]),
                          "invalid path: %s"
                        ]), file2);
        }
        else {
          var curr_char = file2.charCodeAt(i);
          if (curr_char === os_path_separator_char || curr_char === /* "." */46) {
            _i = i + 1 | 0;
            continue ;
            
          }
          else {
            return i;
          }
        }
      };
    };
    return Ext_string.tail_from(file2, skip(v + Literals.node_modules_length | 0));
  }
  else {
    return relative_path(dep_file[0] >= 781515420 ? /* `File */[
                  781515420,
                  absolute_path(dep_file[1])
                ] : /* `Dir */[
                  3405101,
                  absolute_path(dep_file[1])
                ], file1[0] >= 781515420 ? /* `File */[
                  781515420,
                  absolute_path(file1[1])
                ] : /* `Dir */[
                  3405101,
                  absolute_path(file1[1])
                ]) + (node_sep + chop_extension_if_any(Curry._1(Filename.basename, file2)));
  }
}

function find_package_json_dir(cwd) {
  var _cwd = cwd;
  while(true) {
    var cwd$1 = _cwd;
    if (Caml_sys.caml_sys_file_exists(Filename.concat(cwd$1, Literals.package_json))) {
      return cwd$1;
    }
    else {
      var cwd$prime = Curry._1(Filename.dirname, cwd$1);
      if (cwd$prime.length < cwd$1.length) {
        _cwd = cwd$prime;
        continue ;
        
      }
      else {
        return Curry._1(Ext_pervasives.failwithf('File "ext_filename.ml", line 204, characters 15-22', /* Format */[
                        /* String_literal */Block.__(11, [
                            "package.json not found from ",
                            /* String */Block.__(2, [
                                /* No_padding */0,
                                /* End_of_format */0
                              ])
                          ]),
                        "package.json not found from %s"
                      ]), cwd$1);
      }
    }
  };
}

var package_dir = Block.__(246, [function () {
      var tag = cwd.tag | 0;
      return find_package_json_dir(tag === 250 ? cwd[0] : (
                    tag === 246 ? CamlinternalLazy.force_lazy_block(cwd) : cwd
                  ));
    }]);

function replace_backward_slash(x) {
  return $$String.map(function (x) {
              if (x !== 92) {
                return x;
              }
              else {
                return /* "/" */47;
              }
            }, x);
}

function no_slash(x, _i, len) {
  while(true) {
    var i = _i;
    if (i >= len) {
      return /* true */1;
    }
    else if (x.charCodeAt(i) !== /* "/" */47) {
      _i = i + 1 | 0;
      continue ;
      
    }
    else {
      return /* false */0;
    }
  };
}

function replace_slash_backward(x) {
  var len = x.length;
  if (no_slash(x, 0, len)) {
    return x;
  }
  else {
    return $$String.map(function (x) {
                if (x !== 47) {
                  return x;
                }
                else {
                  return /* "\\" */92;
                }
              }, x);
  }
}

function module_name_of_file(file) {
  var s = Filename.chop_extension(Curry._1(Filename.basename, file));
  return Caml_string.bytes_to_string(Bytes.capitalize(Caml_string.bytes_of_string(s)));
}

function module_name_of_file_if_any(file) {
  var s = chop_extension_if_any(Curry._1(Filename.basename, file));
  return Caml_string.bytes_to_string(Bytes.capitalize(Caml_string.bytes_of_string(s)));
}

function combine(p1, p2) {
  if (p1 === "" || p1 === Filename.current_dir_name) {
    return p2;
  }
  else if (p2 === "" || p2 === Filename.current_dir_name) {
    return p1;
  }
  else if (Curry._1(Filename.is_relative, p2)) {
    return Filename.concat(p1, p2);
  }
  else {
    return p2;
  }
}

function split_aux(p) {
  var _p = p;
  var _acc = /* [] */0;
  while(true) {
    var acc = _acc;
    var p$1 = _p;
    var dir = Curry._1(Filename.dirname, p$1);
    if (dir === p$1) {
      return /* tuple */[
              dir,
              acc
            ];
    }
    else {
      _acc = /* :: */[
        Curry._1(Filename.basename, p$1),
        acc
      ];
      _p = dir;
      continue ;
      
    }
  };
}

function rel_normalized_absolute_path(from, to_) {
  var match = split_aux(from);
  var match$1 = split_aux(to_);
  var root2 = match$1[0];
  if (match[0] !== root2) {
    return root2;
  }
  else {
    var _xss = match[1];
    var _yss = match$1[1];
    while(true) {
      var yss = _yss;
      var xss = _xss;
      if (xss) {
        var xs = xss[1];
        if (yss) {
          if (xss[0] === yss[0]) {
            _yss = yss[1];
            _xss = xs;
            continue ;
            
          }
          else {
            var start = List.fold_left(function (acc, _) {
                  return Filename.concat(acc, "..");
                }, "..", xs);
            return List.fold_left(Filename.concat, start, yss);
          }
        }
        else {
          return List.fold_left(function (acc, _) {
                      return Filename.concat(acc, "..");
                    }, "..", xs);
        }
      }
      else if (yss) {
        return List.fold_left(Filename.concat, yss[0], yss[1]);
      }
      else {
        return "";
      }
    };
  }
}

function normalize_absolute_path(x) {
  var drop_if_exist = function (xs) {
    if (xs) {
      return xs[1];
    }
    else {
      return /* [] */0;
    }
  };
  var normalize_list = function (_acc, _paths) {
    while(true) {
      var paths = _paths;
      var acc = _acc;
      if (paths) {
        var x = paths[0];
        switch (x) {
          case "." : 
              _paths = paths[1];
              continue ;
              case ".." : 
              _paths = paths[1];
              _acc = drop_if_exist(acc);
              continue ;
              default:
            _paths = paths[1];
            _acc = /* :: */[
              x,
              acc
            ];
            continue ;
            
        }
      }
      else {
        return acc;
      }
    };
  };
  var match = split_aux(x);
  var root = match[0];
  var rev_paths = normalize_list(/* [] */0, match[1]);
  if (rev_paths) {
    var _acc = rev_paths[0];
    var _rev_paths = rev_paths[1];
    while(true) {
      var rev_paths$1 = _rev_paths;
      var acc = _acc;
      if (rev_paths$1) {
        _rev_paths = rev_paths$1[1];
        _acc = Filename.concat(rev_paths$1[0], acc);
        continue ;
        
      }
      else {
        return Filename.concat(root, acc);
      }
    };
  }
  else {
    return root;
  }
}

function get_extension(x) {
  try {
    var pos = Bytes.rindex(Caml_string.bytes_of_string(x), /* "." */46);
    return Ext_string.tail_from(x, pos);
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      return "";
    }
    else {
      throw exn;
    }
  }
}

var $slash$slash = Filename.concat;

exports.node_sep                     = node_sep;
exports.node_parent                  = node_parent;
exports.node_current                 = node_current;
exports.cwd                          = cwd;
exports.$slash$slash                 = $slash$slash;
exports.path_as_directory            = path_as_directory;
exports.absolute_path                = absolute_path;
exports.chop_extension               = chop_extension;
exports.chop_extension_if_any        = chop_extension_if_any;
exports.os_path_separator_char       = os_path_separator_char;
exports.relative_path                = relative_path;
exports.node_relative_path           = node_relative_path;
exports.find_package_json_dir        = find_package_json_dir;
exports.package_dir                  = package_dir;
exports.replace_backward_slash       = replace_backward_slash;
exports.no_slash                     = no_slash;
exports.replace_slash_backward       = replace_slash_backward;
exports.module_name_of_file          = module_name_of_file;
exports.module_name_of_file_if_any   = module_name_of_file_if_any;
exports.combine                      = combine;
exports.split_aux                    = split_aux;
exports.rel_normalized_absolute_path = rel_normalized_absolute_path;
exports.normalize_absolute_path      = normalize_absolute_path;
exports.get_extension                = get_extension;
/* Filename Not a pure module */
