<?php
$xpdo_meta_map['scJournalComment']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'journal_comments',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'journal_id' => NULL,
    'comment' => NULL,
    'date_created' => NULL,
    'last_modified' => 'CURRENT_TIMESTAMP',
  ),
  'fieldMeta' => 
  array (
    'journal_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'comment' => 
    array (
      'dbtype' => 'text',
      'phptype' => 'string',
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
    'Journal' => 
    array (
      'class' => 'scJournal',
      'local' => 'journal_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
