/**
 * 画面の操作ヘルパー
 */
var modules = modules || {};

modules.storage_helper = (function () {
  var module = {}

  module.versions = {
    v1_0_0: {name: "v1.0.0"},
    v1_1_0: {name: "v1.1.0"},
  };

  module.namespace = "icm";

  module.keys = {
    settings: module.namespace + ".settings",
    type_list: module.namespace + ".type_list",
    version: module.namespace + ".version",
  };

  module.version = module.versions.v1_1_0.name;

  /**
   * ローカルストレージを安全に取り出す
   */
  module.getStorage = function(){
    try{
      const storage = $.localStorage;

      for (key in module.keys) {
        if(!storage.isSet(module.keys[key])){
          storage.set(module.keys[key], null);
        }
      }

      return storage;
    }catch(e){
      console.log(e);
      return null;
    }
  }

  /**
   * ローカルストレージを安全に取り出す
   */
  module.initData = function(storage){
    for (key in module.keys) {
      storage.set(module.keys[key], null);
    }
  }

  /**
   * 基本値デフォルト値を設定
   */
  module.setDefaultSettings = function(storage){
    var data = {
      new_line: "・",
      type_list_num: 0,
      select_tag_num: "",
      tag_per_line: false,
      random_order: false,
      emoji: "",
      version: module.keys.version,
    }

    // 設定の保持
    storage.set(module.keys.settings, JSON.stringify(data));
  }

  /**
   * タグのデフォルト値を設定
   */
  module.setDefaultTypes = function(storage){
    /**
     * タグのデフォルト値を設定
     */
    var defaultVal = function(){
      return {
        name: "タグ",
        tags: "#sample #sample2 #sample3",
        template: "##CAP##\n\n##TAGS##",
      }
    }

    var data = [
      defaultVal(),
      defaultVal(),
      defaultVal(),
      defaultVal(),
    ];

    // 設定の保持
    storage.set(module.keys.type_list, JSON.stringify(data));
  }

  /**
   * タグのデフォルト値を設定
   */
  module.getItem = function(storage, defaultVal=null){
    var val = storage.getItem(keys.type_list);
    if(!val){ return defaultVal; }

    return JSON.parse(storage.getItem(keys.type_list));
  }

  return module;
}());