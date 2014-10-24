<?php
$xpdo_meta_map['scCertificateType']= array (
  'package' => 'studentcentre',
  'version' => '1.1',
  'table' => 'certificate_types',
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
      'extra' => 'on update current_timestamp',
    ),
  ),
  'composites' => 
  array (
    'Certificate' => 
    array (
      'class' => 'scCertificate',
      'local' => 'id',
      'foreign' => 'certificate_type_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
    'CertificateTpl' => 
    array (
      'class' => 'scCertificateTpl',
      'local' => 'id',
      'foreign' => 'certificate_type_id',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
