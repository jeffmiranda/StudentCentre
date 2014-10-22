<?php
$xpdo_meta_map['scModUser']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'extends' => 'modUser',
  'fields' => 
  array (
  ),
  'fieldMeta' => 
  array (
  ),
  'composites' => 
  array (
    'StudentAssignment' => 
    array (
      'class' => 'scStudentAssignment',
      'local' => 'id',
      'foreign' => 'student_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'Comment' => 
    array (
      'class' => 'scComment',
      'local' => 'id',
      'foreign' => 'user_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'AssignmentEnrollment' => 
    array (
      'class' => 'scAssignmentEnrollment',
      'local' => 'id',
      'foreign' => 'student_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'Test' => 
    array (
      'class' => 'scTest',
      'local' => 'id',
      'foreign' => 'student_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'ClassProgress' => 
    array (
      'class' => 'scClassProgress',
      'local' => 'id',
      'foreign' => 'student_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'ClassEnrollment' => 
    array (
      'class' => 'scClassEnrollment',
      'local' => 'id',
      'foreign' => 'student_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'Attendance' => 
    array (
      'class' => 'scAttendance',
      'local' => 'id',
      'foreign' => 'student_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'StudentProfile' => 
    array (
      'class' => 'scStudentProfile',
      'local' => 'id',
      'foreign' => 'internalKey',
      'cardinality' => 'one',
      'owner' => 'local',
    ),
    'Certificate' => 
    array (
      'class' => 'scCertificate',
      'local' => 'id',
      'foreign' => 'student_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
