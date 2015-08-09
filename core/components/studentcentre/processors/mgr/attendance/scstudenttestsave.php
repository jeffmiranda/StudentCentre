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
/**
 * Receives form data and creates a test record
 *
 * @package studentcentre
 */
if (!$modx->hasPermission('save_document')) return $modx->error->failure($modx->lexicon('access_denied'));

//$modx->log(1,print_r($scriptProperties,true));

// Get and sanitize the test variables
$nextLevelId = $modx->getOption('next_level_id', $scriptProperties, '');
$studentId = $modx->getOption('student_id', $scriptProperties, '');
$testType = $modx->getOption('test_type', $scriptProperties, 'Pre-test');
$pass = $modx->getOption('pass', $scriptProperties, 0);
$comment = $modx->getOption('comment', $scriptProperties, '');
$dateCreated = $modx->getOption('date_created', $scriptProperties, date('Y-m-d'));

if (empty($nextLevelId) || empty($studentId)) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Next Level ID or Student ID are empty!');
    return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_student_test'));
}

// Create the scStudentTest object
$studentTest = $modx->newObject('scStudentTest');
$studentTest->set('level_id', $nextLevelId);
$studentTest->set('student_id', $studentId);
$studentTest->set('type', $testType);
$studentTest->set('pass', $pass);
$studentTest->set('comment', $comment);
$studentTest->set('date_created', $dateCreated);

// Get and sanitize the technique variables
$techniques = $modx->getOption('techniques', $scriptProperties, '');
if (empty($techniques)) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Techniques array is empty!');
    return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_student_test'));
}

// Get the technique values and create the techniques
$techObjects = array(); // used to store the new technique objects we'll be creating
foreach($techniques as $key => $value) {
	// any character in the pass field will be interpreted as a pass (except for "0")
	$passValue = empty($value['pass']) ? 0 : 1;
	$t = $modx->newObject('scStudentTestTechnique');
	$t->set('technique_id', $key);
	$t->set('pass', $passValue);
	$t->set('comment', $value['comment']);
	$t->set('date_created', $dateCreated);
	$techObjects[] = $t;
}

// Add the techniques to the test and save
if (!$studentTest->addMany($techObjects, 'StudentTestTechnique')) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Could not add the techniques to the student test');
    return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_student_test'));
}
if (!$studentTest->save()) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the student test');
    return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_student_test'));
}

// If the test was real and passed promote the student
if ($studentTest->get('type') == 'Test' && $studentTest->get('pass') == 1) {

	// Get the classProgress object
	$classProgressId = $modx->getOption('class_progress_id', $scriptProperties, '');
	if (empty($classProgressId)) {
		$modx->log(modX::LOG_LEVEL_ERROR, '$classProgressId is empty!');
	    return $modx->error->failure($modx->lexicon('studentcentre.att_err_promoting_student'));
	}
	$classProgress = $modx->getObject('scClassProgress', $classProgressId);
	if (!$classProgress) {
		$modx->log(modX::LOG_LEVEL_ERROR, 'Class progress not retrieved!');
		return $modx->error->failure($modx->lexicon('studentcentre.att_err_promoting_student'));
	}

	// Get the next level object
	$nextLevel = $classProgress->getNextLevel();
	if (!$nextLevel) {
		$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the next level to promote the student!');
		return $modx->error->failure($modx->lexicon('studentcentre.att_err_promoting_student'));
	}

	// Assign the next level to the classProgress object
	// and update other values
	//error_log($nextLevel->get('id'));
	$classProgress->addOne($nextLevel);
	//error_log($classProgress->get('level_id'));
	$classProgress->set('hours_since_leveling', 0);
	$classProgress->set('test_ready', 0);
	if ($classProgress->save()) {
		return $modx->error->success($modx->lexicon('studentcentre.att_student_promoted'));
	} else {
		$modx->log(modX::LOG_LEVEL_ERROR, '$classProgress could not be saved!');
		return $modx->error->failure($modx->lexicon('studentcentre.att_err_promoting_student'));	
	}

}

return $modx->error->success($modx->lexicon('studentcentre.att_test_saved'));