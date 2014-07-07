<?php
class scLevelTechniqueGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scLevelTechnique';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'level_id';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'studentcentre.att';
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $c->innerJoin('scClassLevel', 'ClassLevel', array (
			'scLevelTechnique.level_id = ClassLevel.id'
		));
		$c->innerJoin('scTechnique', 'Technique', array (
			'scLevelTechnique.technique_id = Technique.id'
		));
	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'ClassLevel.name:LIKE' => '%'.$query.'%'
	            ,'OR:Technique.name:LIKE' => '%'.$query.'%'
	        ));
	    }
	    	    
	    $c->select(array('
			scLevelTechnique.*
			,ClassLevel.name AS `level_name`
			,Technique.name AS `technique_name`
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

return 'scLevelTechniqueGetList';