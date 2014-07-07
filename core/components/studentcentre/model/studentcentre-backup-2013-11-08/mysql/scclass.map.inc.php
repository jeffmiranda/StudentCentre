<?php
$xpdo_meta_map['scClass']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'classes',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'name' => NULL,
    'description' => NULL,
    'active' => 1,
    'date_created' => NULL,
    'last_modified' => 'CURRENT_TIMESTAMP',
  ),
  'fieldMeta' => 
  array (
    'name' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => false,
    ),
    'description' => 
    array (
      'dbtype' => 'text',
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
    'ClassLevel' => 
    array (
      'class' => 'scClassLevel',
      'local' => 'id',
      'foreign' => 'class_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'ClassProgress' => 
    array (
      'class' => 'scClassProgress',
      'local' => 'id',
      'foreign' => 'class_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'ScheduledClass' => 
    array (
      'class' => 'scScheduledClass',
      'local' => 'id',
      'foreign' => 'class_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
