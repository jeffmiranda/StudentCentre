<?php
class scAssignmentProgressGetListProcessor extends modObjectGetListProcessor {
    
    public $classKey = 'scAssignmentProgress';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'progress';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';
    
}

return 'scAssignmentProgressGetListProcessor';