<?php
require_once (dirname(__FILE__).'/scattendanceupdate.class.php');
class scAttendanceUpdateFromGridProcessor extends scAttendanceUpdateProcessor {

    public $classKey = 'scAttendance';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
    
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
    
    public function beforeSave() {
        
        $hours = $this->getProperty('hours');
        if (empty($hours)) {
            //$this->addFieldError('name',$this->modx->lexicon('studentcentre.ass_err_ns_ass_name'));
            $this->failure($this->modx->lexicon('studentcentre.att_err_ns_hours'));
        }
        return parent::beforeSave();
        
    }
        
}
return 'scAttendanceUpdateFromGridProcessor';