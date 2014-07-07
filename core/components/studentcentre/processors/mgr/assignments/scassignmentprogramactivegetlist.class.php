<?php
class scAssignmentProgramActiveGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scAssignmentProgram';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.ass';

	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    
        $c->where(array('active' => 1));
        return $c;
	    
	}
    
}

return 'scAssignmentProgramActiveGetList';