StudentCentre.combo.AssignmentStatus = function(config) {
    config = config || {};
    Ext.applyIf(config, {
     fieldLabel: _('studentcentre.ass_status')
    ,name: 'status'
    ,width: 300
    ,hiddenName: 'status'
    ,emptyText: 'Select status...'
    ,typeAhead: true
    ,valueField: 'status'
    ,displayField: 'status'
    ,fields: ['status']
    ,url: StudentCentre.config.connectorUrl
    ,baseParams: {
        action: 'mgr/assignments/scAssignmentStatusGetList'
    }
    });
    
    StudentCentre.combo.AssignmentStatus.superclass.constructor.call(this, config);
};
 
Ext.extend(StudentCentre.combo.AssignmentStatus, MODx.combo.ComboBox);
Ext.reg('assignment-combo-status', StudentCentre.combo.AssignmentStatus);