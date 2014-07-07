Ext.onReady(function() {
    var activeTab = parseInt(MODx.request.activeTab);
    MODx.load({
    	xtype: 'sc-attendance-page-home'
    	,activeTab: activeTab
    });
});
 
StudentCentre.page.AttendanceHome = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'sc-attendance-panel-home'
            ,renderTo: 'sc-attendance-panel-home-div'
            ,activeTab: config.activeTab
        }]
    });
    StudentCentre.page.AttendanceHome.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.page.AttendanceHome,MODx.Component);
Ext.reg('sc-attendance-page-home',StudentCentre.page.AttendanceHome);