<?php
$xpdo_meta_map['scTechnique']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'techniques',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'level_id' => NULL,
    'name' => NULL,
    'description' => NULL,
    'active' => 1,
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
      'extra' => 'on update current_timestamp',
    ),
  ),
  'composites' => 
  array (
    'LevelTechnique' => 
    array (
      'class' => 'scLevelTechnique',
      'local' => 'id',
      'foreign' => 'technique_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'StudentTestTechnique' => 
    array (
      'class' => 'scStudentTestTechnique',
      'local' => 'id',
      'foreign' => 'technique_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
