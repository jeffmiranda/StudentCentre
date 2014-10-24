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
 * Receives form data and batch creates attendance records
 *
 * @package studentcentre
 */
if (!$modx->hasPermission('save_document')) return $modx->error->failure($modx->lexicon('access_denied'));

//$modx->log(1,print_r($scriptProperties,true));
$scheduledClassId = $modx->getOption('scheduled_class', $scriptProperties, '');
$classDate = $modx->getOption('class_date', $scriptProperties, date('Y-m-d'));
// get the class date in the right format
$classDate = date('Y-m-d', strtotime(str_replace('/','-',$classDate)));
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
				
		// if class progress object exists grab it
		$classProgress = $modx->getObject('scClassProgress', array(
			'class_level_category_id' => $class->get('class_level_category_id'),
			'student_id' => $attendee->get('student_id')
		));
		// else create a new one and assign the first level to it
		if (!$classProgress) {
			// get the first level of the class
			$classLevelCategory = $modx->getObject('scClassLevelCategory', $class->get('class_level_category_id'));
			if (!$classLevelCategory) {
				$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the class level category object!');
				return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_stu_progress'));
			}
			$firstLevel = $classLevelCategory->getFirstLevel();
			if (!$firstLevel) {
				$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the first level of the class!');
				return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_stu_progress'));
			}
/*
			$q = $modx->newQuery('scClassLevel');
			$q->where(array(
				'class_level_category_id' => $class->get('class_level_category_id')
				,'active' => 1
			));
			$q->sortby('`order`', 'ASC');
			$q->limit(1);
			//$q->prepare();
			//$modx->log(1,print_r('SQL Statement: ' . $q->toSQL(),true));			
			$classLevel = $modx->getObject('scClassLevel', $q);
			if (!$classLevel) {
				$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the first level of the class!');
				return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_stu_progress'));
			}
*/
			$classProgress = $modx->newObject('scClassProgress', array(
				'class_level_category_id' => $class->get('class_level_category_id'),
				'student_id' => $attendee->get('student_id'),
				'level_id' => $firstLevel->get('id'),
				'hours_since_leveling' => 0,
				'total_hours' => 0,
				'test_ready' => 0,
				'date_created' => date('Y-m-d')
			));
		}
		
		// get student object and begin determining hourly milestone
		$student = $modx->getObject('scModUser', $attendee->get('student_id'));
		if (!$student) {
			$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the student object!');
			return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_stu_progress'));
		}
		$gtHours = $student->getGrandTotalHours();
		$hourlyMilestones = $modx->getOption('studentcentre.hourly_milestones', $scriptProperties, '');
		if (empty($hourlyMilestones)) {
			$modx->log(modX::LOG_LEVEL_ERROR, 'Hourly milestones are empty! Please set them in System Settings.');
			return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_stu_progress'));
		}
		// get the certificate tpl type for hourly milestones
		$certType = $modx->getObject('scCertificateType', array(
			'name' => 'Hour'
		));
		if (!$certType) {
			$modx->log(modX::LOG_LEVEL_ERROR, 'Could not get the certificate type object.');
			return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_stu_progress'));
		}
		// get the hourly milestones from the system settings
		$arrHourlyMilestones = explode(',', str_replace(' ', '', $hourlyMilestones));
		foreach ($arrHourlyMilestones as $milestone) {
			if ($gtHours < $milestone && $milestone <= ($gtHours + $attendee->get('hours'))) {
				// create the certificate
				$newCertificate = $modx->newObject('scCertificate', array(
					'student_id' => $attendee->get('student_id')
					,'certificate_type_id' => $certType->get('id')
					,'hours' => $milestone
					,'flag' => 1
					,'date_created' => date('Y-m-d')
				));
				if (!$newCertificate->save()) {
				   $modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the newly created hourly certificate for studentId: ' . $attendee->get('student_id'));
				   return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_stu_progress'));
				}
			}
		}
			
		// increment hours of class progress object
		$classProgress->addHours($attendee->get('hours'));
		
		// !Threshold Test
		if ($classProgress->isTestReady() || ($attendee->get('test') == 1)) {
			$classProgress->set('test_ready', 1);
		} else {
			$classProgress->set('test_ready', 0);
		}
		
		// save attendance object to db
		if ($attendee->save()) {
			// save class progress object to db
			if (!$classProgress->save()) {
				$modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the class progress object!');
				return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_att'));
			}	
		} else {
			$modx->log(modX::LOG_LEVEL_ERROR, 'Could not save the attendee object!');
			return $modx->error->failure($modx->lexicon('studentcentre.att_err_saving_att'));
		}
	
	}

} else {
	return $modx->error->failure($modx->lexicon('studentcentre.att_err_ns_att_stu'));
}

return $modx->error->success($modx->lexicon('studentcentre.att_saved'));