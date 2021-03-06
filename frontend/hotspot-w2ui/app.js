
function changeLanguage() {
    lang = $("input:radio[name=langSelector]:checked").val();
    appStr = appStrings[lang];
    w2popup.close();
    w2ui['formRules'].destroy();
    w2ui['myLayout'].destroy();
    mkLayout();
    mkRulesForm();
    w2ui['myLayout'].content('main', w2ui['formRules']);

    if (lang == 'ch') {
        document.getElementById('img_hotspot').style.height='149px';
        document.getElementById('img_isp').style.height='48px';
    }

}

////////////////////////////////////////////////////////////////////////

function langPopup() {
    w2popup.open({
        title: '<img src="' + appConfig.img.globe + '" height="12" width="12"> ' + appStr.langChange,
        body : '<div class="popup"><p>'+
               '<input id="l_ru" type="radio" name="langSelector" value="ru">Русский<br>'+
               '<input id="l_en" type="radio" name="langSelector" value="en">English<br>'+
               '<input id="l_es" type="radio" name="langSelector" value="es">Español<br>'+
               '<input id="l_ch" type="radio" name="langSelector" value="ch">中文<br>'+
               '<script>document.getElementById(\'l_'+lang+'\').checked = true;</script>'+
               '</div>',
        buttons: '<button class="btn" name="langSave" onclick="changeLanguage()"><img src="' + appConfig.img.ok + '" height="11" width="11"></button>',
        width: 150,
        height: 200,
    });
}

////////////////////////////////////////////////////////////////////////

function mkLayout() {
    $('#root').w2layout({
        name: 'myLayout',
        panels: [
            { type: 'top', size: 195, content: '<div id="layoutTop"><center><img id="img_hotspot" src="' +
                appConfig.hotspot.logo + '" alt="hotspot owner logo" height="' +
                appConfig.hotspot.logoHeight + '" width="' +
                appConfig.hotspot.logoWidth  + '"><p>' +
                appStr.hotspotOwner + ' ' +
                appConfig.hotspot.name + '</center></div>',},
            { type: 'main', size: 200, },
            { type: 'bottom', size: 150, content: '<div id="layoutBottom"><center><img id="img_isp" src="' +
                appConfig.isp.logo + '" alt="ISP logo" height="' +
                appConfig.isp.logoHeight + '" width="' +
                appConfig.isp.logoWidth  + '"><p>' +
                appStr.provider + ' ' +
                appConfig.isp.name + '<p style="font-size: 9px;">sms-pass by Alex Zimnitsky</center></div>',},
        ],
    });
}

////////////////////////////////////////////////////////////////////////

function mkRulesForm() {

    $('#formRules').w2form({ 
        name: 'formRules',
        header: appStr.readRules,
        formHTML: 
            '<div class="w2ui-page page-0">'+
            '    <div id="rules">'+
            '        ' + appStr.rules + 
            '    </div>'+
            '</div>'+
            '<div class="w2ui-buttons">'+
            '   <button class="btn" name="reset">' + appStr.doNotAgree + '</button>'+
            '   <button class="btn btn-green" name="save">' + appStr.agree + '</button>'+
            '   <button class="btn" name="lang"><img src="' + appConfig.img.globe + '" height="14" width="14" style="margin-bottom: -3px;"> ' + appStr.langChange + '</button>'+
            '</div>',
        actions: {
            "lang": langPopup,
            "reset": function() {
                         w2popup.open({
                             title: appStr.readRules,
                             body : '<div class="popup"><p>' + appStr.denyAccess + '</div>',
                             width: 300,
                             height: 150,
                         });
                     },
            "save": function() {
                        mkPhoneForm();
                        w2ui['myLayout'].content('main', w2ui['formPhone']);
                    }
        },
    });
}

////////////////////////////////////////////////////////////////////////

function phoneRus() {
   $('input[name="phone"]').attr("disabled",false);
   $('input[name="phone_world"]').attr("disabled",true);
   appConfig.phoneField='phone';
}

function phoneWorld() {
   $('input[name="phone"]').attr("disabled",true);
   $('input[name="phone_world"]').attr("disabled",false);
   appConfig.phoneField='phone_world';
}

//////////////////////////////////////////////////////////////////

function mkPhoneForm() {

    $('#formPhone').w2form({ 
        name: 'formPhone',
        header: appStr.enterPhoneNumber,
        formHTML: 
            '<div class="w2ui-page page-0">'+
            '    <div id="phoneInfo">'+
            '        <p class="lineInfo">' + appStr.enterPhoneNumber + '.</p>' +
            '        <p class="lineInfo">' + appStr.passwordWillBeSent + '.</p>' +
            '    </div>'+
            '    <div class="w2ui-field">'+
            '        <div id="inputPhoneDiv">'+
            '            <input type="radio" name="phonetype" checked value="russia" onclick="phoneRus()"/>'+
            '                  <img src="'+ appConfig.img.flag +'" height="25" width="32" style="margin-bottom: -5px;">'+
            '                  <input name="phone" maxlength="15" size="15"/><br><br>'+
            '            <input type="radio" name="phonetype" value="world" onclick="phoneWorld()"/>'+
            '                  <img src="'+ appConfig.img.world  +'" allign="bottom" height="25" width="32" style="margin-bottom: -5px;">'+
            '                  <input name="phone_world" disabled maxlength="25" size="15"/>'+
            '        </div>'+
            '    </div>'+
            '</div>'+
            '<div class="w2ui-buttons">'+
            '   <button class="btn" name="reset">' + appStr.clear + '</button>'+
            '   <button class="btn btn-green" name="save">' + appStr.send + '</button>'+
            '</div>',
        fields : [
            { name: 'phone', type: 'text', },
            { name: 'phone_world', type: 'text', },
        ],
        actions: {
            "reset": function() { this.clear(); },
            "save": function() {
                        if (w2ui['formPhone'].record[appConfig.phoneField] != undefined) {
                            var phone = w2ui['formPhone'].record[appConfig.phoneField].replace(/[^0-9]/g, "");
                            var reg = new RegExp('^\\d{' + appConfig.phoneLength + '}$');
                            if (phone != undefined && (appConfig.phoneField == 'phone_world' || reg.test(phone))) {
                                var params = {
                                    operation: "pass",
                                    login: '+' + phone,
                                    tag: '+' + appConfig.tag,
                                }
                                $.post("/api1", params, function(data) {
                                    if (data.Error == 0) {
                                        if (w2ui['formPassword'] != undefined) {
                                            w2ui['formPassword'].destroy();
                                        }
                                        mkPasswdForm(w2ui['formPhone'].record[appConfig.phoneField]);
                                        w2ui['myLayout'].content('main', w2ui['formPassword']);
                                    }
                                    else {
                                        w2popup.open({
                                            title: appStr.readRules,
                                            body : '<div class="popup"><p>' + appStr.passSendFail + '</div>',
                                            width: 300,
                                            height: 150,
                                        });
                                        this.clear();
                                    }
                                },"json")
                            }
                            else {
                                this.clear();
                            }
                        }
                    }
        },
    });

    $('input[name="phone"]').mask(appConfig.phoneMask, {placeholder: appConfig.phonePlaceholder, clearIfNotMatch: true, translation: { Z: {pattern: /\d/}, 9: {pattern: /9/}}});
    $('input[name="phone_world"]').mask("00000000000000", {clearIfNotMatch: false});
}

////////////////////////////////////////////////////////////////////////

function mkPasswdForm(phone) {
    var phoneStripped = phone.replace(/[^0-9]/g, "");
    $('#formPassword').w2form({
        name   : 'formPassword',
        header   : appStr.enterPassword,
        formHTML:
            '<div class="w2ui-page page-0">'+
            '    <div style="width: 380px; height: 50px; font-size: 14px; display: block; margin-left: auto; margin-right: auto; margin-top: 20px;">'+
            '        <p style="line-height: 1.4;">' + appStr.enterPassword + '.</p>'+
            '        <p style="line-height: 1.4;">' + appStr.passwordWasSent + ' ' + phone + '.</p>'+
            '    </div>'+
            '    <div class="w2ui-field">'+
            '        <div style="margin-left: 95px;">'+
            '            <input id="p3" class="input-phone" name="password" style="margin-top: 60px; font-size: 20px;" maxlength="15" size="15"/>'+
            '        </div>'+
            '    </div>'+
            '</div>'+
            '<div class="w2ui-buttons">'+
            '   <button class="btn" name="newpass">' + appStr.newPass + '</button>'+
            '   <button class="btn" name="reset">' + appStr.clear + '</button>'+
            '   <button class="btn btn-green" name="save">' + appStr.send + '</button>'+
            '</div>',
        fields : [
            { name: 'password', type: 'text', },
        ],
        actions: {
            "reset": function() { this.clear(); },
            "save": function() {
                        var pass = w2ui['formPassword'].record.password;
                        var reg = new RegExp('^\\d{' + appConfig.passLength + '}$');
                        if (pass != undefined && reg.test(pass)) {
                            $.post("/api1", {'operation': 'checkpass', 'login': '+' + phoneStripped, 'pass': pass}, function(data) {
                                if (data.Error == "0") {
                                    switch (appConfig.hotspot.type) {
                                        case 'mikrotik':
                                            //cannot use save(), we need `get` request, save() uses `post`
                                            window.location.replace(appConfig.hotspot.urlA + '?username=%2B' +
                                                              phoneStripped + '&password=' + pass + '&dst=' +
                                                              appConfig.hotspot.urlR);
                                        break;
                                        default:
                                            w2popup.open({
                                                title: appStr.userdata,
                                                body : '<div class="popup"><p>username: +' + phoneStripped +
                                                       '<p>password: ' + pass +
                                                       '<p>auth_url: ' + appConfig.hotspot.urlA +
                                                       '<p>redirect_url: ' + appConfig.hotspot.urlR +
                                                       '</div>',
                                                width: 350,
                                                height: 180,
                                            });
                                    }
                                }
                                else if (data.Error == "2") {
                                    w2popup.open({
                                        title: appStr.errorOccurred,
                                        body : '<div class="popup"><p>' + appStr.sessionLimit + '</div>',
                                        width: 250,
                                        height: 100,
                                    }); 
                                }
                                else {
                                    if (appConfig.attempts > 0) {
                                        appConfig.attempts--;    
                                        w2popup.open({
                                            title: appStr.errorOccurred,
                                            body : '<div class="popup"><p>' + appStr.wrongPassword + '</div>',
                                            width: 250,
                                            height: 100,
                                        });
                                    }
                                    else {
                                        appConfig.attempts = 3;
                                        w2ui['myLayout'].content('main', w2ui['formRules']);
                                    }
                                }
                            },"json");
                        }
                        else {
                            this.clear();
                        }
            },
            "newpass": function () {
                           w2ui['myLayout'].content('main', w2ui['formPhone']);
            },
        },
    });

    var m = "0";
    var p = "X";
    for (var i = 1; i < appConfig.passLength; i++) {
        m = m + "0";
        p = p + "X";
    }
    $('input[name="password"]').mask(m, {placeholder: p, clearIfNotMatch: true, });
    w2ui['formPassword'].record.password="";
}

////////////////////////////////////////////////////////////////////////

$(function(){
    if (lang != appConfig.defaultLang) {
        langPopup();
    }
    mkLayout();
    mkRulesForm();
    w2ui['myLayout'].content('main', w2ui['formRules']);
});
