Ext.onReady(function() {
    MODx.load({ xtype: 'studentcentre-assignments-page-home'});
});
 
StudentCentre.page.AssignmentsHome = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'studentcentre-panel-home'
            ,renderTo: 'sc-assignments-panel-home-div'
        }]
    });
    StudentCentre.page.AssignmentsHome.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.page.AssignmentsHome,MODx.Component);
Ext.reg('studentcentre-assignments-page-home',StudentCentre.page.AssignmentsHome);