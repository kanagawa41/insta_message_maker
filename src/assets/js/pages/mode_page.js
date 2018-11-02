/**
 * タグ画面
 */
var modules = modules || {};
modules.pages = modules.pages || {};

modules.pages.mode = (function () {
  var page = {}

  var storage = null;

  const strageKeys = modules.storage_helper.keys;

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
    if(!storage.isSet(strageKeys.mode_list)){
      modules.storage_helper.setDefaultTypes(storage);
      toastr.info('初期値を設定しました。');
    }

    // HACKME: layoutとloadsettingが一色単になりがち
    const modeList = storage.get(strageKeys.mode_list);
    modeList.forEach(function(val, i){
      var html = '';
      html += '<div id="mode-' + i + '" class="col-12" style="padding-bottom: 0.5em;">';
      html += '  <div class="row" style="padding-bottom: 0.5em;">';
      html += '    <div class="col-5">';
      html += '      <input name="name" placeholder="タグ名" type="text" value="' + val['name'] + '">';
      html += '    </div>';
      html += '  </div>';
      html += '  <h3 class="title">Template</h4>';
      html += '  <textarea name="template" placeholder="特殊記号などを含むテンプレートを記入してください。" rows="3">' + val['template'] + '</textarea>';
      html += '  <h3 class="title">Tag</h3 class="title">';
      html += '  <textarea name="tags" placeholder="シャープ(#)か空白区切りでタグを入力" rows="3">' + val['tags'] + '</textarea>';
      html += '  <hr>';
      html += '</div>';

      $('#modes').append(html);
    });

    // var text = $('#header h1 a').text();
    // $('#header h1 a').html(modules.helper.eachTopCharUpper(text, '<span style="color: #21b2a6">', '</span>'));
  };

  /**
   * イベントの初期処理
   */
  page.initAction = function(){
    $('#regist-btn').on('click', function(){
      const modeList = storage.get(strageKeys.mode_list);

      modeList.forEach(function(val, i){
        var mode = $('#mode-' + i);

        $(mode).find('[name="name"]').val(getVal($(mode).find('[name="name"]').val(), 'モード' + i));
        $(mode).find('[name="tags"]').val(modules.helper.formatTag($(mode).find('[name="tags"]').val()));
      });

      function getVal(val, defaultVal){
        if(!val || val.length == 0){ return defaultVal; }
        return val;
      }

      page.saveSettings();

      toastr.success('タグを保存しました。');
    });
  };

  /**
   * ストレージの状態を画面に反映
   */
  page.loadSetting = function(){}

  /**
   * 設定をストレージに保存する
   */
  page.saveSettings = function(){
    const modeList = storage.get(strageKeys.mode_list);

    modeList.forEach(function(val, i){
      var mode = $('#mode-' + i);
      val['name'] = $(mode).find('[name="name"]').val();
      val['template'] = $(mode).find('[name="template"]').val();
      val['tags'] = $(mode).find('[name="tags"]').val();
    });

    // 設定の保持
    storage.set(strageKeys.mode_list, modeList);
  }

  return page;
}());