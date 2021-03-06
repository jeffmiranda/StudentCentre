<?php
$xpdo_meta_map['scAssignmentProgress']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'assignment_progress',
  'extends' => 'xPDOObject',
  'fields' => 
  array (
    'progress' => NULL,
    'date_created' => NULL,
    'last_modified' => 'CURRENT_TIMESTAMP',
  ),
  'fieldMeta' => 
  array (
    'progress' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '3',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'index' => 'pk',
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
  'indexes' => 
  array (
    'PRIMARY' => 
    array (
      'alias' => 'PRIMARY',
      'primary' => true,
      'unique' => true,
      'type' => 'BTREE',
      'columns' => 
      array (
        'progress' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
  'composites' => 
  array (
    'StudentAssignment' => 
    array (
      'class' => 'scStudentAssignment',
      'local' => 'progress',
      'foreign' => 'progress',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
