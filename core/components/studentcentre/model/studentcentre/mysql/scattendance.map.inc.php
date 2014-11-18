<?php
$xpdo_meta_map['scAttendance']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'attendance',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'student_id' => NULL,
    'scheduled_class_id' => NULL,
    'test' => 0,
    'hours' => NULL,
    'date' => NULL,
    'date_created' => NULL,
    'last_modified' => 'CURRENT_TIMESTAMP',
  ),
  'fieldMeta' => 
  array (
    'student_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'scheduled_class_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'test' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => false,
      'default' => 0,
    ),
    'hours' => 
    array (
      'dbtype' => 'decimal',
      'precision' => '3,2',
      'attributes' => 'unsigned',
      'phptype' => 'float',
      'null' => false,
    ),
    'date' => 
    array (
      'dbtype' => 'date',
      'phptype' => 'date',
      'null' => false,
    ),
    'date_created' => 
    array (
      'dbtype' => 'date',
      'phptype' => 'date',
      'null' => false,
    ),
    'last_modified' => 
    array (
      'dbtype' => 'timestamp',
      'phptype' => 'timestamp',
      'null' => false,
      'default' => 'CURRENT_TIMESTAMP',
      'extra' => 'on update current_timestamp',
    ),
  ),
  'aggregates' => 
  array (
    'Student' => 
    array (
      'class' => 'scModUser',
      'local' => 'student_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'ScheduledClass' => 
    array (
      'class' => 'scScheduledClass',
      'local' => 'scheduled_class_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
