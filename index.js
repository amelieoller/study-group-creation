// Input your study group data below, make sure the time is in your own time (that's how it will add the study group)
// weekToStart represents the week you want to start that "series" of the same study group
// weekToEnd is when it ends
// so, weekToStart: 1 and weekToEnd: 1 will create only one study group in the upcoming week
// weekToStart: 2 and weekToEnd: 5 will create a study group 2 weeks from now and one each week after that until week 5 (that'll be 4 study groups total)

var sgData = [
	{
		categories: ['HTML Basics'],
		title: 'Test One',
		description: 'Come join.',
		day: 'Saturday',
		time: '10:30 am',
		weekToStart: 1,
		weekToEnd: 1,
		zoom: 'https://wework.zoom.us/my/amelie'
	},
	{
		categories: ['Intro to Ruby Development', 'Ruby'],
		title: 'Test Two',
		description: 'Come join.',
		day: 'Monday',
		time: '06:00 PM',
		weekToStart: 4,
		weekToEnd: 7,
		zoom: 'https://wework.zoom.us/my/amelie'
	}
];

// Shorten element selectors
const byId = id => document.getElementById(id);
const firstByClass = id => document.getElementsByClassName(id)[0];
const firstByName = id => document.getElementsByName(id)[0];

// Action functions
const openModal = async () => byId('js--new-button').click();
const closeModal = async () => byId('js--site-overlay').click();
const submit = async () => byId('js--submit').click();
const changeFocus = async () =>
	(firstByClass('selectize-dropdown multi plugin-remove_button').style =
		'display: none; width: 348px; top: 55px; left: 0px; visibility: visible;');

// Form filler functions
const addTitle = async title =>
	(firstByName('study_group[title]').value = title);

const addDescription = async description =>
	(firstByName('study_group[description]').value = description);

const removeExistingCategory = async () => {
	firstByClass('selectize-control multi plugin-remove_button')
		.getElementsByClassName(
			'selectize-input items required not-full has-options has-items'
		)[0]
		.children[0].getElementsByTagName('a')[0]
		.click();
};

const addNewCategory = async categories => {
	categories.map(cat => {
		firstByClass('selectize-dropdown multi plugin-remove_button')
			.querySelectorAll('[data-value]')
			.forEach(categoryNode => {
				if (categoryNode.innerText === cat) {
					categoryNode.click();
				}
			});
	});
};

const addDate = async date => {
	const dateToday = getFormattedDate(new Date());
	const todaysMonth = parseInt(dateToday.split('/')[0]);
	const futureMonth = parseInt(date.split('/')[0]);
	const diff = futureMonth - todaysMonth;

	if (diff > 0) {
		for (let i = 0; i < diff; i++) {
			firstByClass('picker__nav--next').click();
		}
	}

	byId('js--study-group-start-date_root')
		.querySelectorAll('[data-pick]')
		.forEach(dateNode => {
			if (dateNode.outerHTML.includes(date)) {
				dateNode.click();
			}
		});
};

const addTime = async time => {
	byId('js--study-group-start-time_root')
		.querySelectorAll('[data-pick]')
		.forEach(timeNode => {
			if (timeNode.innerHTML === time) {
				timeNode.click();
			}
		});
};

const addDuration = async () => (firstByName('duration').value = 1);

const addZoomUrl = async url =>
	(firstByName('study_group[custom_room_url]').value = url);

// Helper functions
const calculateDate = (day, week) => {
	const d = new Date();
	const dates = {
		Monday: 0,
		Tuesday: 1,
		Wednesday: 2,
		Thursday: 3,
		Friday: 4,
		Saturday: 5,
		Sunday: 6
	};

	d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7));
 	d.setDate(d.getDate() + dates[day]);

	// Add weeks
	d.setDate(d.getDate() + (7 * (week - 1)));

	return getFormattedDate(d);
};

const getFormattedDate = date => {
	const month = date.getMonth() + 1;
	const dayNum = date.getDate();

	// Returns date in this format: 07/25/2019
	return `${month < 10 ? `0${month}` : month}/${
		dayNum < 10 ? `0${dayNum}` : dayNum
	}/${date.getFullYear()}`;
};

const formatTime = time => {
	// If this errors out send an alert that the time is formatted wrong
	const validateTime = time =>
		/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?\s*[p, a]/.test(time);

	const hour = parseInt(time.split(':')[0]);
	const minutes = parseInt(time.split(':')[1].slice(0, 2));
	const amPm = time
		.split(':')[1]
		.slice(2, time.length - 1)
		.trim()
		.toLowerCase();

	const formattedTimeString = `${hour}:${minutes === 0 ? '00' : '30'} ${
		amPm.length >= 2 ? amPm[0] : amPm
	}.m.`;

	if (validateTime(time)) {
		return formattedTimeString;
	} else {
		alert(
			`You gotta fix your time for '${
				sg.title
			}', you wrote: '${time}'. Example of an accepted format: '6:00 pm'`
		);
	}
};

// Main function
const init = async () => {
	for await (sg of sgData) {
		const time = sg.time.toLowerCase();
		const formattedTime = formatTime(time);

		// Calling the range function with weekToStart being 2 and weekToEnd being 5: [...range(2, 5)] will e.g. return [2,3,4,5]
		function* range(weekToStart, weekToEnd) {
			yield weekToStart;
			if (weekToStart === weekToEnd) return;
			yield* range(weekToStart + 1, weekToEnd);
		}

		for await (week of [...range(sg.weekToStart, sg.weekToEnd)]) {
			await openModal();
			await addTitle(sg.title);
			await addDescription(sg.description);
			await removeExistingCategory();
			await changeFocus();
			await addNewCategory(sg.categories);
			await changeFocus();
			await addDate(calculateDate(sg.day, week));
			await addTime(formattedTime);
			await addDuration();
			await addZoomUrl(sg.zoom);
			await submit();
			await closeModal();
			console.log(`Successfully created: ${sg.title}`);
		}
	}
};

// Call init function
init();
