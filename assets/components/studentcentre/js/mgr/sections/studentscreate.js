Ext.onReady(function() {
    MODx.load({
    	xtype: 'sc-students-page-create'
    });
});

StudentCentre.page.StudentsCreate = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        buttons: [{
            text: _('studentcentre.cancel')
            ,id: 'sc-btn-cancel-create'
            ,handler: function() {
                location.href = '?a='+StudentCentre.action+'&action=studentshome';
            }
            ,scope: this
        }]
        ,components: [{
            xtype: 'sc-students-panel-create'
            ,renderTo: 'sc-students-panel-create-div'
        }]
    });
    StudentCentre.page.StudentsCreate.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.page.StudentsCreate,MODx.Component);
Ext.reg('sc-students-page-create',StudentCentre.page.StudentsCreate);