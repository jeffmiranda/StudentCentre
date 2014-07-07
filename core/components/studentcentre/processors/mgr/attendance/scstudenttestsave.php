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

$modx->log(1,print_r($scriptProperties,true));

// Get and sanitize the test variables
$levelId = $modx->getOption('level_id', $scriptProperties, '');
$studentId = $modx->getOption('student_id', $scriptProperties, '');
$testType = $modx->getOption('test_type', $scriptProperties, 'Pre-test');
$pass = $modx->getOption('pass', $scriptProperties, 0);
$comment = $modx->getOption('comment', $scriptProperties, '');
$dateCreated = date('Y-m-d');

if (empty($levelId) || empty($studentId)) {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Level ID or Student ID are empty!');
    return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_student_test'));
}

// Create the scStudentTest object
$studentTest = $modx->newObject('scStudentTest');
$studentTest->set('level_id', $levelId);
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
	$t = $modx->newObject('scStudentTestTechnique');
	$t->set('technique_id', $key);
	$t->set('pass', $value['pass']);
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
		$modx->log(modX::LOG_LEVEL_ERROR, 'Class Progress Retrieved!');
		return $modx->error->failure($modx->lexicon('studentcentre.att_err_promoting_student'));
	}
	
	// Get the current classLevel object
	$currentLevel = $classProgress->getOne('ClassLevel');
	
	// Get the next classLevel object
	$c = $modx->newQuery('scClassLevel');
	$c->where(array(
		'class_level_category_id' => $currentLevel->get('class_level_category_id')
		,'order:>' => $currentLevel->get('order')
		,'active' => 1
	));
	$c->sortby('`scClassLevel`.`order`','ASC');
	$c->limit(1,0);
	/*
	The reason we use getCollection instead of simply getObject is because classLevels
	can have float numbers for an order (i.e. 4.3). Since this is the case we need to 
	get all of the levels greater than the current level, sort them by order, and then 
	return only one
	*/
	$nextLevels = $modx->getCollection('scClassLevel',$c);
	if (empty($nextLevels)) {
		$modx->log(modX::LOG_LEVEL_ERROR, 'The next level could not be retrieved!');
		return $modx->error->failure($modx->lexicon('studentcentre.att_err_promoting_student'));
	}
	foreach ($nextLevels as $level) {
		$nextLevel = $level;
	}

	// Assign the next level id to the classProgress object
	// and update other values
	//error_log($nextLevel->get('id'));
	$classProgress->addOne($nextLevel);
	error_log($classProgress->get('level_id'));
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

/*
$scheduledClassId = $modx->getOption('scheduled_class', $scriptProperties, '');
$classDate = $modx->getOption('class_date', $scriptProperties, date('m/d/Y'));
$classDuration = $modx->getOption('class_duration', $scriptProperties, '');
$students = $modx->getOption('students', $scriptProperties, '');
$visitors = $modx->getOption('visitors', $scriptProperties, '');
$dateCreated = date('Y-m-d');

if (empty($students)) {
	//$modx->log(1,print_r($scriptProperties,true));
	$modx->log(modX::LOG_LEVEL_ERROR, 'No students were submitted therefore could not save attendance!');
    return $modx->error->failure($modx->lexicon('studentcentre.att_err_ns_att_stu'));
}

// Init array to contain all attending students/visitors
$attendees = array();

// Add all the students to the array
foreach ($students as $student) {
	if ($student['present']) {
		$attStudent = $modx->newObject('scAttendance',array(
			'student_id' => $student['student_id'],
			'scheduled_class_id' => $scheduledClassId,
			'test' => $student['test'],
			'hours' => $student['hours'],
			'date' => $classDate,
			'date_created' => $dateCreated
		));
		$attendees[] = $attStudent;
	}
}

if (!empty($visitors)) { // if there are visitors
	// Add all the visitors to the array
	foreach ($visitors as $visitor) {
		if ($visitor['student_id'] > 0) {
			$attVisitor = $modx->newObject('scAttendance',array(
				'student_id' => $visitor['student_id'],
				'scheduled_class_id' => $scheduledClassId,
				'test' => 0,
				'hours' => $visitor['hours'],
				'date' => $classDate,
				'date_created' => $dateCreated
			));
			$attendees[] = $attVisitor;
		}
	}
}

// get the class object from the sched class
$scheduledClass = $modx->getObject('scScheduledClass', $scheduledClassId);
$class = $scheduledClass->getOne('Class');

if (!empty($attendees)) {

	// loop through all attendees
	foreach ($attendees as $attendee) {
		
		// save attendance object to db
		if (!$attendee->save()) {
			$modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the attendee object!');
			return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_att'));
		}
		
		// if class progress object exists grab it
		$classProgress = $modx->getObject('scClassProgress', array(
			'class_id' => $class->get('id'),
			'student_id' => $attendee->get('student_id')
		));
		// else create a new one and assign the first level to it
		if (!$classProgress) {
			// get the first level of the class
			$classLevel = $modx->getObject('scClassLevel', array(
				'class_level_category_id' => $class->get('class_level_category_id'),
				'order' => 1
			));
			if (!$classLevel) {
				$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the first level of the class!');
				return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_stu_progress'));
			}
			$classProgress = $modx->newObject('scClassProgress', array(
				'class_id' => $class->get('id'),
				'student_id' => $attendee->get('student_id'),
				'level_id' => $classLevel->get('id'),
				'hours_since_leveling' => 0,
				'total_hours' => 0,
				'test_ready' => 0,
				'date_created' => date('Y-m-d')
			));
		}
			
		// increment hours of class progress object
		$classProgress->addHours($attendee->get('hours'));
		
		// !Threshold Test
		if ($classProgress->isTestReady()) {
			$classProgress->set('test_ready', 1);
		} else {
			$classProgress->set('test_ready', 0);
		}
	/*
		// get the level object
		if (!isset($classLevel)) {
			$classLevel = $classProgress->getOne('ClassLevel');
			if (!$classLevel) {
				$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the associated class level of the scClassProgress object!');
				return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_stu_progress'));
			}
		}
		// if hours since leveling / hours required is greater than test threshold
		// OR if testing checkbox has been checked
		$progressRatio = $classProgress->get('hours_since_leveling') / $classLevel->get('hours_required');
		if (($progressRatio >= $classLevel->get('test_threshold')) || ($attendee->get('test') == 1)) {
			// mark class progress object as test ready!
			$classProgress->set('test_ready', 1);
		}
	/*
		
		// save class progress object to db
		if (!$classProgress->save()) {
			$modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the class progress object!');
			return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_att'));
		}	
	
	}

} else {
	return $modx->error->failure($modx->lexicon('studentcentre.att_err_ns_att_stu'));
}

return $modx->error->success($modx->lexicon('studentcentre.att_saved'));
*/