<?php
class scCertificateTplRemoveProcessor extends modObjectRemoveProcessor {

    public $classKey = 'scCertificateTpl';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.certificate_tpl';
    
    public function afterRemove() {
    
    	//Delete the template file from the filesystem
    	$tplId = $this->object->get('id');
    	$filePath = $this->modx->getOption('studentcentre.assets_path', null, $this->modx->getOption('assets_path').'components/studentcentre/') . 'certificatetpl/' . $tplId . '.jpg';
	    if (file_exists($filePath)) {
	    	// Delete the file
	    	if (!unlink($filePath)) {
		    	$this->modx->log(xPDO::LOG_LEVEL_ERROR, 'Could not delete the following file: ' . $filePath);
	    	}
		} else {
			$this->modx->log(xPDO::LOG_LEVEL_ERROR, 'Could not find the following file to delete: ' . $filePath);
		}
	    
	    return parent::afterRemove();
    }
            
}
return 'scCertificateTplRemoveProcessor';