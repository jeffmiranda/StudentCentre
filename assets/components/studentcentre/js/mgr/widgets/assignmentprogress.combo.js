StudentCentre.combo.AssignmentProgress = function(config) {
    config = config || {};
    Ext.applyIf(config, {
     fieldLabel: _('studentcentre.ass_progress')
    ,name: 'progress'
    ,width: 300
    ,hiddenName: 'progress'
    ,emptyText: 'Select progress...'
    ,typeAhead: true
    ,valueField: 'progress'
    ,displayField: 'progress'
    ,fields: ['progress']
    ,url: StudentCentre.config.connectorUrl
    ,baseParams: {
        action: 'mgr/assignments/scAssignmentProgressGetList'
    }
    });
    
    StudentCentre.combo.AssignmentProgress.superclass.constructor.call(this, config);
};
 
Ext.extend(StudentCentre.combo.AssignmentProgress, MODx.combo.ComboBox);
Ext.reg('assignment-combo-progress', StudentCentre.combo.AssignmentProgress);