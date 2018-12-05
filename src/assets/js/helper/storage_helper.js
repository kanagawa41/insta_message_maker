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
    mode_list: module.namespace + ".mode_list",
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
   * バージョンの検証
   */
  module.validVersion = function(storage){
    if(!storage.isSet(module.keys.settings)){ return; }

    var version = storage.get(module.keys.settings).version;
    if(!version || version == module.versions.v1_0_0) {
      var jsonStr = storage.get(modules.storage_helper.namespace);
      modules.version_helper.v1_0_0_to_v1_1_0(jsonStr);
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
      version: module.version,
      new_line: "・",
      mode_list_num: "0",
      tag_per_line: false,
      random_order: false,
      emoji: "",
      version: module.keys.version,
    }

    // 設定の保持
    storage.set(module.keys.settings, data);
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
        name: "モード",
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
    storage.set(module.keys.mode_list, data);
  }

  return module;
}());