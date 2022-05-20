/**
 * @jest-environment jsdom
 */
// The above is needed because the logger uses the window object, which is only present
// when using the jsdom environment.

import { Quiz, ProblemSet, ParseableQuizDates, ParseableQuizParams } from 'src/common/models/problem_sets';
import { BooleanParseException, NonNegIntException } from 'src/common/models/parsers';

describe('Testing for Quizzes', () => {

	const default_quiz_dates: ParseableQuizDates = {
		answer: 0,
		due: 0,
		open: 0
	};

	const default_quiz_params: ParseableQuizParams = {
		timed: false,
		quiz_duration: 0
	};

	const default_quiz = {
		set_dates: { ...default_quiz_dates },
		set_params: { ...default_quiz_params },
		set_id: 0,
		course_id: 0,
		set_name: '',
		set_visible: false,
		set_type: 'QUIZ'
	};

	describe('Create a new Quiz', () => {

		test('Test default Quiz', () => {
			const set = new Quiz();
			expect(set).toBeInstanceOf(Quiz);
			expect(set.toObject()).toStrictEqual(default_quiz);
		});

		test('Build a Quiz', () => {
			const quiz = new Quiz();
			expect(quiz).toBeInstanceOf(Quiz);
			expect(quiz).toBeInstanceOf(ProblemSet);
			const quiz1 = new Quiz({ set_name: 'HW #1', set_visible: 0 });

			expect(quiz.set_visible).toBeFalsy();
			expect(quiz1.set_name).toBe('HW #1');

			const quiz2 = new Quiz({
				course_id:4,
				set_dates: {
					answer: 1613951940,
					due: 1612137540,
					open: 1609545540,
				},
				set_id: 7,
				set_name: 'HW #1',
				set_params: {
					timed: true,
					quiz_duration: 30
				},
				set_visible: true
			});
			const params = {
				course_id: 4,
				set_dates: {
					answer: 1613951940,
					due: 1612137540,
					open: 1609545540,
				},
				set_id: 7,
				set_name: 'HW #1',
				set_params: {
					timed: true,
					quiz_duration: 30
				},
				set_type: 'QUIZ',
				set_visible: true
			};
			expect(quiz2.toObject()).toStrictEqual(params);

		});
	});

	describe('Check the Quiz Model is correct', () => {
		test('Check that calling all_fields() and params() is correct', () => {
			const quiz_fields = ['set_id', 'set_name', 'course_id', 'set_type', 'set_visible',
				'set_params', 'set_dates'];
			const quiz = new Quiz();

			expect(quiz.all_field_names.sort()).toStrictEqual(quiz_fields.sort());
			expect(quiz.param_fields.sort()).toStrictEqual(['set_dates', 'set_params']);

			expect(Quiz.ALL_FIELDS.sort()).toStrictEqual(quiz_fields.sort());

		});

		test('Check that cloning a Quiz works', () => {
			const quiz = new Quiz();
			expect(quiz.clone().toObject()).toStrictEqual(default_quiz);
			expect(quiz.clone()).toBeInstanceOf(Quiz);
		});
	});

	describe('Setting Quiz parameters', () => {
		test('Check that the quiz param defaults are working', () => {
			const quiz1 = new Quiz({ set_name: 'HW #1' });
			const quiz2 = new Quiz({ set_name: 'HW #1', set_params: { timed: false } });
			expect(quiz1).toStrictEqual(quiz2);
			const quiz3 = new Quiz({ set_name: 'HW #1', set_dates: {
				open: 0
			} });
			expect(quiz3.set_dates.open).toBe(quiz1.set_dates.open);
		});

		test('Test invalid Quiz params', () => {
			expect(() => { new Quiz({ set_id: -1 });}).toThrow(NonNegIntException);
			expect(() => { new Quiz({ set_id: '-1' });}).toThrow(NonNegIntException);
			expect(() => { new Quiz({ course_id: -1 });}).toThrow(NonNegIntException);
			expect(() => { new Quiz({ course_id: '-1' });}).toThrow(NonNegIntException);

			expect(() => { new Quiz({ set_visible: 'T' });}).toThrow(BooleanParseException);

		});

		test('Test valid Quiz params', () => {
			const quiz2 =  new Quiz();
			quiz2.set({ set_visible: true });
			expect(quiz2.set_visible).toBeTruthy();

			quiz2.set({ set_visible: false });
			expect(quiz2.set_visible).toBeFalsy();

			quiz2.set({ set_name: 'HW #9' });
			expect(quiz2.set_name).toBe('HW #9');
		});
	});

	describe('Setting Quiz Dates', () => {
		test('Test the quiz dates', () => {
			const quiz = new Quiz();
			quiz.set_params.set({ timed: true });
			expect(quiz.set_params.timed).toBeTruthy();

			quiz.set_dates.set({
				open: 0,
				due: 10,
				answer: 20
			});
			expect(quiz.hasValidDates()).toBeTruthy();

			quiz.set_dates.set({
				open: 0,
				due: 30,
				answer: 20
			});
			expect(quiz.hasValidDates()).toBeFalsy();

			quiz.set_dates.set({
				open: 100,
				due: 20,
				answer: 150
			});
			expect(quiz.hasValidDates()).toBeFalsy();

			quiz.set_params.set({ timed: false });
			expect(quiz.set_params.timed).toBeFalsy();

			quiz.set_dates.set({
				open: 0,
				due: 10,
				answer: 15
			});

			expect(quiz.hasValidDates()).toBeTruthy();
		});
	});
});
