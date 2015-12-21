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
	function setTpl($path) {
		if (file_exists($path)) {
			$this->Image($path, 0, 0, 1224);
			return true;
		} else {
			return false;
		}
	}
	
	// Set name
	function setName($name) {
		$this->SetXY(562, 310);
		$this->SetFont('Helvetica', '', 56);
		$this->Cell(100, 50, $name, 0, 0, 'C');
	}
	
	// Set anniversary
	function setAnniversary($years, $anniversaryDate) {
		
		// set the anniversary year
		$this->SetXY(562, 520);
		$this->SetFont('Helvetica', 'B', 72);
		$this->Cell(100, 50, $years, 0, 0, 'C');
		
		// set the anniversary footer text
		$this->SetXY(562, 590);
		$this->SetFont('Helvetica', '', 38);
		$plural = '';
		if ($years > 1) $plural = 's';
		$this->Cell(100, 50, "year$plural of sincere training.", 0, 0, 'C');
		
		// set the anniversary date
		$this->SetXY(1041, 685);
		$this->SetFont('Helvetica', '', 22);
		$this->Cell(100, 50, $anniversaryDate, 0, 0, 'R');

	}
	
	// Set hours
	function setHours($hours) {
		
		$this->SetXY(562, 520);
		$this->SetFont('Helvetica', 'B', 72);
		$this->Cell(100, 50, $hours, 0, 0, 'C');

	}
	
	// Set date
	function setDate($date) {
		
		$this->SetXY(1041, 685);
		$this->SetFont('Helvetica', '', 22);
		$this->Cell(100, 50, $date, 0, 0, 'R');

	}
}


class scCertificateGenerateProcessor extends modProcessor {
    public function checkPermissions() { return true; }
    public function getLanguageTopics() { return array('studentcentre:default'); }

    public function process() {
        //$this->g
        $cId = $this->getProperty('cid');
        $cIds = explode(",", $cId);
        if (!empty($cId)) {
            if (sizeof($cIds) > 1) {

                $this->clearCertificateFolder();

                // there was more than one certificate to generate so loop
                foreach ($cIds as $currentId)
                    $o = $this->generate($currentId, false);
                if ($o === false) {
                    $this->modx->log(modX::LOG_LEVEL_ERROR, 'Certificate failed to generate!');
                    $o = $this->failure($this->modx->lexicon('studentcentre.cert_err_generation'));
                }
                $this->ZipAndDownload();
            }
            else {
                // there was only one certificate to generate
                $o = $this->generate($cId, true);
                if ($o === false) {
                    $this->modx->log(modX::LOG_LEVEL_ERROR, 'Certificate failed to generate!');
                    $o = $this->failure($this->modx->lexicon('studentcentre.cert_err_generation'));
                }
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
     * @param bool $download
     * @return mixed
     */
    public function generate($cId, $download) {
    	
    	// get the certificate objects
    	$certObj = $this->modx->getObject('scCertificate', $cId);
    	if (!$certObj) {
	    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the certificate object with ID: ' . $cId);
	    	return false;
    	}
    	$student = $certObj->getOne('Student');
    	if (!$student) {
	    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the student object! Certificate ID: ' . $cId . '; Student ID: ' . $certObj->get('student_id'));
	    	return false;
    	}
    	$studentProfile = $student->getOne('StudentProfile');
    	if (!$studentProfile) {
	    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the student profile object! Certificate ID: ' . $cId . '; Student ID: ' . $certObj->get('student_id'));
	    	return false;
    	}
    	$certType = $certObj->getOne('CertificateType');
    	if (!$certType) {
	    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the certificate type object! Certificate ID: ' . $cId . '; Student ID: ' . $certObj->get('student_id'));
	    	return false;
    	}
    	
    	// get the certificate template
    	$typeName = $certType->get('name');
    	switch (strtolower($typeName)) {
			case 'anniversary':
				$certTpl = $this->modx->getObject('scCertificateTpl', array('certificate_type_id' => $certType->get('id')));
				if (!$certTpl) {
			    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the anniversary template object! Certificate ID: ' . $cId . '; Student ID: ' . $certObj->get('student_id'));
			    	return false;
				}
				break;
			case 'hour':
				$certTpl = $this->modx->getObject('scCertificateTpl', array('certificate_type_id' => $certType->get('id')));
				if (!$certTpl) {
			    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the hour template object! Certificate ID: ' . $cId . '; Student ID: ' . $certObj->get('student_id'));
			    	return false;
				}
				break;
			case 'level':
				$certTpl = $this->modx->getObject('scCertificateTpl', array(
					'certificate_type_id' => $certType->get('id')
					,'level_id' => $certObj->get('level_id')
				));
				if (!$certTpl) {
			    	$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the level template object! Certificate ID: ' . $cId . '; Student ID: ' . $certObj->get('student_id'));
			    	return false;
				}
				break;
			default:
				$this->modx->log(modX::LOG_LEVEL_ERROR, 'Sorry, unknown certificate type!');
				return false;
		}

    	
    	// Create certificate
    	$certificate = new Certificate('L', 'pt', array(1224, 792));
		$certificate->AliasNbPages();
		$certificate->AddPage('L', array(1224, 792));
		$certificate->SetMargins(0, 0);
		$certificate->SetFont('Helvetica','',15);
		
		// set template
		$tplDir = $this->modx->getOption('studentcentre.assets_path', null, $this->modx->getOption('assets_path').'components/studentcentre/') . 'certificatetpl/';
		$fullPath = $tplDir . $certTpl->get('id') . '.jpg';
		if (!$certificate->setTpl($fullPath)) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not find the template file!');
	    	return false;
		}
		
		// set name
		$certificate->setName($studentProfile->get('firstname') . ' ' . $studentProfile->get('lastname'));
		
		// begin creating filename
		$fileName = 'certificate_' . strtolower($typeName) . '_';
		
		// prepare date created
		$date = $certObj->get('date_created');
		$date = strtotime($date);
		$displayDate = date("F, Y", $date);
		
		// set value depending on type
		switch (strtolower($typeName)) {
			case 'anniversary':
				$startDate = $studentProfile->get('start_date');
				if (empty($startDate)) {
					$this->modx->log(modX::LOG_LEVEL_ERROR, 'Start date for student (Student ID: ' . $studentProfile->get('internalKey') . ') is empty!');
			    	return false;
				}
				$startDate = date('Ymd', $startDate);
				$startDate = new DateTime($startDate);
				$startDate->add(new DateInterval('P'.$certObj->get('anniversary').'Y'));
				$anniversaryDate = $startDate->format('F j, Y');
				$certificate->setAnniversary($certObj->get('anniversary'), $anniversaryDate);
				$fileName .= $certObj->get('anniversary') . '_';
				break;
			case 'hour':
				$certificate->setHours($certObj->get('hours'));
				$certificate->setDate($displayDate);
				$fileName .= $certObj->get('hours') . '_';
				break;
			case 'level':
				$classLevel = $certTpl->getOne('ClassLevel');
				$levelName = str_replace(' ', '_', strtolower($classLevel->get('name')));
				$fileName .= $levelName . '_';
				break;
		}
		//$fileName .= $student->get('username') . '.pdf';
		// toggle certificate flag
		$certObj->set('flag', 0);
		if (!$certObj->save()) {
			$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the certificate object after toggling flag!');
	    	return false;
		}
		
		switch (strtolower($typeName)) {
			
			case 'anniversary':
				break;
				
			case 'hour':
				break;
				
			case 'level':
				// get the corresponding journal object and set it's certificate status to 'printed'
				$progress = $this->modx->getObject('scClassProgress', array(
					'class_level_category_id' => $classLevel->get('class_level_category_id')
					,'student_id' => $student->get('id')
				));
				$journal = $progress->getOne('Journal');
				if ($journal) {
					if ($journal->get('next_level_id') == $certObj->get('level_id')) {
						$journal->set('certificate', 'printed');
						$journal->save();
					}
				} else {
					$this->modx->log(modX::LOG_LEVEL_ERROR, 'Could not update the student (ID: '.$student->get('id').') journal. It does not exist for the classProgress (ID: '.$progress->get('id').')');
				}
				break;
				
		}

        if ($download == true)
        {
            $rootPath = realpath( $path = $_SERVER['DOCUMENT_ROOT'] . '/pdf/certificates');
            $filename = $rootPath . "/" . $fileName . $studentProfile->get('firstname') . ' ' . $studentProfile->get('lastname') . ".pdf";
            $certificate->Output($filename,'F');

            // set headers and get ready to output!
            header('Content-type: application/pdf');
            header('Content-Disposition: attachment; filename="certificate.pdf"');
            header('Content-Length: ' . filesize($filename));
            readfile($filename);
        }
        else
        {
            $rootPath = realpath( $path = $_SERVER['DOCUMENT_ROOT'] . '/pdf/certificates');
            $filename = $rootPath . "/" . $fileName . $studentProfile->get('firstname') . ' ' . $studentProfile->get('lastname') . ".pdf";
            $certificate->Output($filename,'F');
        }
    }

    // Empties the certificate folder
    public function clearCertificateFolder()
    {
        $rootPath = realpath( $path = $_SERVER['DOCUMENT_ROOT'] . '/pdf/certificates');
        $fileToDelete = glob($rootPath . '/*');
        foreach($fileToDelete as $file){
            if(is_file($file))
                unlink($file);
        }
    }

    // Zips all the certificates in the specified folder and downloads the zip file. The files that are added to the zip file are then deleted
    public function ZipAndDownload()
    {
        $certificateFileName = "certificates.zip";
        // Get real path for our folder
        $rootPath = realpath( $path = $_SERVER['DOCUMENT_ROOT'] . '/pdf/certificates');

        // Initialize archive object
        $zip = new ZipArchive();
        $zip->open($rootPath . '/' . $certificateFileName, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        // Initialize empty "delete list"
        $filesToDelete = array();

        // Create recursive directory iterator
        /** @var SplFileInfo[] $files */
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($rootPath),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $name => $file)
        {
            // Skip directories (they would be added automatically)
            if (!$file->isDir())
            {
                // Get real and relative path for current file
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($rootPath) + 1);

                // Add current file to archive
                $zip->addFile($filePath, $relativePath);

                // Add current file to "delete list"
                // delete it later cause ZipArchive create archive only after calling close function and ZipArchive lock files until archive created)
                if ($file->getFilename() != $certificateFileName)
                {
                    $filesToDelete[] = $filePath;
                }
            }
        }

        // Zip archive will be created only after closing object
        $zip->close();

        //foreach ($filesToDelete as $file)
        //{
        //    unlink($file);
        //}

        // set headers and get ready to output!
        header('Content-type: application/zip');
        header('Content-Disposition: attachment; filename=' . $certificateFileName);
        header('Content-Length: ' . filesize($certificateFileName));
        header("Location: /pdf/certificates/" . $certificateFileName);
        readfile($rootPath . "/" . $certificateFileName);
    }
}
return 'scCertificateGenerateProcessor';