<?php
class scCertificateGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scCertificate';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'date_created';
    public $defaultSortDirection = 'DESC';
    public $objectType = 'studentcentre.certificate';
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scModUser', 'Student', array (
			'scCertificate.student_id = Student.id'
		));
		$c->innerJoin('scCertificateTpl', 'CertificateTpl', array (
			'scCertificate.certificate_tpl_id = CertificateTpl.id'
		));
		$c->leftJoin('scClassLevel', 'ClassLevel', array (
			'CertificateTpl.level_id = ClassLevel.id'
		));
	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'CertificateTpl.type:LIKE' => '%'.$query.'%'
	            ,'OR:ClassLevel.name:LIKE' => '%'.$query.'%'
	            ,'OR:Student.username:LIKE' => '%'.$query.'%'
	        ));
	    }
	    	    
	    // if activeOnly parameter exists and equals 1,
		// then only get the active records
		$activeOnly = $this->getProperty('activeOnly');
		if (!empty($activeOnly)) {
	        $c->where(array(
	            'scCertificate.active' => $activeOnly
	        ));
	    }
	    
	    $c->select(array('
			scCertificate.*
			,CertificateTpl.level_id
			,CertificateTpl.type AS `certificate_tpl_type`
			,ClassLevel.name AS `level_name`
			,Student.username
		'));
					    
		$c->prepare();
		$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
	    return $c;
	    
	}
    
    public function prepareRow(xPDOObject $object) {
	
        $ta = $object->toArray('', false, true, true);
        //$this->modx->log(1,print_r($ta,true));
        $timePosted = strtotime($ta['last_modified']);
        $displayTime = date("M d, Y - g:i a", $timePosted);
        $ta['last_modified'] = $displayTime; //($ta['last_modified'] > 0) ? date('Y-m-d',$ta['last_modified']) : '';
        return $ta;
        
    }  

    
}

return 'scCertificateGetList';