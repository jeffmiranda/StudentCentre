<?php
$xpdo_meta_map['scStudentTest']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'student_tests',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'level_id' => NULL,
    'student_id' => NULL,
    'type' => NULL,
    'comment' => NULL,
    'pass' => 0,
    'date_created' => NULL,
    'last_modified' => 'CURRENT_TIMESTAMP',
  ),
  'fieldMeta' => 
  array (
    'level_id' => 
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
    'type' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => false,
    ),
    'comment' => 
    array (
      'dbtype' => 'text',
      'phptype' => 'string',
      'null' => false,
    ),
    'pass' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => false,
      'default' => 0,
    ),
    'date_created' => 
    array (
      'dbtype' => 'datetime',
      'phptype' => 'datetime',
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
  'composites' => 
  array (
    'StudentTestTechnique' => 
    array (
      'class' => 'scStudentTestTechnique',
      'local' => 'id',
      'foreign' => 'student_test_id',
      'cardinality' => 'many',
      'owner' => 'local',
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
    'ClassLevel' => 
    array (
      'class' => 'scClassLevel',
      'local' => 'level_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
