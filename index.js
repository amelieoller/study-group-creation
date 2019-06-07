// TODO
// Change to one hour
// Add more categories

var sgData = [
	{
		category: 'Intro to Ruby Development',
		title: 'Office Hours',
		description: 'Come join.',
		day: 'Saturday',
		time: '10:30 AM',
		name: 'Amelie',
		zoom: 'https://wework.zoom.us/my/amelie'
	}
];

function openModal() {
	return new Promise(function(resolve, reject) {
		document.getElementById('js--new-button').click();
		resolve();
	});
}

function addTitle(title) {
	return new Promise(function(resolve, reject) {
		document.getElementsByName('study_group[title]')[0].value = title;
		resolve();
	});
}

function addDescription(description) {
	return new Promise(function(resolve, reject) {
		document.getElementsByName(
			'study_group[description]'
		)[0].value = description;
		resolve();
	});
}

function removeExistingCat() {
	return new Promise(function(resolve, reject) {
		document
			.getElementsByClassName('selectize-control multi plugin-remove_button')[0]
			.getElementsByClassName(
				'selectize-input items required not-full has-options has-items'
			)[0]
			.children[0].getElementsByTagName('a')[0]
			.click();
		resolve();
	});
}

function addNewCat(category) {
	return new Promise(function(resolve, reject) {
		document
			.getElementsByClassName(
				'selectize-dropdown multi plugin-remove_button'
			)[0]
			.querySelectorAll('[data-value]')
			.forEach(categoryNode => {
				if (categoryNode.innerText === category) {
					categoryNode.click();
				}
			});
		resolve();
	});
}

function changeFocus() {
	return new Promise(function(resolve, reject) {
		document.getElementsByClassName(
			'selectize-dropdown multi plugin-remove_button'
		)[0].style =
			'display: none; width: 348px; top: 55px; left: 0px; visibility: visible;';
		resolve();
	});
}

function addDate(date) {
	return new Promise(function(resolve, reject) {
		document
			.getElementById('js--study-group-start-date_root')
			.querySelectorAll('[data-pick]')
			.forEach(dateNode => {
				if (dateNode.outerHTML.includes(date)) {
					dateNode.click();
				}
			});
		resolve();
	});
}

function addTime(time) {
	return new Promise(function(resolve, reject) {
		document
			.getElementById('js--study-group-start-time_root')
			.querySelectorAll('[data-pick]')
			.forEach(timeNode => {
				if (timeNode.innerHTML === time) {
					timeNode.click();
				}
			});
		resolve();
	});
}

function addZoomUrl(url) {
	return new Promise(function(resolve, reject) {
		document.getElementsByName('study_group[custom_room_url]')[0].value = url;
		resolve();
	});
}

function submit() {
	return new Promise(function(resolve, reject) {
		document.getElementById('js--submit').click();
		resolve();
	});
}

function closeModal() {
	return new Promise(function(resolve, reject) {
		document.getElementById('js--site-overlay').click();
		resolve();
	});
}

function nextWeek(day) {
	var d = new Date();
	var dates = {
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

	var month = d.getMonth() + 1;
	var dayNum = d.getDate();

	return `${month < 10 ? `0${month}` : month}/${
		dayNum < 10 ? `0${dayNum}` : dayNum
	}/${d.getFullYear()}`;
}

function init() {
	sgData.forEach(sg => {
		var title = sg.title;
		var description = sg.description;

		var time = sg.time.toLowerCase();
		openModal()
			.then(addTitle(title))
			.then(addDescription(description))
			.then(removeExistingCat())
			.then(changeFocus())
			.then(addNewCat(sg.category))
			.then(changeFocus())
			.then(addDate(nextWeek(sg.day)))
			.then(addTime(time.slice(0, time.length - 1) + '.m.'))
			.then(addZoomUrl(sg.zoom))
			.then(submit())
			.then(closeModal())
			.then(console.log(`Successfully created: ${sg.title}`));
	});
}
