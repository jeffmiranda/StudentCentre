var StudentCentre = function(config) {
    config = config || {};
    StudentCentre.superclass.constructor.call(this,config);
};
Ext.extend(StudentCentre,Ext.Component,{
    page:{},window:{},grid:{},tree:{},container:{},panel:{},combo:{},config:{},tabs:{},store:{},toolbar:{}
});
Ext.reg('studentcentre',StudentCentre);
StudentCentre = new StudentCentre();