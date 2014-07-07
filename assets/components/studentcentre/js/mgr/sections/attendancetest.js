Ext.onReady(function() {
    var testData = decodeURIComponent(MODx.request.data);
    testData = Ext.util.JSON.decode(testData);
    MODx.load({
    	xtype: 'sc-attendance-page-test'
    	,testData: testData
    });
});

StudentCentre.page.AttendanceTest = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        buttons: [{
            text: _('studentcentre.att_stop_test')
            ,id: 'sc-btn-stop-test'
            ,handler: function() {
                location.href = '?a='+StudentCentre.action+'&action=attendancehome&activeTab=1';
            }
            ,scope: this
        }]
        ,components: [{
            xtype: 'sc-attendance-panel-test'
            ,renderTo: 'sc-attendance-panel-test-div'
            ,testData: config.testData
        }]
    });
    StudentCentre.page.AttendanceTest.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.page.AttendanceTest,MODx.Component);
Ext.reg('sc-attendance-page-test',StudentCentre.page.AttendanceTest);