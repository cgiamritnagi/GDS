//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit');
const router = govukPrototypeKit.requests.setupRouter();

// Add your routes here

// Run this code when a form is submitted to 'juggling-balls-answer'
router.post('/tutorial/juggling-balls-answer', function (req, res) {
  // Make a variable and give it the value from 'how-many-balls'
  var howManyBalls = req.session.data['how-many-balls'];

  // Check whether the variable matches a condition
  if (howManyBalls == '3 or more') {
    // Send user to next page
    res.redirect('/tutorial/juggling-trick');
  } else {
    // Send user to ineligible page
    res.redirect('/tutorial/ineligible');
  }
});

router.get('/fishing/start-again', function (req, res) {
  req.session.data = {}; // clears all session data
  res.redirect('/fishing/home'); // redirect to the home page
});

// Run this code when a form is submitted to 'fishing/date-of-birth-answer'
router.post('/fishing/date-of-birth-answer', function (req, res) {
  const day = req.session.data['dob-day'];
  const month = req.session.data['dob-month'];
  const year = req.session.data['dob-year'];

  // convert to a date
  const date = new Date(year, month - 1, day);
  // get today's date
  const today = new Date();
  // datediff today and date
  const ageDiff = today - date;
  const age = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));

  // Check whether the variable matches a condition
  if (age >= 16) {
    // Send user to next page
    res.redirect('/fishing/location');
  } else {
    // Send user to ineligible page
    res.redirect('/fishing/ineligible');
  }
});

router.get('/passport/start-again', function (req, res) {
  req.session.data = {}; // clears all session data
  res.redirect('/passport/home'); // redirect to the home page
});

// Run this code when a form is submitted to 'passport/check-location'
router.post('/passport/check-location', function (req, res) {
  var lostLocation = req.session.data['lostLocation'];

  if (lostLocation == 'Abroad') {
    res.redirect('/passport/lost-country');
  } else {
    res.redirect('/passport/check-your-answers');
  }
});

router.get('/travel/start-again', function (req, res) {
  req.session.data = {}; // clears all session data
  res.redirect('/travel/home'); // redirect to the home page
});

// Run this code when a form is submitted to 'travel/check-travelled'
router.post('/travel/check-travelled', function (req, res) {
  var travelled = req.session.data['travelled'];

  if (travelled == 'Yes') {
    res.redirect('/travel/add-trip');
  } else {
    res.redirect('/travel/not-travelled');
  }
});

router.post('/travel/add-trip', function (req, res) {
  let trips = req.session.data['trips'] || [];

  // Clear stale values before rendering form again
  delete req.session.data['country'];
  delete req.session.data['dateFrom-day'];
  delete req.session.data['dateFrom-month'];
  delete req.session.data['dateFrom-year'];
  delete req.session.data['dateTo-day'];
  delete req.session.data['dateTo-month'];
  delete req.session.data['dateTo-year'];

  // Get data from post body
  const country = req.body['country'];
  const from = `${req.body['dateFrom-day']}/${req.body['dateFrom-month']}/${req.body['dateFrom-year']}`;
  const to = `${req.body['dateTo-day']}/${req.body['dateTo-month']}/${req.body['dateTo-year']}`;
  const why = req.body['why'];

  // ✅ Save the trip using the submitted POST data
  trips.push({ country, from, to, why });
  req.session.data['trips'] = trips;

  // 🧽 Now clear those fields from session (optional, really just for UI)
  delete req.session.data['country'];
  delete req.session.data['dateFrom-day'];
  delete req.session.data['dateFrom-month'];
  delete req.session.data['dateFrom-year'];
  delete req.session.data['dateTo-day'];
  delete req.session.data['dateTo-month'];
  delete req.session.data['dateTo-year'];
  delete req.session.data['why'];

  res.redirect('/travel/another-trip');
});

router.post('/travel/another-trip', function (req, res) {
  if (req.session.data['anotherTrip'] === 'Yes') {
    //Clear data
    delete req.session.data['country'];
    delete req.session.data['dateFrom-day'];
    delete req.session.data['dateFrom-month'];
    delete req.session.data['dateFrom-year'];
    delete req.session.data['dateTo-day'];
    delete req.session.data['dateTo-month'];
    delete req.session.data['dateTo-year'];
    delete req.session.data['why'];

    res.redirect('/travel/add-trip');
  } else {
    res.redirect('/travel/check-my-answers');
  }
});

router.get('/travel/remove-trip', function (req, res) {
  const index = parseInt(req.query.index);
  const redirectTo = req.query.redirect || '/travel/check-my-answers';

  if (req.session.data['trips']) {
    req.session.data['trips'].splice(index, 1);
  }

  res.redirect(redirectTo);
});

router.get('/travel/edit-trip-entry', function (req, res) {
  const index = parseInt(req.query.index);
  const trips = req.session.data['trips'];

  if (!isNaN(index) && trips && trips[index]) {
    const trip = trips[index];

    const [fromDay, fromMonth, fromYear] = trip.from.split('/');
    const [toDay, toMonth, toYear] = trip.to.split('/');

    // Store values in session so the form can prefill
    req.session.data['editTripIndex'] = index;
    req.session.data['country'] = trip.country;
    req.session.data['dateFrom-day'] = fromDay;
    req.session.data['dateFrom-month'] = fromMonth;
    req.session.data['dateFrom-year'] = fromYear;
    req.session.data['dateTo-day'] = toDay;
    req.session.data['dateTo-month'] = toMonth;
    req.session.data['dateTo-year'] = toYear;
    req.session.data['why'] = trip.reason;
  }

  // Redirect to your edit-trip form page
  res.redirect('/travel/edit-trip');
});

router.post('/travel/update-trip', function (req, res) {
  const index = parseInt(req.body.index);
  const trips = req.session.data['trips'];

  if (!isNaN(index) && trips && trips[index]) {
    console.log(`Updating trip at index ${index}`);
    const country = req.body['country'];
    const from = `${req.body['dateFrom-day']}/${req.body['dateFrom-month']}/${req.body['dateFrom-year']}`;
    const to = `${req.body['dateTo-day']}/${req.body['dateTo-month']}/${req.body['dateTo-year']}`;
    const reason = req.body['why'];

    trips[index] = { country, from, to, reason };
  }

  res.redirect('/travel/another-trip');
});

router.get('/residency/start-again', function (req, res) {
  req.session.data = {}; // clears all session data
  res.redirect('/residency/home'); // redirect to the home page
});

router.post('/residency/check-next-upload', function (req, res) {
  if (!req.session.data['uploadedDocs']) {
    req.session.data['uploadedDocs'] = {};
  }

  const selectedTypes = req.session.data['docTypes'] || [];
  const uploaded = req.session.data['uploadedDocs'] || {};

  // Find the first document type that hasn't been uploaded to yet
  const next = selectedTypes.find(type => !uploaded[type] || uploaded[type].length === 0);

  if (next) {
    // Go upload for the next one
    res.redirect(`/residency/upload?type=${encodeURIComponent(next)}`);
  } else {
    // All done — redirect to check your answers or summary page
    res.redirect('/residency/check-your-docs');
  }
});

router.get('/residency/upload', function (req, res) {
  const docType = req.query.type;

  if (docType) {
    req.session.data['docType'] = docType;
  }

  res.render('residency/upload');
});

router.post('/residency/upload', function (req, res) {
  console.log('REQ.BODY:', req.body);

  const docType = req.body.docType;
  const fullPath = req.body.fileUpload || '';
  const filename = fullPath.split('\\').pop().split('/').pop();

  if (!req.session.data['uploadedDocs']) {
    req.session.data['uploadedDocs'] = {};
  }

  if (!req.session.data['uploadedDocs'][docType]) {
    req.session.data['uploadedDocs'][docType] = [];
  }

  if (filename) {
    req.session.data['uploadedDocs'][docType].push({ filename });
  }

  res.redirect(`/residency/upload?type=${docType}`);
});

router.get('/residency/remove-upload', function (req, res) {
  const docType = req.query.type;
  const index = parseInt(req.query.index);
  const redirectTo = req.query.redirect || 'upload';

  const docs = req.session.data['uploadedDocs'];

  if (docType && !isNaN(index) && docs && Array.isArray(docs[docType]) && docs[docType][index]) {
    docs[docType].splice(index, 1);
  }

  res.redirect(`/residency/${redirectTo}?type=${encodeURIComponent(docType)}`);
});

router.post('/grant/pre-ni', function (req, res) {
  // store address fields
  req.session.data.addressLine1 = req.body.addressLine1;
  req.session.data.addressLine2 = req.body.addressLine2;
  req.session.data.addressTown = req.body.addressTown;
  req.session.data.addressCounty = req.body.addressCounty;
  req.session.data.addressPostcode = req.body.addressPostcode;

  // Then go to the NI page properly
  res.redirect('/grant/ni');
});

router.get('/grant/ni', function (req, res) {
  res.render('grant/ni.html', {
    errors: [],
    data: req.session.data
  });
});

router.post('/grant/ni', function (req, res) {
  let rawNi = req.body.nationalInsuranceNumber || '';
  const cleanedNi = rawNi.replace(/\s+/g, '').toUpperCase();

  const niRegex = /^[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]$/;
  const errors = [];

  // 🔥 Store what the user typed so it shows again
  req.session.data.nationalInsuranceNumber = rawNi;

  if (!niRegex.test(cleanedNi)) {
    errors.push({
      text: 'Enter a valid National Insurance number',
      href: '#national-insurance-number'
    });

    return res.render('grant/ni.html', {
      errors,
      data: req.session.data
    });
  }

  // Save the cleaned version for check-my-answers
  req.session.data.cleanedNi = cleanedNi;

  res.redirect('/grant/bank-details');
});

router.post('/grant/bank-details', function (req, res) {
  const { nameOnTheAccount, sortCode, accountNumber, rollNumber } = req.body;
  const errors = [];
  let errorCount = 0;

  const sortCodeClean = sortCode?.replace(/\s+/g, '') || '';
  const formattedSortCode =
    sortCodeClean.length === 6
      ? `${sortCodeClean.slice(0, 2)}-${sortCodeClean.slice(2, 4)}-${sortCodeClean.slice(4)}`
      : sortCodeClean;

  // Store user input for redisplay
  req.session.data.nameOnTheAccount = nameOnTheAccount;
  req.session.data.sortCode = sortCode;
  req.session.data.formattedSortCode = formattedSortCode;
  req.session.data.accountNumber = accountNumber;
  req.session.data.rollNumber = rollNumber;

  // Basic validation
  if (!nameOnTheAccount || nameOnTheAccount.trim() === '') {
    errors.push({ text: 'Enter the name on the account', href: '#nameOnTheAccount' });
    errorCount += 1;
  } else {
    errors.push({ text: '', href: '#nameOnTheAccount' });
  }

  if (!sortCode || !/^\d{6}$/.test(sortCode.replace(/\s+/g, ''))) {
    errors.push({ text: 'Enter a valid sort code (6 digits)', href: '#sortCode' });
    errorCount += 1;
  } else {
    errors.push({ text: '', href: '#sortCode' });
  }

  if (!accountNumber || !/^\d{8}$/.test(accountNumber)) {
    errors.push({ text: 'Enter a valid account number (8 digits)', href: '#accountNumber' });
    errorCount += 1;
  } else {
    errors.push({ text: '', href: '#accountNumber' });
  }

  if (errors.length > 0 && errorCount > 0) {
    return res.render('grant/bank-details.html', {
      errors,
      data: req.session.data
    });
  }

  // ✅ All good – redirect to check answers
  res.redirect('/grant/check-my-answers');
});

router.post('/grant/check-confirmation', function (req, res) {
  const errors = [];
  let confirmValue = req.body.confirmDetails;

  // Always normalise to array
  if (!Array.isArray(confirmValue)) {
    confirmValue = [confirmValue];
  }

  // Remove _unchecked
  confirmValue = confirmValue.filter(v => v !== '_unchecked');

  console.log('Sanitised confirm value:', confirmValue);

  if (confirmValue.length === 0) {
    errors.push({
      text: 'You must confirm your details are correct',
      href: '#confirmDetails'
    });

    delete req.session.data.confirmDetails;

    return res.render('grant/check-my-answers.html', {
      errors,
      data: req.session.data
    });
  }

  // Optionally store in session if needed
  req.session.data.confirmDetails = confirmValue;

  res.redirect('/grant/confirmation');
});

router.get('/grant/start-again', function (req, res) {
  req.session.data = {}; // clears all session data
  res.redirect('/grant/home'); // redirect to the home page
});
