<?php
/**
 * Student Centre
 *
 * Copyright 2013 by Jeff Miranda <me@jeffmiranda.com>
 *
 * This file is part of Student Centre.
 *
 * Student Centre is NOT free software; you cannot redistribute it 
 * and/or modify it in any way.
 *
 * @package studentcentre
 */

require(dirname(dirname(dirname(dirname(__FILE__)))).'/fpdf/japanese.php');
class Certificate extends PDF_Japanese {
	
	// Page header
	function Header() { }
	
	// Page footer
	function Footer() { }
	
	// Set template image
	function setTpl(string $path) {
		if (file_exists($path)) {
			$this->Image($path, 0, 0, 792);
			return true;
		} else {
			return false;
		}
	}
	
	// Set name
	function setName(string $name) {
		$this->SetXY(346,220);
		$this->SetFont('Helvetica', '', 48);
		$this->Cell(100, 50, $name, 0, 0, 'C');
	}
	
	// Set anniversary
	function setAnniversary(int $years) {
		
		// do something

	}
	
	// Set hours
	function setHours(float $hours) {
		
		$this->SetXY(346, 395);
		$this->SetFont('Helvetica', 'B', 48);
		$this->Cell(100, 50, $hours, 0, 0, 'C');

	}
	
	// Set date
	function setDate(string $date) {
		
		$this->SetXY(638, 505);
		$this->SetFont('Helvetica', '', 14);
		$this->Cell(100, 50, $date, 0, 0, 'R');

	}
}


class scCertificateGenerateProcessor extends modProcessor {
    public function checkPermissions() { return true; }
    public function getLanguageTopics() { return array('studentcentre:default'); }

    public function process() {
        $cId = $this->getProperty('cid');
        if (!empty($cId)) {
            $o = $this->generate($cId);
            if (!$o) {
            	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Certificate failed to generate!');
	            $o = $this->failure($this->modx->lexicon('studentcentre.cert_err_generation'));
            }
        } else {
        	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Certificate ID was empty!');
            $o = $this->failure($this->modx->lexicon('studentcentre.cert_err_generation'));
        }
        return $o;
    }

    /**
     * Generate the certificate
     * 
     * @param int $cId
     * @return mixed
     */
    public function generate($cId) {
    	
    	// get the certificate objects
    	$certObj = $this->modx->getObject('scCertificate', $cId);
    	if (!$certObj) {
	    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the certificate object!');
	    	return false;
    	}
    	$tplObj = $certObj->getOne('CertificateTpl');
    	if (!$tplObj) {
	    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the certificate template object!');
	    	return false;
    	}
    	$student = $certObj->getOne('Student');
    	if (!$student) {
	    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the student object!');
	    	return false;
    	}
    	$studentProfile = $student->getOne('StudentProfile');
    	if (!$studentProfile) {
	    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the student profile object!');
	    	return false;
    	}
    	
    	// Create certificate
    	$certificate = new Certificate('L', 'pt', 'Letter');
		$certificate->AliasNbPages();
		$certificate->AddPage('L', 'Letter');
		$certificate->SetMargins(0, 0);
		$certificate->SetFont('Helvetica','',15);
		
		// set template
		$tplDir = $this->modx->getOption('studentcentre.assets_path', null, $this->modx->getOption('assets_path').'components/studentcentre/') . 'certificatetpl/';
		$fullPath = $tplDir . $tplObj->get('id') . '.jpg';
		if (!$certificate->setTpl($fullPath)) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not find the template file!');
	    	return false;
		}
		
		// set name
		$certificate->setName($studentProfile->get('firstname') . ' ' . $studentProfile->get('lastname'));
		
		// set value depending on type
		$type = $tplObj->get('type');
		switch ($type) {
			case 'ANNIVERSARY':
				$certificate->setAnniversary($certObj->get('anniversary'));
				break;
			case 'HOUR':
				$certificate->setHours($certObj->get('hours'));
				break;
			case 'LEVEL':
				// do something?
				break;
		}
		
		// set date
		$date = $certObj->get('date_created');
		$date = strtotime($date);
        $displayDate = date("F, Y", $date);
		$certificate->setDate($displayDate);
		
		// toggle certificate flag
		$certObj->set('flag', 0);
		if (!$certObj->save()) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the certificate object after toggling flag!');
	    	return false;
		}
		
		// set headers and get ready to output!
		header('Content-type: application/pdf');
        header('Content-Disposition: attachment; filename="certificate.pdf"');
		return $certificate->Output('certificate.pdf', 'I');

    }

}
return 'scCertificateGenerateProcessor';