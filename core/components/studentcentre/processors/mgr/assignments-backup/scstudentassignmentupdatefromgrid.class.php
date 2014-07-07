<?php

require_once (dirname(__FILE__).'/scstudentassignmentupdate.class.php');

class scStudentAssignmentUpdateFromGridProcessor extends scStudentAssignmentUpdateProcessor {

    public function initialize() {
    
        $data = $this->getProperty('data');
        if (empty($data)) return $this->modx->lexicon('studentcentre.ass_err_invalid_data');
        $data = $this->modx->fromJSON($data);
        if (empty($data)) return $this->modx->lexicon('studentcentre.ass_err_invalid_data');
        $this->setProperties($data);
        $this->unsetProperty('data');
 
        return parent::initialize();
    }
        
}
return 'scStudentAssignmentUpdateFromGridProcessor';