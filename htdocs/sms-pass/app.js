// Setup UI language
let language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
let appStr = appStrings[language.replace(/-.*$/, "")];
if (appStr == undefined) {
    appStr = appStrings.en;
}

let appConfig = {
    passLength: 5,
    isp: {logoWidth: 100, logoHeight: 100,},
    hotspot: {logoWidth: 100, logoHeight: 100,},
};

let attempts = 3;

////////////////////////////////////////////////////////////////////////

function mkLayout() {
    let top = 'background-color: #ffffff;';
    let bottom = 'background-color: #ffffff; padding-top: 10px;';
    $('#root').w2layout({
        name: 'myLayout',
        panels: [
            { type: 'top', size: 150, style: top, content: '<div style="font-size: 11px;"><center><img src="' +
                appConfig.hotspot.logo + '" alt="hotspot owner logo" height="' + appConfig.hotspot.logoWidth + '" width="' +
                appConfig.hotspot.logoHeight  + '"><p>' + appStr.hotspotOwner + ' ' + appConfig.hotspot.name + '</center></div>',},
            { type: 'main', size: 200, },
            { type: 'bottom', size: 150, style: bottom, content: '<div style="font-size: 11px;"><center><img src="' +
                appConfig.isp.logo + '" alt="ISP logo" height="' + appConfig.isp.logoHeight + '" width="' +
                appConfig.isp.logoWidth  + '"><p>' + appStr.provider + ' ' +
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
            '    <div style="width: 380px; height: 50px; font-size: 12px; display: block; margin-left: auto; margin-right: auto;">'+
            '        ' + appStr.rules + 
            '    </div>'+
            '</div>'+
            '<div class="w2ui-buttons">'+
            '   <button class="btn" name="reset">' + appStr.doNotAgree + '</button>'+
            '   <button class="btn btn-green" name="save">' + appStr.agree + '</button>'+
            '</div>',
        actions: {
            "reset": function () {
                         w2popup.open({
                             title: appStr.readRules,
                             body : '<div style="margin-left: 20px; margin-right: 20px;"><p>' + appStr.denyAccess + '</div>',
                             width: 300,
                             height: 150,
                         });
                     },
            "save": function () {
                        mkPhoneForm();
                        w2ui['myLayout'].content('main', w2ui['formPhone']);
                    }
        },
    });
}

////////////////////////////////////////////////////////////////////////

function mkPhoneForm() {

    $('#formPhone').w2form({ 
        name: 'formPhone',
        header: appStr.enterPhoneNumber,
        formHTML: 
            '<div class="w2ui-page page-0">'+
            '    <div style="width: 380px; height: 50px; font-size: 12px; display: block; margin-left: auto; margin-right: auto;">'+
            '        <p style="line-height: 1.4;">' + appStr.enterPhoneNumber + '.' +
            '        <p style="line-height: 1.4;">' + appStr.passwordWillBeSent + '.' +
            '    </div>'+
            '    <div class="w2ui-field">'+
            '        <div>'+
            '            <input id="p2" class="input-phone" name="phone" maxlength="15" size="15"/>'+
            '        </div>'+
            '    </div>'+
            '</div>'+
            '<div class="w2ui-buttons">'+
            '   <button class="btn" name="reset">' + appStr.clear + '</button>'+
            '   <button class="btn btn-green" name="save">' + appStr.send + '</button>'+
            '</div>',
        fields : [
            { name: 'phone', type: 'text', },
        ],
        actions: {
            "reset": function () { this.clear(); },
            "save": function () {
                        let phone = w2ui['formPhone'].record.phone.replace(/[^0-9]/g, "");
                        if (phone != undefined) {
                            let params = {
                                operation: "pass",
                                login: phone,
                            }
                            $.post("/api1", params, function(data) {
                                if (data.Error == 0) {
                                    mkPasswdForm(w2ui['formPhone'].record.phone);
                                    w2ui['myLayout'].content('main', w2ui['formPassword']);
                                }
                                else {
                                    alert("Failed to send password")
                                    this.clear();
                                }
                            },"json")
                        }
                    }
        },
    });
    $('input[name="phone"]').mask(appConfig.phoneMask, {placeholder: appConfig.phonePlaceholder, clearIfNotMatch: true, translation: { Z: {pattern: /\d/}, 9: {pattern: /9/}}});
}

////////////////////////////////////////////////////////////////////////

function mkPasswdForm(phone) {
    let phoneStripped = phone.replace(/[^0-9]/g, "");
    $('#formPassword').w2form({
        name   : 'formPassword',
        header   : appStr.enterPassword,
        url : 'http:/10.15.55.1/login',
        formHTML:
            '<div class="w2ui-page page-0">'+
            '    <div style="width: 380px; height: 50px; font-size: 12px; display: block; margin-left: auto; margin-right: auto;">'+
            '        <p style="line-height: 1.4;">' + appStr.enterPassword + '.'+
            '        <p style="line-height: 1.4;">' + appStr.passwordWasSent + ' ' + phone + '.'+
            '    </div>'+
            '    <div class="w2ui-field">'+
            '        <div>'+
            '            <input id="p3" class="input-phone" name="password" maxlength="15" size="15"/>'+
            '            <input type="hidden" name="dst" value="https://www.telixnet.ru"/>'+
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
            "reset": function () { this.clear(); },
            "save": function () {
                        let pass = w2ui['formPassword'].record.password;
                        let reg = new RegExp('^\\d{' + appConfig.passLength + '}$');
                        if (pass != undefined && reg.test(pass)) {
                            $.post("/api1", {'operation': 'checkpass', 'login': phoneStripped, 'pass': pass}, function(data) {
                                if (data.Error == "0") {
                                    switch (appConfig.hotspot.type) {
                                    case 'mikrotik':
                                        //cannot use save(), we need get request
                                        window.location.replace(appConfig.hotspot.urlA + '?username=' +
                                                              phoneStripped + '&password=' + pass + '&dst=' +
                                                              appConfig.hotspot.urlR);
                                    break;
                                    case 'test':
                                        w2popup.open({
                                            title: appStr.userdata,
                                            body : '<div style="margin-left: 20px; margin-right: 20px;"><p>username: ' + phoneStripped +
                                               '<p>password: ' + pass +
                                               '<p>auth_url: ' + appConfig.hotspot.urlA +
                                               '<p>redirect_url: ' + appConfig.hotspot.urlR +
                                               '</div>',
                                            width: 300,
                                            height: 180,
                                            });
                                    break;
                                    }
                                }
                                else {
                                    if (attempts > 0) {
                                        attempts--;    
                                        w2popup.open({
                                            title: appStr.enterPassword,
                                            body : '<div style="margin-left: 20px; margin-right: 20px;"><p>' + appStr.wrongPassword + '</div>',
                                            width: 250,
                                            height: 100,
                                            });
                                    }
                                    else {
                                        attempts = 3;
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

    let m = "0";
    let p = "X";
    for (let i = 1; i < appConfig.passLength; i++) {
        m = m + "0";
        p = p + "X";
    }
    $('input[name="password"]').mask(m, {placeholder: p, clearIfNotMatch: true, });
    w2ui['formPassword'].record.password="";
}

////////////////////////////////////////////////////////////////////////

$(function(){

    $.post("/api1", {operation: "config"}, function(data) {
        if (data.Error == "0") {
            appConfig.redirect = data.Redirect
            appConfig.passLength = data.PassLength
            appConfig.phoneMask = data.PhoneMask
            appConfig.phonePlaceholder = data.PhonePlaceholder
            appConfig.isp.name = data.Isp.Name;
            appConfig.isp.logo = data.Isp.Logo;
            appConfig.isp.logoHeight = data.Isp.LogoHeight;
            appConfig.isp.logoWidth = data.Isp.LogoWidth;
            appConfig.hotspot.type = data.Hotspot.Type;
            appConfig.hotspot.name = data.Hotspot.Name;
            appConfig.hotspot.logo = data.Hotspot.Logo;
            appConfig.hotspot.logoHeight = data.Hotspot.LogoHeight;
            appConfig.hotspot.logoWidth = data.Hotspot.LogoWidth;
            appConfig.hotspot.urlA = data.Hotspot.UrlA;
            appConfig.hotspot.urlR = data.Hotspot.UrlR;

            if (appConfig.hotspot.name == "") {
                window.location.replace(appConfig.redirect);
            }
            else {
                mkLayout();
                mkRulesForm();
                w2ui['myLayout'].content('main', w2ui['formRules']);
            }
        }
        else {
            alert(data.ErrorMsg);
        }
    },"json");
});

