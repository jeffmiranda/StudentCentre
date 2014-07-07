<?php
$xpdo_meta_map['scClassLevel']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'class_levels',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'class_level_category_id' => NULL,
    'name' => NULL,
    'description' => NULL,
    'hours_required' => NULL,
    'test_threshold' => 0.75,
    'order' => NULL,
    'active' => 1,
    'date_created' => NULL,
    'last_modified' => 'CURRENT_TIMESTAMP',
  ),
  'fieldMeta' => 
  array (
    'class_level_category_id' => 
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
    'hours_required' => 
    array (
      'dbtype' => 'smallint',
      'precision' => '5',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'test_threshold' => 
    array (
      'dbtype' => 'float',
      'attributes' => 'unsigned',
      'phptype' => 'float',
      'null' => false,
      'default' => 0.75,
    ),
    'order' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
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
    'Technique' => 
    array (
      'class' => 'scTechnique',
      'local' => 'id',
      'foreign' => 'level_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'Test' => 
    array (
      'class' => 'scTest',
      'local' => 'id',
      'foreign' => 'level_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
  'aggregates' => 
  array (
    'ClassLevelCategory' => 
    array (
      'class' => 'scClassLevelCategory',
      'local' => 'class_level_category_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
