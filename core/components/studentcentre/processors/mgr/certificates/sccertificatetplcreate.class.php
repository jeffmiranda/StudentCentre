<?php
class scCertificateTplCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'scCertificateTpl';
    public $languageTopics = array('studentcentre:default');
    public $objectType = 'studentcentre.certificate';
 
    public function beforeSet() {
    
		$date = date('Y-m-d');
		$this->setProperty('date_created',$date);
		return parent::beforeSet();
    
    }
    
    public function beforeSave() {
        
        $typeId = $this->getProperty('certificate_type_id');
        if (empty($typeId)) {
            $this->addFieldError('certificate_type_id',$this->modx->lexicon('studentcentre.cert_err_ns_tpl_type'));
        }
        
        // get the certificate type object
		$certType = $this->modx->getObject('scCertificateType', $typeId);
		if (!$certType) {
			$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the certificate type object.');
			return $modx->error->failure($modx->lexicon('studentcentre.cert_err_ns_tpl_type'));
		}
		
	    // if template type is ANNIVERSARY or HOUR
	    // There can only be one of these types
        if (($certType->get('name') == 'Anniversary') || ($certType->get('name') == 'Hour')) {
	        $certTplNum = $this->modx->getCount('scCertificateTpl', array(
	        	'certificate_type_id' => $typeId
	        ));
	        if ($certTplNum > 0) {
	            $this->addFieldError('certificate_type_id',$this->modx->lexicon('studentcentre.cert_err_tpl_type_exists'));
	        }

        // if template type is LEVEL
        // There can only be one template per level
        } elseif ($certType->get('name') == 'Level') {
        	$levelId = $this->getProperty('level_id');
	        if (($levelId == 0) || empty($levelId)) {
		    	$this->addFieldError('level_id',$this->modx->lexicon('studentcentre.cert_err_ns_level_id'));
	        } else {
		        $certTplNum = $this->modx->getCount('scCertificateTpl', array(
		        	'certificate_type_id' => $typeId
		        	,'level_id' => $levelId
		        ));
		        if ($certTplNum > 0) {
		            $this->addFieldError('level_id',$this->modx->lexicon('studentcentre.cert_err_tpl_level_id_exists'));
		        }
	        }
	    }
        
        if (empty($_FILES['tpl']) || empty($_FILES['tpl']['tmp_name']) || empty($_FILES['tpl']['name']) || $_FILES['tpl']['error'] != UPLOAD_ERR_OK) {
		    $this->addFieldError('tpl',$this->modx->lexicon('studentcentre.cert_err_ns_tpl_file'));
	    } else {
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
	    }
                        
        return parent::beforeSave();
        
    }
        
    public function afterSave() {

	    $destinationDir = $this->modx->getOption('studentcentre.assets_path', null, $this->modx->getOption('assets_path').'components/studentcentre/') . 'certificatetpl/';
	    
	    // Check if the destination directory exists. If not create it.
	    if (!file_exists($destinationDir)) {
		    if (!mkdir($destinationDir, 0777, true)) {
			    $this->modx->log(xPDO::LOG_LEVEL_ERROR, 'Error trying to create the certificatetpl directory: ' . $destinationDir);
			    return false;
		    }
		}
		
		// Move uploaded file into destination directory
		if (!move_uploaded_file($_FILES['tpl']['tmp_name'], $destinationDir . $this->object->get('id') . '.' . $this->getProperty('ext'))) {
			$this->modx->log(xPDO::LOG_LEVEL_ERROR, 'Error trying to move uploaded file to ' . $destinationDir . $this->object->get('id') . '.' . $this->getProperty('ext'));
			return false;
		}
		
	    return parent::afterSave();
	    
    }
    
}
return 'scCertificateTplCreateProcessor';