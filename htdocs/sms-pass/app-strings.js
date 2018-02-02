// UI strings and messages in different languages
var appStrings = {

    ru: {
        enterPhoneNumber: "Введите номер телефона",
        passwordWillBeSent: "Пароль будет выслан на указанный номер",
        send: 'Отправить',
        clear: 'Стереть',
        enterPassword: "Введите пароль",
        passwordWasSent: "Пароль был выслан на номер",
        newPass: "Запросить новый",
        readRules: "Ознакомьтесь с правилами",
        hotspotOwner: "WiFi Хотспот",
        provider: "Интернет-провайдер",
        userdata: "Данные пользователя",
        wrongPassword: "Пароль введен неправильно, попробуйте еще раз",
        rules: `
<p style="line-height: 1.4; padding-bottom: 12px; font-weight: bold;">Правила пользования сетью Wi-Fi (WiFi Хотспот)
<p style="line-height: 1.4; padding-bottom: 10px; font-weifht: bold;">1. Доступ к сети Интернет посредством WiFi Хотспот не является коммерческой услугой и предоставляется на безвозмездной основе.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold">2. Пользователю Хотспота запрещено:
<p style="line-height: 1.4; padding-bottom: 5px;">2.1. Осуществлять противоправную деятельность.
<p style="line-height: 1.4; padding-bottom: 5px;">2.2. Распространять информацию, оскорбляющую честь, достоинство и деловую репутацию пользователей сети Интернет.
<p style="line-height: 1.4; padding-bottom: 5px;">2.3. Нарушать авторские права на информацию, размещенную в сети Интернет.
<p style="line-height: 1.4; padding-bottom: 5px;">2.4. Заниматься массовой рассылкой, не запрошенной адресатом.
<p style="line-height: 1.4; padding-bottom: 5px;">2.5. Осуществлять любые действия, которые могут привести к нарушению функционирования сети Хотспот или сетей других операторов.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">3. Владелец Хотспот и интернет-провайдер не несут ответственность:
<p style="line-height: 1.4; padding-bottom: 5px;">3.1. За любые затраты или ущерб, прямо или косвенно возникшие в результате пользования или невозможности пользования услугой доступа к сети Интернет.
<p style="line-height: 1.4; padding-bottom: 10px;">3.2. За охват WiFi сигнала и пропускную способность WiFi сети.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">4. Пользователь выражает согласие и разрешает оператору связи обрабатывать свои персональные данные.
<p style="line-height: 1.4; padding-bottom: 10px; font-weight: bold;">5. Нажимая кнопку "Согласен", пользователь соглашается с данными условиями.
`,
        agree: 'Согласен',
        doNotAgree: 'Не согласен',
        denyAccess: 'Если пользователь не согласен с Правилами, он должен немедленно прекратить пользование услугой.',
        passSendFail: 'Ошибка: пароль не отправлен',
        sessionLimit: 'Ошибка: превышено количество одновременных подключений',
    },

    en: {
        enterPhoneNumber: "Enter phone number",
        passwordWillBeSent: "Password will be sent to the phone number specified",
        send: "Send",
        clear: "Reset",
        enterPassword: "Enter password",
        passwordWasSent: "The password was sent to",
        newPass: "Request new password",
        readRules: "Be informed of the service conditions",
        hotspotOwner: "WiFi hotspot",
        provider: "Internet service provider",
        userdata: "User data",
        wrongPassword: "Password check failed",
        rules: `
<p style="line-height: 1.4; padding-bottom: 12px; font-weight: bold;">WiFi hotspot service conditions
<p style="line-height: 1.4; padding-bottom: 10px; font-weifht: bold;">1. Internet access via this Wifi hotspot is provided free of charge.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold">2. The user of this WiFi hotspot is not allowed to:
<p style="line-height: 1.4; padding-bottom: 5px;">2.1. Use the Service for illegal activities of any kind.
<p style="line-height: 1.4; padding-bottom: 5px;">2.2. Use the Service to harm, or attempt to harm other persons, businesses or other entities.
<p style="line-height: 1.4; padding-bottom: 5px;">2.3. Use the Service to transmit any material that infringes any copyright, trademark, patent, trade secret, or other proprietary rights of any third party.
<p style="line-height: 1.4; padding-bottom: 5px;">2.4. Use the Service to transmit or facilitate any unsolicited commercial messages or unsolicited bulk messages. 
<p style="line-height: 1.4; padding-bottom: 5px;">2.5. Use the Service for any activities, which adversely affect the ability of other people or systems to use the Wi-Fi service or the Internet.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">3. Neither WiFi hotspot service owner, nor internet service provider is not liable to the user for:
<p style="line-height: 1.4; padding-bottom: 5px;">3.1. Any direct, indirect, incidental, special or consequential damages of any kind as a result of using or inavailability of the Service.
<p style="line-height: 1.4; padding-bottom: 10px;">3.2. Service interruptions and/or outages, as well as the speed and overall quality of service.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">4. The user gives the express permission to the ISP to collect, store and process his/her personal data.
<p style="line-height: 1.4; padding-bottom: 10px; font-weight: bold;">5. By pressing the "Accept" button the user fully accepts the above WiFi hotspot service conditions.
`,
        agree: "Accept",
        doNotAgree: "Reject",
        denyAccess: "If you do not agree with the service conditions, you must stop using the service immidiately",
        passSendFail: 'Failed to send password',
        sessionLimit: 'Session limit exceeded',
    },

    es: {
        enterPhoneNumber: "Entra el número de celular",
        passwordWillBeSent: "La contraseña será enviada al numero entrado",
        send: "Enviar",
        clear: "Borrar",
        enterPassword: "Entra la contraseña",
        passwordWasSent: "La contraseña fue enviada al número",
        newPass: "Cambiar contraseña",
        readRules: "Acepta las condiciones de servicio",
        hotspotOwner: "WiFi hotspot",
        provider: "Proveedor de servicio internet",
        userdata: "Datos de usuario",
        wrongPassword: "Contraseña incorrecta",
        rules: `
<p style="line-height: 1.4; padding-bottom: 12px; font-weight: bold;">Condiciones de servicio
<p style="line-height: 1.4; padding-bottom: 10px; font-weifht: bold;">1. El acceso al Internet se otorga gratis.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold">2. No se podrá utilizar la red WI-FI con los siguientes fines:
<p style="line-height: 1.4; padding-bottom: 5px;">2.1. Conducir actividates illegales.
<p style="line-height: 1.4; padding-bottom: 5px;">2.2. Transmisiáón de contenido fraudulento, difamatorio, obsceno, ofensivo o de vandalismo, insultante o acosador, sea éste material o mensajes.
<p style="line-height: 1.4; padding-bottom: 5px;">2.3. Transmitir, copiar y/o descargar cualquier material que viole derecho de autor.
<p style="line-height: 1.4; padding-bottom: 5px;">2.4. Enviar mensajes no solicitados (spam).
<p style="line-height: 1.4; padding-bottom: 5px;">2.5. Dañar equipos, sistemas informáticos o redes y/o perturbar el normal funcionamiento de la red.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">3. Ni el operador del WiFi hotspot, ni el proveedor de servicio internet no se responsabiliza por:
<p style="line-height: 1.4; padding-bottom: 5px;">3.1. Qualquier daño que resulta del uso o de la aucencia del servicio.
<p style="line-height: 1.4; padding-bottom: 10px;">3.2. El nivel de desempeño de la red WI-FI. El servicio puede no estar disponible o ser limitado en cualquier momento y por cualquier motivo.
<p style="line-height: 1.4; padding-bottom: 5px; font-weight: bold;">4. El usuario da su permiso al proveedor de servicio internet a almacenar y processar sus datos personales.
<p style="line-height: 1.4; padding-bottom: 10px; font-weight: bold;">5. Al acceder y utilizar la red WI-FI el usuario declara que ha leído, entendido y acepta los tréminos y condiciones para su utilización.
`,
        agree: "Aceptar",
        doNotAgree: "Rechazar",
        denyAccess: "Si no acepta las condiciones de servicio, el usuario debe terminar usarlo inmediatamente",
        passSendFail: 'No pude pasar contraseña',
        sessionLimit: 'El numero de sesiones alcanzo su limite',
    },

}

