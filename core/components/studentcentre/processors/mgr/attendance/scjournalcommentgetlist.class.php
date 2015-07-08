<?php
class scJournalCommentGetList extends modObjectGetListProcessor {
    
    public $classKey = 'scJournalComment';
    public $languageTopics = array('studentcentre:default');
    public $defaultSortField = 'date_created';
    public $defaultSortDirection = 'DESC';
    public $objectType = 'scJournalComment';
    
    public function prepareQueryBeforeCount(xPDOQuery $c) {
	    	    
	    $journalId = $this->getProperty('journalId');
	    if ($journalId) {
			$c->where(array('scJournalComment.id:=' => $journalId));
	    }
	    
	    $query = $this->getProperty('query');
	    if (!empty($query)) {
	        $c->where(array(
	            'scJournalComment.comment:LIKE' => '%'.$query.'%'
	        ));
	    }
	    
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

return 'scJournalCommentGetList';