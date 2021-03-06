const express = require('express');
const jsforce   = require('jsforce');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message : 'Handling get request to /feedbackResponse.'
    })
});

router.post('/', (req, res, next) => {
    
        /**
         * Setting CORS headers in the response for AMP requests coming from the gmail.
         */
        res.setHeader('Content-type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', 'https://mail.google.com');
        res.setHeader('AMP-Access-Control-Allow-Source-Origin', 'amp@gmail.dev');
        res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

        var conn = new jsforce.Connection({
          loginUrl : 'https://ap1.stmpb.stm.salesforce.com'
        });

        var username = process.env.USER_NAME;
        var password = process.env.PASSWORD;

        conn.login(username, password, function(err) {
        if (err) { 
            return console.error(err); 
        }
        var body = { 
                        npsResponse : req.body.npsResponse, 
                        textResponse : req.body.textResponse  
                    };
                    
        conn.apex.post("/api/feedback", body, function(err, respon) {
            if (err) { 
                return console.error(err); 
            }
            res.send(respon);
        });
    });
});

module.exports = router;