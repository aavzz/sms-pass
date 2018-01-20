package rest

import (
	"fmt"
	"net/http"
)

const startPage = `<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <title>Hotspot login</title>
    <link rel="stylesheet" type="text/css" href="/assets/w2ui/dist/w2ui.min.css" />
    <script src="/assets/w2ui/libs/jquery/jquery-2.1.0.min.js"></script>
    <script src="/assets/jQuery-Mask-Plugin/dist/jquery.mask.min.js"></script>
    <script src="/assets/w2ui/dist/w2ui.min.js"></script>
    <script src="/assets/sms-pass/app-strings.js"></script>
    <script src="/assets/sms-pass/app.js"></script>
</head>
<body>
    <div id="root" style="width: 445px; height: 700px; display: block; margin-left: auto; margin-right: auto;"></div>
</body>
</html>`

func spa(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, startPage)
}
