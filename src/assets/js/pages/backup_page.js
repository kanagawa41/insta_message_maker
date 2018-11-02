/**
 * バックアップ画面
 */
var modules = modules || {};
modules.pages = modules.pages || {};

modules.pages.backup = (function () {
  var page = {}

  var storage = null;

  const keys = modules.storage_helper.keys;

  page.init = function(){
    try{
      storage = $.localStorage;
      // modules.storage_helper.validVersion(storage);
    }catch(e){
      console.log(e);
      toastr.error('ローカルストレージが使用できないため、機能が正しく動きません。');
      return;
    }

    page.initLayout();

    page.initAction();

    page.loadSetting();
  }

  /**
   * レイアウトの初期処理
   */
  page.initLayout = function(){
  };

  /**
   * イベントの初期処理
   */
  page.initAction = function(){
    $('#storage').on('focus', function(){
      $(this).select();
    });

    $('#copy-btn').on('click', function(){
      if(modules.helper.execCopy($('#storage').val())){
        toastr.success('コピーしました。')
      }else{
        toastr.error('コピーできませんでした。')
      }
    });

    $('#save-btn').on('click', function(){
      try{
        var str = $('#storage').val();
        JSON.parse(str);
      }catch(e){
        toastr.error('ストレージ状態の書式が正しくありません。');
        return;
      }

      page.saveSettings();

      toastr.success('ストレージ状態を保存しました。');
    });

    $('#clear-btn').on('click', function(){
      // 設定の保持
      modules.storage_helper.initData(storage);

      $('#storage').val(JSON.stringify(storage.get(modules.storage_helper.namespace)));

      toastr.success('ストレージ状態を初期化しました。a');
    });

  };

  /**
   * ストレージの状態を画面に反映
   */
  page.loadSetting = function(){
    $('#storage').val(JSON.stringify(storage.get(modules.storage_helper.namespace)));
  }

  /**
   * 設定をストレージに保存する
   */
  page.saveSettings = function(){
    // 設定の保持
    storage.set(modules.storage_helper.namespace, $('#storage').val());
  }

  return page;
}());