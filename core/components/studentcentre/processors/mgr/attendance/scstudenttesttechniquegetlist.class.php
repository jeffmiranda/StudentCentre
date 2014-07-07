<?php
class scStudentTestTechniqueGetListProcessor extends modObjectGetListProcessor {
    
    public $classKey = 'scStudentTestTechnique';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'last_modified';
    public $defaultSortDirection = 'DESC';
    public $objectType = 'studentcentre.att';
    
	public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scStudentTest', 'StudentTest', array (
			'scStudentTestTechnique.student_test_id = StudentTest.id'
		));
		
		$studentId = $this->getProperty('student_id');
		$levelId = $this->getProperty('level_id');
		$techniqueId = $this->getProperty('technique_id');
		$commentsOnly = $this->getProperty('commentsOnly');
	    if (!empty($studentId) && !empty($levelId) && !empty($techniqueId)) {
	        $c->where(array(
	            'StudentTest.student_id:=' => $studentId
	            ,'AND:StudentTest.level_id:=' => $levelId
	            ,'AND:scStudentTestTechnique.technique_id:=' => $techniqueId
	        ));
	    }
	    if (!empty($commentsOnly)) {
	        $c->where(array(
	            'AND:scStudentTestTechnique.comment:!=' => ''
	        ));
	    }

		$c->select(array('
			scStudentTestTechnique.id AS `id`,
			scStudentTestTechnique.comment AS `comment`,
			scStudentTestTechnique.date_created AS `date_created`
		'));
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
	
	public function prepareRow(xPDOObject $object) {
	
        $ta = $object->toArray('', false, true, true);
        //$this->modx->log(1,print_r($ta,true));
        $attDate = strtotime($ta['date_created']);
        $displayDate = date("M d, Y", $attDate);
        $ta['date_created'] = $displayDate; //($ta['last_modified'] > 0) ? date('Y-m-d',$ta['last_modified']) : '';
        return $ta;
        
    }  
      
}

return 'scStudentTestTechniqueGetListProcessor';