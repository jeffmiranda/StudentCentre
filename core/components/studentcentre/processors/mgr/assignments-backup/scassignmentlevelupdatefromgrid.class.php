<?php
require_once (dirname(__FILE__).'/scassignmentlevelupdate.class.php');
class scAssignmentLevelUpdateFromGridProcessor extends scAssignmentLevelUpdateProcessor {

    public $classKey = 'scAssignmentLevel';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.ass';
    
    public function initialize() {
    
	    $data = $this->getProperty('data');
	    if (empty($data)) {
	    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'The $data variable is empty.');
	    	return $this->modx->lexicon('studentcentre.ass_err_invalid_data');
	    }
	    $data = $this->modx->fromJSON($data);
	    if (empty($data)) {
	    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'The $data variable is empty after running fromJSON.');
	    	return $this->modx->lexicon('studentcentre.ass_err_invalid_data');
	    }
	    $this->setProperties($data);
	    $this->unsetProperty('data');
	    return parent::initialize();
	    
    }
        
}
return 'scAssignmentLevelUpdateFromGridProcessor';