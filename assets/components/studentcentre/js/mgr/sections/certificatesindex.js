Ext.onReady(function() {
    var activeTab = parseInt(MODx.request.activeTab);
    MODx.load({
    	xtype: 'sc-certificates-page-home'
    	,activeTab: activeTab
    });
});
 
StudentCentre.page.CertificatesHome = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'sc-certificates-panel-home'
            ,renderTo: 'sc-certificates-panel-home-div'
            ,activeTab: config.activeTab
        }]
    });
    StudentCentre.page.CertificatesHome.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.page.CertificatesHome,MODx.Component);
Ext.reg('sc-certificates-page-home',StudentCentre.page.CertificatesHome);