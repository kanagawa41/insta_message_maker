/**
 * 初期画面
 */
var modules = modules || {};
modules.pages = modules.pages || {};

modules.pages.index = (function () {
  var page = {}

  var storage = null;
  try{
    storage = $.localStorage;
  }catch(e){
    console.log(e);
    toastr.error('ローカルストレージが使用できないため、機能が正しく動きません。');
  }

  const keys = modules.storage_helper.keys;

  page.init = function(){
    page.initLayout();

    page.initAction();

    page.loadSetting();
  }

  /**
   * レイアウトの初期処理
   */
  page.initLayout = function(){
    // var text = $('#header h1 a').text();
    // $('#header h1 a').html(modules.helper.decorateEachChar(text, ['405DE6','5851D8','833AB4','c13584','E1306C','FD1D1D','F56040','F77737','FCAF45','FFDC80']));
  };

  /**
   * アクションの初期処理
   */
  page.initAction = function(){
    $('#make-btn').on('click', function(){
      var messages = [];

      var templateMessage = $('#template-msg').val();
      messages.push(page.replacer(templateMessage));

      $('textarea[name="make-msg"]').val(messages.join("\n"));

      page.saveSettings();
      page.updateTags();
    });

    $('#option-open-btn').on('click', function(){
      $('#option-area').css('display', 'block');

      $('#option-open-btn').css('display', 'none');
      $('#option-close-btn').css('display', 'block');
    });
    $('#option-close-btn').on('click', function(){
      $('#option-area').css('display', 'none');

      $('#option-open-btn').css('display', 'block');
      $('#option-close-btn').css('display', 'none');
    });

    $('#blank-chk').on('click', function(){
      $('#new-line').val('ㅤ'); // 透明な特殊記号
      $('#char-length').text($('#new-line').val().length);

      $('#new-line').prop("disabled", $(this).prop("checked"));
    });

    $('#new-line').on('input', function(){
      $('#char-length').text($(this).val().length);
    });

    $('#tag-list').on('change', function() {
      var selected = $(this).val();
      var tags = $('#tag-' + selected).val();
      $('#tags').val(tags);
    });

    $('#make-msg').on('focus', function(){
      this.select();
      // FIXME: クリップボードに改行を含んでコピーできない。
      // if(modules.helper.execCopy($(this).val())){
      //   toastr.success('コピーしました。')
      // }else{
      //   toastr.error('コピーできませんでした。')
      // }
    });
  };

  /**
   * ストレージの状態を画面に反映
   */
  page.loadSetting = function(){
    if(!storage.isSet(keys.tag_list)){
      modules.storage_helper.setDefaultTags(storage);
      toastr.info('タグリストに初期値を設定しました。');
    }
    const tagList = JSON.parse(storage.get(keys.tag_list));
    page.createSelectBox({
        one: tagList['tag1_name'],
        two: tagList['tag2_name'],
        three: tagList['tag3_name'],
        four: tagList['tag4_name'],
      },
      'tag-list',
      'one');

    $('#tag-one').val(tagList['tags1']);
    $('#tag-two').val(tagList['tags2']);
    $('#tag-three').val(tagList['tags3']);
    $('#tag-four').val(tagList['tags4']);

    if(!storage.isSet(keys.settings)){
      modules.storage_helper.setDefaultSettings(storage);
      toastr.info('基本値に初期値を設定しました。');
    }

    const settings = JSON.parse(storage.get(keys.settings));

    $('#template-msg').val(settings['template']);

    $('#new-line').val(settings['new_line']);
    $('#char-length').text($('#new-line').val().length);

    $('#tag-list').val(settings['tag_list']);
    $('#select-tag-num').val(settings['select_tag_num']);
    $('#tag-per-line').prop("checked", settings['tag_per_line']);
    $('#blank-chk').prop("checked", settings['blank_chk']);

    var tags = $('#tag-' + settings['tag_list']).val();
    $('#tags').val(tags);

    $('#emoji').val(settings['emoji']);
  }

  /**
   * デフォルト値を設定
   */
  page.createSelectBox = function(characters, targetId, targetVal){
    var $select = $('#' + targetId),
        $option,
        isSelected;

    $.each(characters, function (value, name) {
        isSelected = (value === targetVal);
        $option = $('<option>')
            .val(value)
            .text(name)
            .prop('selected', isSelected);
        $select.append($option);
    });
  }

  /**
   * 設定をストレージに保存する
   */
  page.saveSettings = function(){
    var settings = {
      template: $('#template-msg').val(),
      new_line: $('#new-line').val(),
      tag_list: $('#tag-list').val(),
      select_tag_num: $('#select-tag-num').val(),
      tag_per_line: $('#tag-per-line').prop('checked'),
      blank_chk: $('#blank-chk').prop('checked'),
      emoji: modules.helper.excludeBlank($('#emoji').val()),
    }

    // 設定の保持
    storage.set(keys.settings, JSON.stringify(settings));
  }

  /**
   * タグをストレージに保存する
   */
  page.updateTags = function(){
    const tagList = JSON.parse(storage.get(keys.tag_list));

    var strTags = modules.helper.formatTag($('#tags').val());

    switch ($('#tag-list').val()) {
      case "one":
        tagList['tags1'] = strTags;
        break;
      case "two":
        tagList['tags2'] = strTags;
        break;
      case "three":
        tagList['tags3'] = strTags;
        break;
      case "four":
        tagList['tags4'] = strTags;
        break;
      default:
        console.log('Jesus!!');
    }

    // 設定の保持
    storage.set(keys.tag_list, JSON.stringify(tagList));
  }

  /**
   * 記号の置換を行う
   */
  page.replacer = function(str){
    str = modules.replace_helper.replaceMessage(str, $('#msg').val());

    if(modules.replace_helper.hasTags(str)){
      str = page.replaceTags(str);
    }

    var emoji = modules.helper.excludeBlank($('#emoji').val());
    if(emoji.length > 0){
      str = modules.replace_helper.replaceDot(str, emoji);
    }

    str = modules.replace_helper.replaceNewLine(str, $('#new-line').val());

    return str;
  }

  /**
   * タグコードをタグに変換
   */
  page.replaceTags = function(str){
    var rawTagsStr = $('#tags').val();
    rawTagsStr = modules.helper.formatTag(rawTagsStr);
    var tags = null;
    if(!storage.isSet(keys.tag_list)){
      const tagList = JSON.parse(storage.get(keys.tag_list));
      var selectTag = $('#tag-list').val();
      if(selectTag == 'one'){
        tags = tagList['tags1'];
      }else if(selectTag == 'two'){
        tags = tagList['tags2'];
      }else if(selectTag == 'three'){
        tags = tagList['tags3'];
      }else if(selectTag == 'four'){
        tags = tagList['tags4'];
      }
    }
    tags = rawTagsStr.substring(1, rawTagsStr.length).split('#');

    // タグからランダムに取得する
    if($('#select-tag-num').val() != ""){
      function randomAry(array, num) {
        var a = array;
        var t = [];
        var r = [];
        var l = a.length;
        var n = num < l ? num : l;
        while (n-- > 0) {
          var i = Math.random() * l | 0;
          r[n] = t[i] || a[i];
          --l;
          t[i] = t[l] || a[l];
        }
        return r;
      }

      var selectTagNum = $('#select-tag-num').val();
      // 指定されたタグ数が多すぎ
      if(selectTagNum > tags.length){
        selectTagNum = tags.length;
      }
      // 指定されたタグ数がマイナス
      if(tags.length < 0){
        selectTagNum = tags.length;
      }

      tags = randomAry(tags, selectTagNum);
    }

    var tagsStr = null;
    // タグを一行毎に出力する
    if($('#tag-per-line').prop('checked')){
      tagsStr = '#' + tags.join('\n#');
    }else{
      tagsStr = '#' + tags.join(' #'); // #tag #tag...
    }

    return modules.replace_helper.replaceTag(str, tagsStr);
  }

  return page;
}());