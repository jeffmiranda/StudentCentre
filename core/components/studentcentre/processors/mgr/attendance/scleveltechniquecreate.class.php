<?php
class scLevelTechniqueCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scLevelTechnique';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.att';
 
    public function beforeSet() {
    
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
    
    }
    
    public function beforeSave() {
        
        $levelId = $this->getProperty('level_id');
        if (empty($levelId)) {
            $this->addFieldError('level_id',$this->modx->lexicon('studentcentre.att_err_ns_level_id'));
        }
        
        $techniqueId = $this->getProperty('technique_id');
        if (empty($techniqueId)) {
            $this->addFieldError('technique_id',$this->modx->lexicon('studentcentre.att_err_ns_technique_id'));
        }
        
        $order = $this->getProperty('order');
        if (!is_numeric($order)) {
            $this->addFieldError('order',$this->modx->lexicon('studentcentre.att_err_ns_order'));
        }
        
        return parent::beforeSave();
        
    }
}
return 'scLevelTechniqueCreateProcessor';