var _ = require('lodash');
var Crawler = require('crawler');
var url = require('url');
var jf = require('jsonfile');

var ACGs = {
  animes: [], comics: [], novels: [],
  PCs: [], GBAs: [], '3DSs': [], PS4s: [],
  PS3s: [], wiius: [], xbones: [], xbox360s: [],
  PSVs: [], PSPs: [],
  OLGs: [], WEBs: [], Facebooks: [],
  androids: [], iOSs: []
};

function getACGNames($) {
  var nameTW = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > h1');
  nameTW = nameTW ? nameTW.text() : '';
  var nameJP = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > h2');
  nameJP = nameJP ? nameJP.first().text() : '';
  var nameEN = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > h2');
  nameEN = nameEN ? nameEN.last().text() : '';
  var names = {
    nameTW: nameTW,
    nameJP: nameJP,
    nameEN: nameEN
  };
  return names;
}

function getDescription($) {
  $('script').remove();
  $('#BH-master > div.BH-lbox.ACG-mster_box6 > .wikiContent table').remove();
  var desc = $('#BH-master > div.BH-lbox.ACG-mster_box6 > .wikiContent').text() || '';
  return desc;
}

function getAnime(error, result, $) {
  if (error) {
    console.log(error);
    return;
  }
  var id = parseInt(this.uri.replace(/http:\/\/acg\.gamer\.com\.tw\/acgDetail\.php\?s=/, ''));
  if (isNaN(id)) {
    // TODO throw error no id page!.
    return;
  }
  var desc = getDescription($);
  var anime = {
    id: id,                     // int
    acgType: 'anime',           // string
    type: '',                   // string
    platform: '',               // string
    nameTW: '',                 // string
    nameJP: '',                 // string
    nameEN: '',                 // string
    author: '',                 // string
    director: '',               // string
    numEpisodes: 0,             // int
    broadcastType: '',          // string
    firstBroadcastLocal: null,  // date
    sellDateLocal: null,        // date
    firstBroadcastTaiwan: null, // date
    sellDateTaiwan: null,       // date
    ceroRating: '',             // string
    company: '',                // string
    officalSite: '',            // string
    targetGroup: '',            // string
    taiwanAgent: '',            // string
    description: desc           // string
  };
  var names = getACGNames($);
  anime.nameTW = names.nameTW;
  anime.nameJP = names.nameJP;
  anime.nameEN = names.nameEN;
  var attrLines = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > ul').text().replace(/^\s*[\r\n]/gm, '').split('\n');
  var regex = /(.+)：(.*)/;
  for(var i = 0; i<attrLines.length; i++) {
    regex.exec(attrLines[i]);
    var attr = RegExp.$1;
    var attrValue = RegExp.$2;
    switch(attr) {
    case '作品平台':
      anime.platform = attrValue;
      break;
    case '播映方式':
      anime.broadcastType = attrValue;
      break;
    case '當地首播':
      anime.firstBroadcastLocal = attrValue == '不明' ? null: new Date(attrValue);
      break;
    case '當地發售':
      anime.sellDateLocal = attrValue == '不明' ? null: new Date(attrValue);
      break;
    case '台灣首播':
      anime.firstBroadcastTaiwan = attrValue == '不明' ? null: new Date(attrValue);
      break;
    case '台灣發售':
      anime.sellDateTaiwan = attrValue == '不明' ? null: new Date(attrValue);
      break;
    case '播出集數':
      var numEpisodes = parseInt(attrValue);
      anime.numEpisodes = isNaN(numEpisodes) ? 0 : numEpisodes;
      break;
    case '作品類型':
      anime.type = attrValue;
      break;
    case '對象族群':
      anime.targetGroup = attrValue;
      break;
    case '作品分級':
      anime.ceroRating = attrValue;
      break;
    case '原著作者':
      anime.author = attrValue;
      break;
    case '導演監督':
      anime.director = attrValue;
      break;
    case '製作廠商':
      anime.company = attrValue;
      break;
    case '台灣代理':
      anime.taiwanAgent = attrValue;
      break;
    case '官方網站':
      var gamerLink = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > ul.ACG-box1listB > li:nth-child(5) > a');
      if (gamerLink.length == 1) {
        var realLink = gamerLink.attr('href').replace(/http:\/\/ref\.gamer\.com\.tw\/redir\.php\?url=/, '');
        anime.officalSite = decodeURIComponent(realLink);
      } else {
        anime.officalSite = '';
      }
      break;
    default:
      // just skip it.
      break;
    }
  }
  // console.log(anime);
  ACGs.animes.push(anime);
}

function getComic(error, result, $) {
  if (error) {
    console.log(error);
    return;
  }
  var id = parseInt(this.uri.replace(/http:\/\/acg\.gamer\.com\.tw\/acgDetail\.php\?s=/, ''));
  if (isNaN(id)) {
    // TODO throw error no id page!.
    return;
  }
  var desc = getDescription($);
  var comic = {
    id: id,                     // int
    acgType: 'comic',           // string
    type: '',                   // string
    platform: '',               // string
    nameTW: '',                 // string
    nameJP: '',                 // string
    nameEN: '',                 // string
    comicAuthor: '',            // string
    originAuthor: '',           // string
    numEpisodes: 0,             // int
    ceroRating: '',             // string
    company: '',                // string
    officalSite: '',            // string
    targetGroup: '',            // string
    taiwanAgent: '',            // string
    description: desc           // string
  };
  var names = getACGNames($);
  comic.nameTW = names.nameTW;
  comic.nameJP = names.nameJP;
  comic.nameEN = names.nameEN;
  var attrLines = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > ul').text().replace(/^\s*[\r\n]/gm, '').split('\n');
  var regex = /(.+)：(.*)/;
  for(var i = 0; i<attrLines.length; i++) {
    regex.exec(attrLines[i]);
    var attr = RegExp.$1;
    var attrValue = RegExp.$2;
    switch(attr) {
    case '作品平台':
      comic.platform = attrValue;
      break;
    case '發行集數':
      var numEpisodes = parseInt(attrValue);
      comic.numEpisodes = isNaN(numEpisodes) ? 0 : numEpisodes;
      break;
    case '作品類型':
      comic.type = attrValue;
      break;
    case '對象族群':
      comic.targetGroup = attrValue;
      break;
    case '作品分級':
      comic.ceroRating = attrValue;
      break;
    case '原著作者':
      comic.originAuthor = attrValue;
      break;
    case '漫畫作者':
      comic.comicAuthor = attrValue;
      break;
    case '原廠出版':
      comic.company = attrValue;
      break;
    case '台灣代理':
      comic.taiwanAgent = attrValue;
      break;
    case '官方網站':
      var gamerLink = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > ul.ACG-box1listB > li:nth-child(5) > a');
      if (gamerLink.length == 1) {
        var realLink = gamerLink.attr('href').replace(/http:\/\/ref\.gamer\.com\.tw\/redir\.php\?url=/, '');
        comic.officalSite = decodeURIComponent(realLink);
      } else {
        comic.officalSite = '';
      }
      break;
    default:
      // just skip it.
      break;
    }
  }
  // console.log(comic);
  ACGs.comics.push(comic);
}

function getNovel(error, result, $) {
  if (error) {
    console.log(error);
    return;
  }
  var id = parseInt(this.uri.replace(/http:\/\/acg\.gamer\.com\.tw\/acgDetail\.php\?s=/, ''));
  if (isNaN(id)) {
    // TODO throw error no id page!.
    return;
  }
  var desc = getDescription($);
  var novel = {
    id: id,                     // int
    acgType: 'novel',           // string
    type: '',                   // string
    platform: '',               // string
    nameTW: '',                 // string
    nameJP: '',                 // string
    nameEN: '',                 // string
    novelAuthor: '',            // string
    originAuthor: '',           // string
    iiiustrator: '',            // string
    numEpisodes: 0,             // int
    ceroRating: '',             // string
    publisher: '',              // string
    officalSite: '',            // string
    targetGroup: '',            // string
    taiwanAgent: '',            // string
    description: desc           // string
  };
  var names = getACGNames($);
  novel.nameTW = names.nameTW;
  novel.nameJP = names.nameJP;
  novel.nameEN = names.nameEN;
  var attrLines = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > ul').text().replace(/^\s*[\r\n]/gm, '').split('\n');
  var regex = /(.+)：(.*)/;
  for(var i = 0; i<attrLines.length; i++) {
    regex.exec(attrLines[i]);
    var attr = RegExp.$1;
    var attrValue = RegExp.$2;
    switch(attr) {
    case '作品平台':
      novel.platform = attrValue;
      break;
    case '發行集數':
      var numEpisodes = parseInt(attrValue);
      novel.numEpisodes = isNaN(numEpisodes) ? 0 : numEpisodes;
      break;
    case '作品類型':
      novel.type = attrValue;
      break;
    case '對象族群':
      novel.targetGroup = attrValue;
      break;
    case '作品分級':
      novel.ceroRating = attrValue;
      break;
    case '原著作者':
      novel.originAuthor = attrValue;
      break;
    case '小說作者':
      novel.novelAuthor = attrValue;
      break;
    case '插畫作者':
      novel.iiiustrator = attrValue;
      break;
    case '原廠出版':
      novel.publisher = attrValue;
      break;
    case '台灣代理':
      novel.taiwanAgent = attrValue;
      break;
    case '官方網站':
      var gamerLink = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > ul.ACG-box1listB > li:nth-child(5) > a');
      if (gamerLink.length == 1) {
        var realLink = gamerLink.attr('href').replace(/http:\/\/ref\.gamer\.com\.tw\/redir\.php\?url=/, '');
        novel.officalSite = decodeURIComponent(realLink);
      } else {
        novel.officalSite = '';
      }
      break;
    default:
      // just skip it.
      break;
    }
  }
  // console.log(novel);
  ACGs.novels.push(novel);
}

function getPC(error, result, $) {
  if (error) {
    console.log(error);
    return;
  }
  var id = parseInt(this.uri.replace(/http:\/\/acg\.gamer\.com\.tw\/acgDetail\.php\?s=/, ''));
  if (isNaN(id)) {
    // TODO throw error no id page!.
    return;
  }
  var desc = getDescription($);
  var pc = {
    id: id,                     // int
    acgType: 'PC',              // string
    type: '',                   // string
    platform: '',               // string
    nameTW: '',                 // string
    nameJP: '',                 // string
    nameEN: '',                 // string
    numPlayer: '',              // string
    sellDate: null,             // date
    ceroRating: '',             // string
    price: '',                  // string
    productCompany: '',         // string
    dirturbuteCompany: '',      // string
    agent: '',                  // string
    officalSite: '',            // string
    description: desc           // string
  };
  var names = getACGNames($);
  pc.nameTW = names.nameTW;
  pc.nameJP = names.nameJP;
  pc.nameEN = names.nameEN;
  var attrLines = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > ul').text().replace(/^\s*[\r\n]/gm, '').split('\n');
  var regex = /(.+)：(.*)/;
  for(var i = 0; i<attrLines.length; i++) {
    regex.exec(attrLines[i]);
    var attr = RegExp.$1;
    var attrValue = RegExp.$2;
    switch(attr) {
    case '主機平台':
      pc.platform = attrValue;
      break;
    case '遊戲類型':
      pc.type = attrValue;
      break;
    case '遊戲人數':
      pc.numPlayer = attrValue;
      break;
    case '作品分級':
      pc.ceroRating = attrValue;
      break;
    case '發行廠商':
      pc.dirturbuteCompany = attrValue;
      break;
    case '製作廠商':
      pc.productCompany = attrValue;
      break;
    case '遊戲售價':
      pc.price = attrValue;
      break;
    case '代理廠商':
      pc.agent = attrValue;
      break;
    case '發售日期':
      pc.sellDate = attrValue == '不明' ? null: new Date(attrValue);
      break;
    case '官方網站':
      var gamerLink = $('ul.ACG-box1listB').find('a').last();
      if (!_.isUndefined(gamerLink.attr('href'))) {
        var realLink = gamerLink.attr('href').replace(/http:\/\/ref\.gamer\.com\.tw\/redir\.php\?url=/, '');
        pc.officalSite = decodeURIComponent(realLink);
      } else {
        pc.officalSite = '';
      }
      break;
    default:
      // just skip it.
      break;
    }
  }
  // console.log(pc);
  if (pc.platform == 'PS4') {
    pc.acgType = 'PS4';
    ACGs.PS4s.push(pc);
  } else if(pc.platform == 'PS3') {
    pc.acgType = 'PS3';
    ACGs.PS3s.push(pc);
  } else if(pc.platform == 'GBA') {
    pc.acgType = 'GBA';
    ACGs.GBAs.push(pc);
  } else if(pc.platform == 'Wii U') {
    pc.acgType = 'wiiu';
    ACGs.wiius.push(pc);
  } else if(pc.platform == 'XboxOne') {
    pc.acgType = 'xbone';
    ACGs.xbones.push(pc);
  } else if(pc.platform == 'Xbox360') {
    pc.acgType = 'xbox360';
    ACGs.xbox360s.push(pc);
  } else if(pc.platform == '3DS') {
    pc.acgType = '3DS';
    ACGs['3DSs'].push(pc);
  } else if(pc.platform == 'PSV') {
    pc.acgType = 'PSV';
    ACGs.PSVs.push(pc);
  } else if(pc.platform == 'PSP') {
    pc.acgType = 'PSP';
    ACGs.PSPs.push(pc);
  } else {
    ACGs.PCs.push(pc);
  }
}

function getOLG(error, result, $) {
  if (error) {
    console.log(error);
    return;
  }
  var id = parseInt(this.uri.replace(/http:\/\/acg\.gamer\.com\.tw\/acgDetail\.php\?s=/, ''));
  if (isNaN(id)) {
    // TODO throw error no id page!.
    return;
  }
  var desc = getDescription($);
  var olg = {
    id: id,                     // int
    acgType: 'OLG',              // string
    type: '',                   // string
    platform: '',               // string
    nameTW: '',                 // string
    nameJP: '',                 // string
    nameEN: '',                 // string
    numPlayer: '',              // string
    ceroRating: '',             // string
    priceType: '',              // string
    closeBetaDate: '',          // date
    openBetaDate: '',           // date
    productCompany: '',         // string
    dirturbuteCompany: '',      // string
    agent: '',                  // string
    officalSite: '',            // string
    description: desc           // string
  };
  var names = getACGNames($);
  olg.nameTW = names.nameTW;
  olg.nameJP = names.nameJP;
  olg.nameEN = names.nameEN;
  var attrLines = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > ul').text().replace(/^\s*[\r\n]/gm, '').split('\n');
  var regex = /(.+)：(.*)/;
  for(var i = 0; i<attrLines.length; i++) {
    regex.exec(attrLines[i]);
    var attr = RegExp.$1;
    var attrValue = RegExp.$2;
    switch(attr) {
    case '主機平台':
      olg.platform = attrValue;
      break;
    case '遊戲類型':
      olg.type = attrValue;
      break;
    case '遊戲人數':
      olg.numPlayer = attrValue;
      break;
    case '作品分級':
      olg.ceroRating = attrValue;
      break;
    case '發行廠商':
      olg.dirturbuteCompany = attrValue;
      break;
    case '製作廠商':
      olg.productCompany = attrValue;
      break;
    case '收費模式':
      olg.priceType = attrValue;
      break;
    case '代理廠商':
      olg.agent = attrValue;
      break;
    case '封測日期':
      olg.closeBetaDate = attrValue == '不明' ? null: new Date(attrValue);
      break;
    case '公測日期':
      olg.openBetaDate = attrValue == '不明' ? null: new Date(attrValue);
      break;
    case '官方網站':
      var gamerLink = $('ul.ACG-box1listB').find('a').last();
      if (!_.isUndefined(gamerLink.attr('href'))) {
        var realLink = gamerLink.attr('href').replace(/http:\/\/ref\.gamer\.com\.tw\/redir\.php\?url=/, '');
        olg.officalSite = decodeURIComponent(realLink);
      } else {
        olg.officalSite = '';
      }
      break;
    default:
      // just skip it.
      break;
    }
  }
  // console.log(olg);
  if (olg.platform == "Web遊戲") {
    olg.acgType = 'web';
    ACGs.WEBs.push(olg);
  } else {
    ACGs.OLGs.push(olg);
  }
}

function getFacebook(error, result, $) {
  if (error) {
    console.log(error);
    return;
  }
  var id = parseInt(this.uri.replace(/http:\/\/acg\.gamer\.com\.tw\/acgDetail\.php\?s=/, ''));
  if (isNaN(id)) {
    // TODO throw error no id page!.
    return;
  }
  var desc = getDescription($);
  var facebook = {
    id: id,                     // int
    acgType: 'facebook',        // string
    type: '',                   // string
    platform: '',               // string
    nameTW: '',                 // string
    nameJP: '',                 // string
    nameEN: '',                 // string
    numPlayer: '',              // string
    ceroRating: '',             // string
    priceType: '',              // string
    productCompany: '',         // string
    dirturbuteCompany: '',      // string
    agent: '',                  // string
    officalSite: '',            // string
    description: desc             // string
  };
  var names = getACGNames($);
  facebook.nameTW = names.nameTW;
  facebook.nameJP = names.nameJP;
  facebook.nameEN = names.nameEN;
  var attrLines = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > ul').text().replace(/^\s*[\r\n]/gm, '').split('\n');
  var regex = /(.+)：(.*)/;
  for(var i = 0; i<attrLines.length; i++) {
    regex.exec(attrLines[i]);
    var attr = RegExp.$1;
    var attrValue = RegExp.$2;
    switch(attr) {
    case '主機平台':
      facebook.platform = attrValue;
      break;
    case '遊戲類型':
      facebook.type = attrValue;
      break;
    case '遊戲人數':
      facebook.numPlayer = attrValue;
      break;
    case '作品分級':
      facebook.ceroRating = attrValue;
      break;
    case '發行廠商':
      facebook.dirturbuteCompany = attrValue;
      break;
    case '製作廠商':
      facebook.productCompany = attrValue;
      break;
    case '收費模式':
      facebook.priceType = attrValue;
      break;
    case '代理廠商':
      facebook.agent = attrValue;
      break;
    case '官方網站':
      var gamerLink = $('ul.ACG-box1listB').find('a').last();
      if (!_.isUndefined(gamerLink.attr('href'))) {
        var realLink = gamerLink.attr('href').replace(/http:\/\/ref\.gamer\.com\.tw\/redir\.php\?url=/, '');
        facebook.officalSite = decodeURIComponent(realLink);
      } else {
        facebook.officalSite = '';
      }
      break;
    default:
      // just skip it.
      break;
    }
  }
  // console.log(facebook);
  ACGs.Facebooks.push(facebook);
}

function getAndroid(error, result, $) {
  if (error) {
    console.log(error);
    return;
  }
  var id = parseInt(this.uri.replace(/http:\/\/acg\.gamer\.com\.tw\/acgDetail\.php\?s=/, ''));
  if (isNaN(id)) {
    // TODO throw error no id page!.
    return;
  }
  var desc = getDescription($);
  var android = {
    id: id,                     // int
    acgType: 'android',         // string
    type: '',                   // string
    platform: '',               // string
    nameTW: '',                 // string
    nameJP: '',                 // string
    nameEN: '',                 // string
    numPlayer: '',              // string
    ceroRating: '',             // string
    price: '',                  // string
    productCompany: '',         // string
    dirturbuteCompany: '',      // string
    agent: '',                  // string
    storeSite: '',              // string
    description: desc           // string
  };
  var names = getACGNames($);
  android.nameTW = names.nameTW;
  android.nameJP = names.nameJP;
  android.nameEN = names.nameEN;
  var attrLines = $('#BH-master > div.BH-lbox.ACG-mster_box1.hreview-aggregate.hreview > ul').text().replace(/^\s*[\r\n]/gm, '').split('\n');
  var regex = /(.+)：(.*)/;
  for(var i = 0; i<attrLines.length; i++) {
    regex.exec(attrLines[i]);
    var attr = RegExp.$1;
    var attrValue = RegExp.$2;
    switch(attr) {
    case '主機平台':
      android.platform = attrValue;
      break;
    case '遊戲類型':
      android.type = attrValue;
      break;
    case '遊戲人數':
      android.numPlayer = attrValue;
      break;
    case '作品分級':
      android.ceroRating = attrValue;
      break;
    case '發行廠商':
      android.dirturbuteCompany = attrValue;
      break;
    case '製作廠商':
      android.productCompany = attrValue.replace(/掃描安裝/, '');
      break;
    case '遊戲售價':
      android.price = attrValue;
      break;
    case '代理廠商':
      android.agent = attrValue;
      break;
    case 'Play 商店':
    case 'App Store':
      var gamerLink = $('ul.ACG-box1listB').find('a').last();
      if (!_.isUndefined(gamerLink.attr('href'))) {
        var realLink = gamerLink.attr('href').replace(/http:\/\/ref\.gamer\.com\.tw\/redir\.php\?url=/, '');
        android.storeSite = decodeURIComponent(realLink);
      } else {
        android.storeSite = '';
      }
      break;
    default:
      // just skip it.
      break;
    }
  }
  // console.log(android);
  if (android.platform === 'Android') {
    ACGs.androids.push(android);
  } else if(android.platform === 'iOS') {
    ACGs.iOSs.push(android);
  }
}

var ACGcallbacks = {
  'COMIC': getComic,
  'ANIME': getAnime,
  'novel': getNovel,
  'PC': getPC,
  'GBA': getPC,
  '3DS': getPC,
  'PS4': getPC,
  'PS3': getPC,
  'wiiu': getPC,
  'XBONE': getPC,
  'xbox360': getPC,
  'PSV': getPC,
  'PSP': getPC,
  'OLG': getOLG,
  'WEB': getOLG,
  'FACEBOOK': getFacebook,
  'Android': getAndroid,
  'ios': getAndroid
};

function parseLinks(platform, $) {
  var links = [];
  $('h1.ACG-maintitle > a:nth-child(1)').each(function(index, a) {
    // console.log(platform, $(a).text(), $(a).attr('href'));
    links.push($(a).attr('href'));
  });
  return links;
}

function getLink(platform, c) {
  return function(error, result, $) {
    if (error) {
      console.log(error);
      return;
    }
    var links = parseLinks(platform, $);
    for (var i=0; i<links.length; i++) {
      var callback = ACGcallbacks[platform];
      c.queue({
        uri: links[i],
        jquery: true,
        callback: callback
      });
    }
    c = null;
  };
}

function getAllLink(platform, c) {
  return function(error, result, $) {
    if (error) {
      console.log(error);
      return;
    }
    // console.log(platform);
    var numPage = parseInt($('#BH-pagebtn > p > a').last().text());
    for(var i=1; i<=numPage; i++) {
      c.queue({
        uri: 'http://acg.gamer.com.tw/index.php?page='+ i +'&p='+ platform,
        jquery: true,
        callback : getLink(platform, c)
      });
    }
    c = null;
  };
}

function getRegularACGsType(platform) {
  var acgsTypes = {
    ANIME: 'animes',
    COMIC: 'comics',
    novel: 'novels',
    PC: 'PCs',
    GBA: 'GBAs',
    '3DS': '3DSs',
    PS4: 'PS4s',
    PS3: 'PS3s',
    wiiu: 'wiius',
    XBONE: 'xbones',
    xbox360: 'xbox360s',
    PSV: 'PSVs',
    PSP: 'PSPs',
    OLG: 'OLGs',
    WEB: 'WEBs',
    FACEBOOK: 'Facebooks',
    Android: 'androids',
    ios: 'iOSs'
  };
  return acgsTypes[platform];
};

function _handleDrain() {
  var acgsName = getRegularACGsType(this.platform);
  var fileName =  './data/' + acgsName + '.json';
  jf.writeFile(fileName, ACGs[acgsName], function(err) {
    // TODO throw write error!.
    console.log('err:', err);
    console.log(acgsName+'.length:', ACGs[acgsName].length);
    delete(ACGs[acgsName]);
  });
}

function main() {
  var platforms = ['ANIME', 'COMIC', 'novel', 'PC', 'PS4',
                   'PS3', 'wiiu', 'XBONE', 'xbox360',
                   'PSV', 'PSP',
                   'OLG', 'WEB', 'FACEBOOK', 'Android',
                   'ios', 'GBA'];
  var i;
  var c = null;
  for(i=0; i<platforms.length; i++) {
    c = new Crawler({
      maxConnections: 32,
      retries: null,
      onDrain: _handleDrain.bind({platform: platforms[i]})
    });
    c.queue({
      uri: 'http://acg.gamer.com.tw/index.php?page=1&p='+ platforms[i],
      jquery: true,
      callback: getAllLink(platforms[i], c)
    });
    c = null;
  }
}

main();
