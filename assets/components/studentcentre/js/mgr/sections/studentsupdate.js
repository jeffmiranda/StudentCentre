Ext.onReady(function() {
    var sid = MODx.request.sid;
    MODx.load({
    	xtype: 'sc-students-page-update'
    	,studentId: sid
    });
});

StudentCentre.page.StudentsUpdate = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        buttons: [{
            text: _('studentcentre.cancel')
            ,id: 'sc-btn-cancel-update'
            ,handler: function() {
                location.href = '?a='+StudentCentre.action+'&action=studentshome';
            }
            ,scope: this
        }]
        ,components: [{
            xtype: 'sc-students-panel-update'
            ,renderTo: 'sc-students-panel-update-div'
            ,studentId: config.studentId
        }]
    });
    StudentCentre.page.StudentsUpdate.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.page.StudentsUpdate,MODx.Component);
Ext.reg('sc-students-page-update',StudentCentre.page.StudentsUpdate);