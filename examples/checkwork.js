var Hashcash = require("../lib/hashcash");
var api = new Hashcash('0fc35b64-0e37-4fa4-8b20-62f1ecba213f');
var id = 'form-ZSq9PXGN_Yc9ACbYCec1E8sMRp3tIOWMpjk0Tk76kMs';

api.getWorkById(id)
   .then(function(work) {
        console.log("success");
        console.log(work);
   })
   .fail(function(err) {
        console.log("error");
        console.log(err);
   });

