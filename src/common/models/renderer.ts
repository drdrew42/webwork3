// This file contains a class used to provide rendering fields for typically
// problems.

// This also contains functionality for a mixin to pull in the functionality.

import { generic, Dictionary, ModelParams } from '.';
export interface LibraryParams {
	library_id?: number;
	file_path?: string;
	problem_pool_id?: number;
}

export interface RenderParamsFields extends Dictionary<generic> {
	problemSeed: number;
	permission_level: number;
	outputFormat: string;
	answerPrefix: string;
	showHints: boolean;
	showSolutions: boolean;
	showPreviewButton: boolean;
	showCheckAnswerButton: boolean;
	showCorrectAnswerButton: boolean;
	sourceFilePath: string;
}

// This provides fields to store rendering information as well as methods
// needed for rendering.

export class RenderParams extends ModelParams(
	// Boolean fields
	['showHints', 'showSolutions', 'showPreviewButton', 'showCheckAnswersButton',
		'showCorrectAnswersButton'],
	// Number fields
	['permission_level', 'problemSeed'],
	// String fields
	['outputFormat', 'answerPrefix', 'sourceFilePath'],  {
		problemSeed: { field_type: 'non_neg_int', default_value: 1234 },
		permission_level: { field_type: 'non_neg_int', default_value: 0 },
		outputFormat: { field_type: 'string', default_value: 'ww3' },
		answerPrefix: { field_type: 'string', default_value: '' },
		sourceFilePath: { field_type: 'string', default_value: '' },
		showHints: { field_type: 'boolean', default_value: false },
		showSolutions: { field_type: 'boolean', default_value: false },
		// TODO: drop the button booleans
		showPreviewButton: { field_type: 'boolean', default_value: false },
		showCheckAnswersButton: { field_type: 'boolean', default_value: false },
		showCorrectAnswersButton: { field_type: 'boolean', default_value: false }
	}) {

	constructor(params: Dictionary<generic> = {}) {
		super(params);
	}

}
