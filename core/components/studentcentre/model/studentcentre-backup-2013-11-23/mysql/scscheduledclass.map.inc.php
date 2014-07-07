<?php
$xpdo_meta_map['scScheduledClass']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'scheduled_classes',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'class_id' => NULL,
    'location_id' => NULL,
    'start_date' => NULL,
    'end_date' => NULL,
    'start_time' => NULL,
    'day' => NULL,
    'repeat_frequency' => NULL,
    'active' => 1,
    'date_created' => NULL,
    'last_modified' => 'CURRENT_TIMESTAMP',
  ),
  'fieldMeta' => 
  array (
    'class_id' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'location_id' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'start_date' => 
    array (
      'dbtype' => 'date',
      'phptype' => 'date',
      'null' => false,
    ),
    'end_date' => 
    array (
      'dbtype' => 'datetime',
      'phptype' => 'datetime',
      'null' => false,
    ),
    'start_time' => 
    array (
      'dbtype' => 'datetime',
      'phptype' => 'datetime',
      'null' => false,
    ),
    'day' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => false,
    ),
    'repeat_frequency' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => false,
    ),
    'active' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => false,
      'default' => 1,
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
    ),
  ),
  'composites' => 
  array (
    'ClassEnrollment' => 
    array (
      'class' => 'scClassEnrollment',
      'local' => 'id',
      'foreign' => 'scheduled_class_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'Attendance' => 
    array (
      'class' => 'scAttendance',
      'local' => 'id',
      'foreign' => 'scheduled_class_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
  'aggregates' => 
  array (
    'Class' => 
    array (
      'class' => 'scClass',
      'local' => 'class_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'Location' => 
    array (
      'class' => 'scLocation',
      'local' => 'location_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
