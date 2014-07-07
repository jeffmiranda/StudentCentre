StudentCentre.panel.AssignmentsHome = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('studentcentre.ass')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true }
            ,border: true
            ,items: [{
                title: _('studentcentre.ass_active')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.ass_active_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-student-assignments'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.ass_enrollment')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.ass_enrollment_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-student-enrollment'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.ass_programs')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.ass_program_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-assignment-programs'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.ass_levels')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.ass_level_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-assignment-levels'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
	            title: _('studentcentre.ass_assignments')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('studentcentre.ass_assignments_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'studentcentre-grid-assignments'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            }]
            // only to redo the grid layout after the content is rendered
            // to fix overflow components' panels, especially when scroll bar is shown up
            ,listeners: {
                'afterrender': function(tabPanel) {
                    tabPanel.doLayout();
                }
            }
        }]
    });
    StudentCentre.panel.AssignmentsHome.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre.panel.AssignmentsHome,MODx.Panel);
Ext.reg('studentcentre-panel-home',StudentCentre.panel.AssignmentsHome);