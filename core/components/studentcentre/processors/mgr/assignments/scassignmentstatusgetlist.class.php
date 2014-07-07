<?php
class scAssignmentStatusGetListProcessor extends modObjectGetListProcessor {
    
    public $classKey = 'scAssignmentStatus';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'status';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';
    
}

return 'scAssignmentStatusGetListProcessor';