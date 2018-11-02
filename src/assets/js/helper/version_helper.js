/**
 * 画面の操作ヘルパー
 */
var modules = modules || {};

modules.version_helper = (function () {
  var module = {}

  /**
    v1_1_0
    {
       "mode_list":"[{\"name\":\"タグ1\",\"tags\":\"#2#1#sample#sample2#sample3\",\"template\":\"##CAP##1\\n\\n##TAGS##\"},{\"name\":\"タグ2\",\"tags\":\"#3#2#1#sample#sample2#sample3\",\"template\":\"##CAP##2\\n\\n##TAGS##\"},{\"name\":\"タグ3\",\"tags\":\"#2#1#sample#sample2#sample3\",\"template\":\"##CAP##3\\n\\n##TAGS##\"},{\"name\":\"タグ4\",\"tags\":\"#2#1#sample#sample2#sample3\",\"template\":\"##CAP##4\\nf\\n##TAGS##\"}]",
       "settings":"{\"new_line\":\"・\",\"mode_list_num\":\"0\",\"tag_per_line\":false,\"blank_chk\":false,\"emoji\":\"\"}"
    }

    v1_0_0
    {
       "tag_list":"{\"tag1_name\":\"タグ1\",\"tags1\":\"#sample #sample2 #sample3\",\"tag2_name\":\"タグ2\",\"tags2\":\"\",\"tag3_name\":\"タグ3\",\"tags3\":\"\",\"tag4_name\":\"タグ4\",\"tags4\":\"\"}",
       "settings":"{\"template\":\"##CAP##\\n\\n##TAGS##\",\"new_line\":\"・\",\"tag_list\":\"one\",\"select_tag_num\":\"\",\"tag_per_line\":false,\"random_order\":false,\"emoji\":\"\",\"version\":\"icm.version\"}"
    }
  **/
  module.v1_0_0_to_v1_1_0 = function(oldJsonStr){
    var oldStrage = JSON.parse(oldJsonStr);

    var tagList = oldStrage['tag_list'];
    var rawSettings = oldStrage['settings'];
    var modeList = [];

    modeList.push({
      template: rawSettings['template'],
      name: tagList['tag1_name'],
      tags: tagList['tags1'],
    });

    modeList.push({
      template: "",
      name: tagList['tag2_name'],
      tags: tagList['tags2'],
    });

    modeList.push({
      template: "",
      name: tagList['tag3_name'],
      tags: tagList['tags3'],
    });

    modeList.push({
      template: "",
      name: tagList['tag4_name'],
      tags: tagList['tags4'],
    });

    var settings = {
      version: module.version,
      new_line: rawSettings['new_line'],
      mode_list_num: "0", // 変換がめんどい...
      tag_per_line: rawSettings['tag_per_line'],
      random_order: rawSettings['random_order'],
      emoji: rawSettings['emoji'],
    }

    return {
      mode_list: modeList,
      settings: settings,
    }
  }

  return module;
}());