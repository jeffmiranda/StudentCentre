<?php
$xpdo_meta_map['ClassProgress']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'class_progress',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'class_id' => NULL,
    'student_id' => NULL,
    'level_id' => NULL,
    'hours_since_leveling' => NULL,
    'total_hours' => NULL,
    'test_ready' => 0,
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
    'student_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'level_id' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'hours_since_leveling' => 
    array (
      'dbtype' => 'float',
      'attributes' => 'unsigned',
      'phptype' => 'float',
      'null' => false,
    ),
    'total_hours' => 
    array (
      'dbtype' => 'float',
      'attributes' => 'unsigned',
      'phptype' => 'float',
      'null' => false,
    ),
    'test_ready' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
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
);
