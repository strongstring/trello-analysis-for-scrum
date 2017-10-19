var express = require('express');
var router = express.Router();
var url  = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('adhoc', { title: 'Analysis Work' });
});

router.get('/scrum', function(req, res, next) {
  res.render('index', { title: 'Analysis Work' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Analysis Work' });
});

router.get('/ipolis', function(req, res, next) {
	res.render('ipolis_ota', { title: 'iPOLiS mobile test version Installer' });
});

router.get('/comment', function(req, res, next) {
	res.render('comment', { title: 'comment test page' });
});

router.get('/product', function(req, res, next) {
	res.render('product', { title: 'product test page' });
});

router.get('/task', function(req, res, next) {
	res.render('task', { title: 'product test page' });
});

router.get('/dailyc', function(req, res, next) {
	res.render('dailyc', { title: 'product test page' });
});

router.get('/adhoc', function(req, res, next) {
	res.render('adhoc', { 
		title: 'Hanwha Techwin Mobile Team ADHOC Service',
	});
});

router.get('/page/:id', function(req, res, next) {
	res.render('page', { 
		title: req.params.id,
	});
});

router.get('/test', function(req, res, next) {
	res.render('test', { title: 'product test page' });
});

router.get('/smartcam', function(req, res, next) {
	res.render('smartcam', { title: 'product test page' });
});

router.get('/smartcamPlus', function(req, res, next) {
	res.render('smartcamPlus', { title: 'product test page' });
});

router.get('/installation', function(req, res, next) {
	res.render('installation', { title: 'product test page' });
});

router.get('/wisenet', function(req, res, next) {
	res.render('wisenet', { title: 'product test page' });
});

var serials = {
    "hbtwh-mobile01-1234-11e7-9983-adfa7ff293a5" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJoYnR3aC1tb2JpbGUwMS0xMjM0LTExZTctOTk4My1hZGZhN2ZmMjkzYTUiLCJ0eXBlIjoidXNlciIsIndpZCI6IjRtb2JpbGUwMSIsInByb2R1Y3RJZCI6Im1vYmlsZS1hbmRyb2lkLWlwaG9uZTdwbHVzIiwidXNlclN0YXR1cyI6IkFDVElWRSIsInNlcnZpY2VTdGF0dXMiOiJTVE9SQUdFLUFDVElWRSIsImlhdCI6MTUwNzc2NjMzMywiZXhwIjo0NjYzNTI2MzMzLCJpc3MiOiJhcGkuaGFud2hhc2VjdXJpdHktdnNhYXMuY29tIiwianRpIjoiMjJjZDgwZDAtYWVlMC0xMWU3LWFkZTMtYTUxMDViM2ViZjIyIn0.NmSvfsoAHEYuxFOiqGDnKTvdTOuKGWYNdLtfwH33i5_BrwiveChaeqTpOvC-e9tjftaSJizrhWt3IqustNB0zK3JjAZA36_prMnta2ZzsId_S7bEdvHSKdoKtrRE6bIlH40t8hcjKWIV-uZRhHIGEsjPQy0hZyi36l_Wc7nfdy8kQ2BkydgjgiBPtS7TCdFWaBxUk7TCNe24WfLx4-ruS4Vo_FvaCcclxESxS_t_eIrPT91IKZxIN70NR8alXV2vy2BaH5KmlazmVDddAzwMjwgb8WVzfYmSDj1hmYSZHoB7js5BFPGPuDFlKH8aMg5-rjlWLwESzN7R465nJ8F5Hw",
    "hbtwh-mobile02-1234-11e7-9983-adfa7ff293a5" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJoYnR3aC1tb2JpbGUwMi0xMjM0LTExZTctOTk4My1hZGZhN2ZmMjkzYTUiLCJ0eXBlIjoidXNlciIsIndpZCI6IjRtb2JpbGUwMiIsInByb2R1Y3RJZCI6Im1vYmlsZS1hbmRyb2lkLWlwaG9uZTdwbHVzIiwidXNlclN0YXR1cyI6IkFDVElWRSIsInNlcnZpY2VTdGF0dXMiOiJTVE9SQUdFLUFDVElWRSIsImlhdCI6MTUwNzc2NjM0OSwiZXhwIjo0NjYzNTI2MzQ5LCJpc3MiOiJhcGkuaGFud2hhc2VjdXJpdHktdnNhYXMuY29tIiwianRpIjoiMmMwMDhiNzAtYWVlMC0xMWU3LWFkZTMtYTUxMDViM2ViZjIyIn0.ZXLNB-cUpXnUcfj9I7UU9Q_RbKe_Ay5B7QUzaWZWpFr5s1YCNKa6qvD4lInOjvnfKLycL_-qk_1pQxiSTohKkSfd8-fMHiCdBnFhpiy612fsvzzub7orsWKtb99HR0CrHE1Rr07nertR3EQ3kBao03B3CoMFZyuITRdaNT2y0JQOt2jsdRzeJBhOnssLLAlB3EaKiLn9u67knaXPzo2DuAAyP9EKxl1ABUVXYlTWUPrmmuT-Kqocj00QHZW4Lcnwuadr9FKwFk_vHOaMEIVpgdPFS3JUFfuruHJolR4rThl-RfvDb9aR11Tc2_gmvdMmmjOjSV-hdI_ZYDdWSYAhig",
    "hbtwh-mobile03-1234-11e7-9983-adfa7ff293a5" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJoYnR3aC1tb2JpbGUwMy0xMjM0LTExZTctOTk4My1hZGZhN2ZmMjkzYTUiLCJ0eXBlIjoidXNlciIsIndpZCI6IjRtb2JpbGUwMyIsInByb2R1Y3RJZCI6Im1vYmlsZS1hbmRyb2lkLWlwaG9uZTdwbHVzIiwidXNlclN0YXR1cyI6IkFDVElWRSIsInNlcnZpY2VTdGF0dXMiOiJTVE9SQUdFLUFDVElWRSIsImlhdCI6MTUwNzc2NjM2NywiZXhwIjo0NjYzNTI2MzY3LCJpc3MiOiJhcGkuaGFud2hhc2VjdXJpdHktdnNhYXMuY29tIiwianRpIjoiMzZjMDUwOTAtYWVlMC0xMWU3LWFkZTMtYTUxMDViM2ViZjIyIn0.PLGpju9BrTFKQebMcs_AQoRIc8mHCBIM8MAQ0PoEw6Iz0x5XLp0YKFGxtE6zVRlvApCKfreSIu-IY5cuaXhSIsCZom5vtd-uBV2SutxBqXFyBfpaG6LCghq79go_z3_oA_s7LLkoj_jPflaN51RQAZY71_Mr4Q4VsrdBb32bOHuVlpXQAajJgs-eaqsLT3BWXyYh7KHnAjgC_ES8fRs55O7VO6_u12lw9tu9juNnHLnR1c5lGaR5gGbkw7fDLsEGmrITv2pOgN8eFamKWZOXe9k4zV1NonnU3-e9MhpB1AuSMd0msjpqJUZG3BDBhJWLHTlHySlYn61MDDj_MsPt-Q",
    "hbtwh-mobile04-1234-11e7-9983-adfa7ff293a5" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJoYnR3aC1tb2JpbGUwNC0xMjM0LTExZTctOTk4My1hZGZhN2ZmMjkzYTUiLCJ0eXBlIjoidXNlciIsIndpZCI6IjRtb2JpbGUwNCIsInByb2R1Y3RJZCI6Im1vYmlsZS1hbmRyb2lkLWlwaG9uZTdwbHVzIiwidXNlclN0YXR1cyI6IkFDVElWRSIsInNlcnZpY2VTdGF0dXMiOiJTVE9SQUdFLUFDVElWRSIsImlhdCI6MTUwNzc2NjM4MSwiZXhwIjo0NjYzNTI2MzgxLCJpc3MiOiJhcGkuaGFud2hhc2VjdXJpdHktdnNhYXMuY29tIiwianRpIjoiM2YzYmNiMDAtYWVlMC0xMWU3LWFkZTMtYTUxMDViM2ViZjIyIn0.a_E2c-5cqfu3NWTNQnEbuBNo4vRoq9Z2BsrlDMizxHTrndAehrF7BQOvgGk1DfmZsGZfcAX_fNSodNbkgtVjLaRhcegt2JuaCZ9SMOtBeNboOGGsvy3N1iA2eu04S7qVkqlAcg7UCMKU8SgutN8UhEyr7jsd8XX7t7oGhagpH2Z35xeCm9M19dZX_4YTleXiIjIbCP5MBy5JURHG0nDvrQUq4DH2FkmdtmWz3PqbbxrP0fzl3QuL7h6IdiUXOWSMf5xvVp8cI1HfU7ZznPXoSSrKXZoN3uf4dthwJgIQL8iBDrgSn81i-yeUdxMcl5-7wVkW8hX6oQPR-DJ6O_kI0w",
    "hbtwh-mobile05-1234-11e7-9983-adfa7ff293a5" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJoYnR3aC1tb2JpbGUwNS0xMjM0LTExZTctOTk4My1hZGZhN2ZmMjkzYTUiLCJ0eXBlIjoidXNlciIsIndpZCI6IjVtb2JpbGUwNSIsInByb2R1Y3RJZCI6Im1vYmlsZS1hbmRyb2lkLWlwaG9uZTdwbHVzIiwidXNlclN0YXR1cyI6IkFDVElWRSIsInNlcnZpY2VTdGF0dXMiOiJTVE9SQUdFLUFDVElWRSIsImlhdCI6MTUwNzc2NjQ0MSwiZXhwIjo0NjYzNTI2NDQxLCJpc3MiOiJhcGkuaGFud2hhc2VjdXJpdHktdnNhYXMuY29tIiwianRpIjoiNjMxZTU4ZDAtYWVlMC0xMWU3LWFkZTMtYTUxMDViM2ViZjIyIn0.LOyAfTEvnCyqIP_zWZ6fTkGVyUHxi5ZzzhXt8v-MEE1qXXOhoFuBO9AYUJrnJpeHq0wb6CoH-LqdyXKmMwc7lCudA-e798JLLUSX-3n1pn3qzQMNcjrxGpgwo7eExrFkYNsZ-19xdovg12-mVdX4cFETAEsS7ObakqmaRM4frXyi4cdnF2smRrhzsXYAYHTJiDzQ85qYBBNN__kVhooiv4yCaqxonK3QndKz3HEL_iYZJ-t5p7T7HyVBpkyTtnU_5skoQBPQ89KyJIlBfFrc58RPxOdf_NZ4Kf43hLx6iZpPFpel8C-hYmSlDBpMGE0j2rBe1NgN8-kOoHqErVqw4Q",
    "hbtwh-mobile06-1234-11e7-9983-adfa7ff293a5" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJoYnR3aC1tb2JpbGUwNi0xMjM0LTExZTctOTk4My1hZGZhN2ZmMjkzYTUiLCJ0eXBlIjoidXNlciIsIndpZCI6IjZtb2JpbGUwNiIsInByb2R1Y3RJZCI6Im1vYmlsZS1hbmRyb2lkLWlwaG9uZTdwbHVzIiwidXNlclN0YXR1cyI6IkFDVElWRSIsInNlcnZpY2VTdGF0dXMiOiJTVE9SQUdFLUFDVElWRSIsImlhdCI6MTUwNzc2NjQ1NywiZXhwIjo0NjYzNTI2NDU3LCJpc3MiOiJhcGkuaGFud2hhc2VjdXJpdHktdnNhYXMuY29tIiwianRpIjoiNmM1ZTgyZDAtYWVlMC0xMWU3LWFkZTMtYTUxMDViM2ViZjIyIn0.GRBle_W3y0Ncxs-QivXdWEdUx-WWqEZzdlc9n8a6oDwb5EUeIe9tSEbvr_RT25_eBiNDhgCwXCrra_G6KzeFaZzf5lR4NT2RganV9v68y5vwaGIeUs7J2SGOibM5YRx7elMM-eVkVnIuxILnxcXn8fGJ3SRCA1anBdAGA9zwJurMt7JLwMnM2ODUfadlTZhDpbS3nSrXz9siigGR85Tqqhw1I6N96f5RuA32y-AefxJxScDuTxYfIq8NTR0iSkBkaUDiM538eTjoXbsXRLVA4E8HWrkuIFF-4Zqjxwea8QeMxmvQFpAso01f2Han9HAg2Cf3GGzC6cB3dSoy-zByiA",
    "hbtwh-mobile07-1234-11e7-9983-adfa7ff293a5" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJoYnR3aC1tb2JpbGUwNy0xMjM0LTExZTctOTk4My1hZGZhN2ZmMjkzYTUiLCJ0eXBlIjoidXNlciIsIndpZCI6Ijdtb2JpbGUwNyIsInByb2R1Y3RJZCI6Im1vYmlsZS1hbmRyb2lkLWlwaG9uZTdwbHVzIiwidXNlclN0YXR1cyI6IkFDVElWRSIsInNlcnZpY2VTdGF0dXMiOiJTVE9SQUdFLUFDVElWRSIsImlhdCI6MTUwNzc2NjUyMSwiZXhwIjo0NjYzNTI2NTIxLCJpc3MiOiJhcGkuaGFud2hhc2VjdXJpdHktdnNhYXMuY29tIiwianRpIjoiOTJmOTJiYzAtYWVlMC0xMWU3LWFkZTMtYTUxMDViM2ViZjIyIn0.XdPRK4nN_UtL3mvTvzAjukwXqwUl_cQLhPbWEGbbwJsy5CW06oWKA41KSl6CIC-_5PQN0HhYtJ2ES80gpNE6ou9Re5nCbfYupFvXGncderFRjvXMJ397cTaumd4lxEiNUC0zmKS4Gx5WRsJ7cvrdKKkqJ3iIC9_6UOdv_C3KsfaK4BuP136B7IwdS9WXQnSqiQ9v2Xqm0SzV3Q18TxYV-dcvfTS3ZiX3QYPDv6_7mC3f560K6CokTQ14wSnrtFAjaXiVh7MNFfjBDjcKv-pqge7rEIAD-bkt8JmWL9fmLT-7gx4yoq5_HL7l2lK-0FE8rjNjBGjzZzgZs5E_vUE7nQ",
    "hbtwh-mobile08-1234-11e7-9983-adfa7ff293a5" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJoYnR3aC1tb2JpbGUwOC0xMjM0LTExZTctOTk4My1hZGZhN2ZmMjkzYTUiLCJ0eXBlIjoidXNlciIsIndpZCI6Ijhtb2JpbGUwOCIsInByb2R1Y3RJZCI6Im1vYmlsZS1hbmRyb2lkLWlwaG9uZTdwbHVzIiwidXNlclN0YXR1cyI6IkFDVElWRSIsInNlcnZpY2VTdGF0dXMiOiJTVE9SQUdFLUFDVElWRSIsImlhdCI6MTUwNzc2NjQ4NSwiZXhwIjo0NjYzNTI2NDg1LCJpc3MiOiJhcGkuaGFud2hhc2VjdXJpdHktdnNhYXMuY29tIiwianRpIjoiN2Q4MWI3ZDAtYWVlMC0xMWU3LWFkZTMtYTUxMDViM2ViZjIyIn0.XO77BGSoG4v16iaeg3NlI06iSrsdkzeCWwwc0k8xrpq2G7-7FU6_lLqFW0UmT7z8vuREe6rntw5iqVhF2OFDA74sHtN8suU3xXU3PHPTk-Ye2LGoqZSk1HBETML_6zH0Hzkx9y12bUl9l_l96ns9Z3VV6wnjJ8w_vBSYbhMKxthxTgBbpvHQPdFD5cKtRNjpc_dr_TIIJlN3MsAOI-CklgPTEOlu082zijL1xqfpedoVgXsclW_kvld_-y-We9VReu1VkuUtOkFV969ZQ4NAA90-dK_Stm7hR7TXHaEE75POi0Km842DJ9Z5Y2bPM09PeGxuGmd1sP6XMjZEQDVScQ",
    };

router.get('/camera', function(req, res) {
    var query = url.parse(req.url,true).query;
    var serialId = query.serial;

    if(serialId) {
        console.log("open camera serial id : " + serialId);
        res.render('camera', {
            serial : serialId,
            devicePassword  : serials[serialId],
        });
    } else {
        res.send('<br /><br /> Please enter a valid url. <br /><br /> '
            + '/camera?serial=[serial]');
    }
});

router.get('/viewer', function (req, res) {
    var query = url.parse(req.url,true).query;
    var user = query.user;

    if(user) {
        res.render('viewer', {
            user : user,
        });
    } else {
        res.send('<br /><br /> Please enter a valid url. <br /><br /> '
            + '/viewer?user=[userName]');
    }
});

router.get('/mqttconnect', function (req, res) {
        res.render('connectManager', {
            serials : serials,
        });
});

module.exports = router;
