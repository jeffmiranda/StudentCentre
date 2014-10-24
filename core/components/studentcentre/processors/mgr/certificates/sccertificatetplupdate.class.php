<?php
class scCertificateTplUpdateProcessor extends modObjectUpdateProcessor {

    public $classKey = 'scCertificateTpl';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.certificate_tpl';
    
    public function beforeSet() {
    
        $toggleActive = $this->getProperty('toggleActive');
        if (!empty($toggleActive)) {
	        if ($this->object->get('active') == 1) {
		        $this->setProperty('active', 0);
	        } else {
		        $this->setProperty('active', 1);
	        }
        }
        
        return parent::beforeSet();
    }
    
    public function beforeSave() {
	    
        if (!empty($_FILES['tpl']) && !empty($_FILES['tpl']['tmp_name']) && !empty($_FILES['tpl']['name']) && $_FILES['tpl']['error'] == UPLOAD_ERR_OK) {
		    $ext = substr($_FILES['tpl']['name'], strrpos($_FILES['tpl']['name'], '.') + 1);
		    /*
		     * Currently only .JPG is allowed but the below lines will allow for more
		     * $allowedExt = explode(',', $this->modx->getOption('upload_images', null, 'jpg,jpeg,png,gif'));
		     * if (!in_array($ext, $allowedExt)) {
		    */
		    if (strtolower($ext) != 'jpg') {
			    $this->addFieldError('tpl',$this->modx->lexicon('studentcentre.cert_err_tpl_file_type'));
		    }
		    $this->setProperty('ext', strtolower($ext));
		    
		    // Get destination directory and check if it exists. If not create it.
		    $filePath = $this->modx->getOption('studentcentre.assets_path', null, $this->modx->getOption('assets_path').'components/studentcentre/') . 'certificatetpl/' . $this->object->get('id') . '.' . $this->getProperty('ext');
		    if (!file_exists($filePath)) {
			    $this->modx->log(xPDO::LOG_LEVEL_ERROR, 'Could not find the file the following file to update: ' . $filePath);
			    return $this->failure($this->modx->lexicon('studentcentre.cert_err_upating_tpl'));
			}
			
			// Move uploaded file into destination directory
			if (!move_uploaded_file($_FILES['tpl']['tmp_name'], $filePath)) {
				$this->modx->log(xPDO::LOG_LEVEL_ERROR, 'Error trying to move uploaded file to ' . $filePath);
				return $this->failure($this->modx->lexicon('studentcentre.cert_err_upating_tpl'));
			}
		
	    }
                        
        return parent::beforeSave();
	    
    }
        
}
return 'scCertificateTplUpdateProcessor';