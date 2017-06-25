/*
 * @Author: kasora 
 * @Date: 2017-06-25 22:24:05 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-06-25 22:57:15
 */
'use strict';

let id = 0;

let getid = () => {
  return id;
};

let setid = (_id) => {
  id = _id;
}

module.exports = {
  getid,
  setid
};
