Ext.onReady(function() {
    var activeTab = parseInt(MODx.request.activeTab);
    MODx.load({
    	xtype: 'sc-students-page-home'
    	,activeTab: activeTab
    });
});
 
StudentCentre.page.StudentsHome = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'sc-students-panel-home'
            ,renderTo: 'sc-students-panel-home-div'
            ,activeTab: config.activeTab
        }]
    });
    StudentCentre.page.StudentsHome.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.page.StudentsHome,MODx.Component);
Ext.reg('sc-students-page-home',StudentCentre.page.StudentsHome);