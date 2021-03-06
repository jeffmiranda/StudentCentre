<?php
$xpdo_meta_map['scClassProgress']= array (
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
      'dbtype' => 'smallint',
      'precision' => '5',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'total_hours' => 
    array (
      'dbtype' => 'smallint',
      'precision' => '5',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
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
    'Class' => 
    array (
      'class' => 'scClass',
      'local' => 'class_id',
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
