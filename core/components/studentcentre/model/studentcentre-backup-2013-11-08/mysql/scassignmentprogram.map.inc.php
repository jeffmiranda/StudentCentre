<?php
$xpdo_meta_map['scAssignmentProgram']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'assignment_programs',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'name' => NULL,
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
    'Level' => 
    array (
      'class' => 'scAssignmentLevel',
      'local' => 'id',
      'foreign' => 'program_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'Assignment' => 
    array (
      'class' => 'scAssignment',
      'local' => 'id',
      'foreign' => 'program_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'AssignmentEnrollment' => 
    array (
      'class' => 'scAssignmentEnrollment',
      'local' => 'id',
      'foreign' => 'program_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
