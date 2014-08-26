<?php
class scStudentAssignmentCommentsGetListProcessor extends modObjectGetListProcessor {
    
    public $classKey = 'scComment';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'date_created';
    public $defaultSortDirection = 'DESC';
    public $objectType = 'studentcentre.ass';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scModUser', 'Student', array (
			'scComment.user_id = Student.id'
		));
		
		$id = $this->getProperty('id');
        if(!empty($id)){
            $c->where(array(
                'student_assignment_id:='=> $id
            ));
            //$this->modx->log(1,print_r('ID: ' . $id,true));
        }

		$c->select(array('
			scComment.*
			,Student.username
		'));

	    return $c;
	    
	}
	
	public function prepareRow(xPDOObject $object) {
	
        $ta = $object->toArray('', false, true, true);
        //$this->modx->log(1,print_r($ta,true));
        $timePosted = strtotime($ta['date_created']);
        $displayTime = date("M d, Y - g:i a", $timePosted);
        $ta['date_created'] = $displayTime; //($ta['last_modified'] > 0) ? date('Y-m-d',$ta['last_modified']) : '';
        return $ta;
        
    }  
      
}

return 'scStudentAssignmentCommentsGetListProcessor';