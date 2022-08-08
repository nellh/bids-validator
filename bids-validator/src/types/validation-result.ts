import { DatasetIssues } from '../issues/datasetIssues.ts'

export interface SubjectMetadata {
  PARTICIPANT_ID: string
  age: number
  sex: string
  group: string
}
/*
    BodyPart: {},
    ScannerManufacturer: {},
    ScannerManufacturersModelName: {},
    TracerName: {},
    TracerRadionuclide: {},
*/

export interface Summary {
  sessions: Set<string>
  subjects: Set<string>
  subjectMetadata: SubjectMetadata[]
  tasks: Set<string>
  modalities: string[]
  secondaryModalities: string[]
  totalFiles: number
  size: number
  dataProcessed: boolean
  pet: Record<string, any>
}

export interface SummaryOutput {
  sessions: string[]
  subjects: string[]
  subjectMetadata: SubjectMetadata[]
  tasks: string[]
  modalities: string[]
  secondaryModalities: string[]
  totalFiles: number
  size: number
  dataProcessed: boolean
  pet: Record<string, any>
}

/**
 * The output of a validation run
 */
export interface ValidationResult {
  issues: DatasetIssues
  summary: SummaryOutput
}
