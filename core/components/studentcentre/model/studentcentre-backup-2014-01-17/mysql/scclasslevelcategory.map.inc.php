<?php
$xpdo_meta_map['scClassLevelCategory']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'class_level_categories',
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
    'Class' => 
    array (
      'class' => 'scClass',
      'local' => 'id',
      'foreign' => 'class_level_category_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'ClassLevel' => 
    array (
      'class' => 'scClassLevel',
      'local' => 'id',
      'foreign' => 'class_level_category_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
