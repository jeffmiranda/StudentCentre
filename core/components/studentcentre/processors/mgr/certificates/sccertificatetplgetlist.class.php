<?php
class scCertificateTplGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scCertificateTpl';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'id';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.certificate_tpl';
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scCertificateType', 'CertificateType', array (
			'scCertificateTpl.certificate_type_id = CertificateType.id'
		));
		
		$c->leftJoin('scClassLevel', 'ClassLevel', array (
			'scCertificateTpl.level_id = ClassLevel.id'
		));
	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'scCertificateTpl.description:LIKE' => '%'.$query.'%'
	            ,'OR:CertificateType.name:LIKE' => '%'.$query.'%'
	            ,'OR:ClassLevel.name:LIKE' => '%'.$query.'%'
	        ));
	    }
	    	    
	    // if activeOnly parameter exists and equals 1,
		// then only get the active records
		$activeOnly = $this->getProperty('activeOnly');
		if (!empty($activeOnly)) {
	        $c->where(array(
	            'scCertificateTpl.active' => $activeOnly
	        ));
	    }
	    
	    $c->select(array('
			scCertificateTpl.*
			,CertificateType.name AS `certificate_type`
			,ClassLevel.name AS `level_name`
		'));
					    
		//$c->prepare();
		//$this->modx->log(1,print_r('SQL Statement: ' . $c->toSQL(),true));
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

return 'scCertificateTplGetList';