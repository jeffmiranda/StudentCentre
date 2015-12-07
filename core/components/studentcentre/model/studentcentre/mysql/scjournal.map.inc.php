<?php
$xpdo_meta_map['scJournal']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'journal',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'class_progress_id' => NULL,
    'next_level_id' => NULL,
    'hours_since_leveling' => NULL,
    'belt' => 'notreceived',
    'certificate' => 'notreceived',
    'written_test_progress' => 0,
    'test_fee' => 0,
    'test_date' => NULL,
    'pre_test_qty' => 0,
    'active' => 0,
    'date_created' => NULL,
    'last_modified' => 'CURRENT_TIMESTAMP',
  ),
  'fieldMeta' => 
  array (
    'class_progress_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'next_level_id' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'hours_since_leveling' => 
    array (
      'dbtype' => 'decimal',
      'precision' => '6,2',
      'attributes' => 'unsigned',
      'phptype' => 'float',
      'null' => false,
    ),
    'belt' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => false,
      'default' => 'notreceived',
    ),
    'certificate' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => false,
      'default' => 'notreceived',
    ),
    'written_test_progress' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
    ),
    'test_fee' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => false,
      'default' => 0,
    ),
    'test_date' => 
    array (
      'dbtype' => 'date',
      'phptype' => 'date',
      'null' => true,
    ),
    'pre_test_qty' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
    ),
    'active' => 
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
    'JournalComment' => 
    array (
      'class' => 'scJournalComment',
      'local' => 'id',
      'foreign' => 'journal_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
  'aggregates' => 
  array (
    'ClassProgress' => 
    array (
      'class' => 'scClassProgress',
      'local' => 'class_progress_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'ClassLevel' => 
    array (
      'class' => 'scClassLevel',
      'local' => 'next_level_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
